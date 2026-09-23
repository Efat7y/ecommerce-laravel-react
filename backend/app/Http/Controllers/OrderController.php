<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Setting;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Place a new order
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'phone' => 'required|string',
            'notes' => 'nullable|string',
            'payment_method' => 'nullable|in:cash,credit'
        ]);

        $user = $request->user();
        
        try {
            $order = DB::transaction(function () use ($request, $user) {
                $subtotal = 0;
                $totalFlashDiscount = 0;
                $itemsToCreate = [];

                foreach ($request->items as $itemData) {
                    $product = Product::lockForUpdate()->findOrFail($itemData['product_id']);
                    
                    // Check stock
                    if ($product->stock < $itemData['quantity']) {
                        throw new \Exception("عذراً، المخزون غير كافي لمنتج: {$product->name}. المتوفر حالياً: {$product->stock} فقط.");
                    }

                    // Decrement stock
                    $product->decrement('stock', $itemData['quantity']);

                    // Check Flash Sale Price
                    $actualPrice = $product->price;
                    $flashSale = \App\Models\FlashSale::where('is_active', true)
                        ->where('end_time', '>', \Carbon\Carbon::now())
                        ->first();
                    
                    if ($flashSale) {
                        $flashSaleProduct = \App\Models\FlashSaleProduct::where('flash_sale_id', $flashSale->id)
                            ->where('product_id', $product->id)
                            ->first();
                        if ($flashSaleProduct) {
                            $actualPrice = $flashSaleProduct->discount_price;
                            if ($flashSaleProduct->flash_quantity !== null) {
                                // Prevent exceeding available flash quantity if desired, 
                                // but for now just increment flash_sold
                                $flashSaleProduct->increment('flash_sold', $itemData['quantity']);
                            }
                        }
                    }

                                        $itemTotal = $actualPrice * $itemData['quantity'];
                    $originalItemTotal = $product->price * $itemData['quantity'];
                    
                    // Add the original price to the subtotal
                    $subtotal += $originalItemTotal;
                    
                    // Accumulate the flash sale savings
                    $totalFlashDiscount += ($originalItemTotal - $itemTotal);

                    $itemsToCreate[] = [
                        'product_id' => $product->id,
                        'quantity' => $itemData['quantity'],
                        'price' => $product->price, // Store original price
                        'total_price' => $originalItemTotal, // Store original total
                    ];
                }

                // Check and apply dynamic coupon
                $discount = $totalFlashDiscount;
                $coupon_id = null;
                
                if ($request->has('coupon_code')) {
                    $coupon = \App\Models\Coupon::where('code', $request->coupon_code)->first();
                    
                    if ($coupon && $coupon->is_active) {
                        $isValid = true;
                        if ($coupon->expires_at && \Carbon\Carbon::now()->greaterThan($coupon->expires_at)) {
                            $isValid = false;
                        }
                        if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
                            $isValid = false;
                        }
                        if ($subtotal < $coupon->min_order_value) {
                            $isValid = false;
                        }
                        
                        if ($isValid) {
                            $coupon_id = $coupon->id;
                                                        if ($coupon->type === 'fixed') {
                                $couponDiscount = min($coupon->value, $subtotal - $totalFlashDiscount);
                            } else {
                                $couponDiscount = ($coupon->value / 100) * ($subtotal - $totalFlashDiscount);
                                if ($coupon->max_discount !== null && $couponDiscount > $coupon->max_discount) {
                                    $couponDiscount = $coupon->max_discount;
                                }
                            }
                            $discount += $couponDiscount;
                            
                            // Increment usage
                            $coupon->increment('used_count');
                        }
                    }
                }

                // Add shipping fee
                $shippingFeeSetting = Setting::where('key', 'shipping_fee')->first();
                $shippingFee = $shippingFeeSetting ? (int)$shippingFeeSetting->value : 0;
                
                $total = $subtotal - $discount + $shippingFee;

                // Create Order
                $order = Order::create([
                    'user_id' => $user->id,
                    'subtotal' => $subtotal,
                    'discount' => $discount,
                    'shipping_fee' => $shippingFee,
                    'total' => $total,
                    'status' => 'pending',
                    'shipping_address' => $request->shipping_address,
                    'phone' => $request->phone,
                    'notes' => $request->notes,
                    'payment_method' => $request->payment_method ?? 'cash',
                    'coupon_id' => $coupon_id,
                ]);

                // Create Order Items
                foreach ($itemsToCreate as $item) {
                    $item['order_id'] = $order->id;
                    OrderItem::create($item);
                }

                return $order;
            });

            return response()->json([
                'message' => 'تم تسجيل الطلب بنجاح',
                'order' => $order->load('items.product')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    // Get order history for the authenticated user
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.product')
            ->latest()
            ->get();

        return response()->json($orders);
    }

    // Show details for a specific order (invoice)
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $order = Order::with(['user', 'items.product'])->findOrFail($id);

        // Check if user is owner or admin
        if ($order->user_id !== $user->id) {
            return response()->json(['message' => 'غير مصرح لك بالوصول لهذا الطلب.'], 403);
        }

        return response()->json($order);
    }

    // Customer: Update their own order (only if pending)
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        // Ensure the order belongs to the user
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow edits if status is pending
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Cannot edit an order that is already processing or completed'], 400);
        }

        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash,credit',
            'shipping_address' => 'nullable|string',
            'phone' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            $subtotal = 0;
            $discount = $order->discount;
            
            // Restore stock for old items
            foreach ($order->items as $oldItem) {
                $product = Product::find($oldItem->product_id);
                if ($product) {
                    $product->stock += $oldItem->quantity;
                    $product->save();
                }
            }
            
            // Delete old items
            $order->items()->delete();

            // Validate new items, calculate subtotal and deduct stock
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                if ($product->stock < $item['quantity']) {
                    \Illuminate\Support\Facades\DB::rollBack();
                    return response()->json(['message' => 'Not enough stock for ' . $product->name], 400);
                }
                $subtotal += ($product->price * $item['quantity']);
                
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'total_price' => $product->price * $item['quantity'],
                ]);
                
                $product->stock -= $item['quantity'];
                $product->save();
            }

            
                // Add shipping fee
                $shippingFeeSetting = Setting::where('key', 'shipping_fee')->first();
                $shippingFee = $shippingFeeSetting ? (int)$shippingFeeSetting->value : 0;
                
                $total = $subtotal - $discount + $shippingFee;

            $order->update([
                'subtotal' => $subtotal,
                'total' => $total,
                'shipping_fee' => $shippingFee,
                'payment_method' => $request->payment_method,
                'shipping_address' => $request->shipping_address,
                'phone' => $request->phone,
                'notes' => $request->notes,
            ]);

            \Illuminate\Support\Facades\DB::commit();

            return response()->json(Order::with(['user', 'items.product'])->find($order->id), 200);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json(['message' => 'Failed to update order', 'error' => $e->getMessage()], 500);
        }
    }

    // Admin: List all orders
    public function adminOrders(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'vendor'])) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

        $query = Order::with(['user']);

        if ($user->role === 'vendor') {
            // Only orders that contain this vendor's products
            $query->whereHas('items.product', function ($q) use ($user) {
                $q->where('vendor_id', $user->id);
            });
            // Only load this vendor's items
            $query->with(['items' => function ($q) use ($user) {
                $q->whereHas('product', function ($q2) use ($user) {
                    $q2->where('vendor_id', $user->id);
                })->with('product');
            }]);
        } else {
            $query->with('items.product');
        }

        $orders = $query->latest()->get();

        // Recalculate totals for vendor display (so they don't see other vendor's money)
        if ($user->role === 'vendor') {
            $orders->transform(function ($order) {
                $vendorSubtotal = $order->items->sum('total_price');
                $order->subtotal = $vendorSubtotal;
                $order->total = $vendorSubtotal; // Ignoring global shipping/discount for vendor view
                return $order;
            });
        }

        return response()->json($orders);
    }

    // Admin: Edit an existing order
    public function updateAdminOrder(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash,credit',
            'shipping_address' => 'nullable|string',
            'phone' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            $order = Order::findOrFail($id);

            $subtotal = 0;
            $discount = $order->discount; // Keep existing discount or update if needed
            
            // Restore stock for old items
            foreach ($order->items as $oldItem) {
                $product = Product::find($oldItem->product_id);
                if ($product) {
                    $product->stock += $oldItem->quantity;
                    $product->save();
                }
            }
            
            // Delete old items
            $order->items()->delete();

            // Validate new items, calculate subtotal and deduct stock
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                if ($product->stock < $item['quantity']) {
                    \Illuminate\Support\Facades\DB::rollBack();
                    return response()->json(['message' => 'Not enough stock for ' . $product->name], 400);
                }
                $subtotal += ($product->price * $item['quantity']);
                
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'total_price' => $product->price * $item['quantity'],
                ]);
                
                $product->stock -= $item['quantity'];
                $product->save();
            }

            
                // Add shipping fee
                $shippingFeeSetting = Setting::where('key', 'shipping_fee')->first();
                $shippingFee = $shippingFeeSetting ? (int)$shippingFeeSetting->value : 0;
                
                $total = $subtotal - $discount + $shippingFee;

            $order->update([
                'subtotal' => $subtotal,
                'total' => $total,
                'shipping_fee' => $shippingFee,
                'payment_method' => $request->payment_method,
                'shipping_address' => $request->shipping_address,
                'phone' => $request->phone,
                'notes' => $request->notes,
            ]);

            \Illuminate\Support\Facades\DB::commit();

            return response()->json(Order::with(['user', 'items.product'])->find($order->id), 200);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json(['message' => 'Failed to update order', 'error' => $e->getMessage()], 500);
        }
    }

    // Admin: Update order status
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,processing,shipped,completed,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'تم تحديث حالة الطلب بنجاح.',
            'order' => $order->load('items.product')
        ]);
    }

    // Admin: Create order on behalf of a customer
    public function storeAdminOrder(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash,credit',
            'shipping_address' => 'nullable|string',
            'phone' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            $subtotal = 0;
            $discount = 0; // future logic if needed
            
            // Validate items and calculate subtotal
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                if ($product->stock < $item['quantity']) {
                    return response()->json(['message' => 'Not enough stock for ' . $product->name], 400);
                }
                $subtotal += ($product->price * $item['quantity']);
            }

            
                // Add shipping fee
                $shippingFeeSetting = Setting::where('key', 'shipping_fee')->first();
                $shippingFee = $shippingFeeSetting ? (int)$shippingFeeSetting->value : 0;
                
                $total = $subtotal - $discount + $shippingFee;

            $order = Order::create([
                'user_id' => $request->user_id,
                'subtotal' => $subtotal,
                'discount' => $discount,
                    'shipping_fee' => $shippingFee,
                'total' => $total,
                'shipping_fee' => $shippingFee,
                'status' => 'completed', // Admin created it, probably already finalized
                'payment_method' => $request->payment_method,
                'payment_status' => 'unpaid',
                'shipping_address' => $request->shipping_address ?? 'Store Pickup',
                'phone' => $request->phone ?? '',
                'notes' => $request->notes,
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'total_price' => $product->price * $item['quantity'],
                ]);
                
                // update stock
                $product->stock -= $item['quantity'];
                $product->save();
            }

            \Illuminate\Support\Facades\DB::commit();

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('items.product')
            ], 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json(['message' => 'Failed to create order', 'error' => $e->getMessage()], 500);
        }
    }
}

