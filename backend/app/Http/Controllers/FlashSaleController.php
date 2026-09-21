<?php

namespace App\Http\Controllers;

use App\Models\FlashSale;
use App\Models\FlashSaleProduct;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class FlashSaleController extends Controller
{
    // Public: Get active flash sale
    public function getActive()
    {
        $flashSale = FlashSale::with('products')
            ->where('is_active', true)
            ->where('end_time', '>', Carbon::now()->subHours(24))
            ->first();

        return response()->json($flashSale);
    }

    // Admin: Get all flash sales
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin' && $request->user()->email !== 'eslamzain8897@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json(FlashSale::with('products')->latest()->get());
    }

    // Admin: Create or update flash sale
    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin' && $request->user()->email !== 'eslamzain8897@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'nullable|string',
            'teaser_description' => 'nullable|string',
            'start_time' => 'nullable|date',
            'end_time' => 'required|date',
            'is_active' => 'boolean'
        ]);

        // Deactivate others if this is active
        if ($request->is_active !== false) {
            FlashSale::query()->update(['is_active' => false]);
        }

        $flashSale = FlashSale::create([
            'title' => $request->title,
            'teaser_description' => $request->teaser_description,
            'start_time' => $request->start_time ? Carbon::parse($request->start_time) : null,
            'end_time' => Carbon::parse($request->end_time),
            'is_active' => $request->is_active ?? true
        ]);

        return response()->json($flashSale);
    }

    // Admin: Update flash sale
    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin' && $request->user()->email !== 'eslamzain8897@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'nullable|string',
            'teaser_description' => 'nullable|string',
            'start_time' => 'nullable|date',
            'end_time' => 'required|date',
            'is_active' => 'boolean'
        ]);

        $flashSale = FlashSale::findOrFail($id);

        if ($request->is_active !== false) {
            FlashSale::where('id', '!=', $id)->update(['is_active' => false]);
        }

        $flashSale->update([
            'title' => $request->title,
            'teaser_description' => $request->teaser_description,
            'start_time' => $request->start_time ? Carbon::parse($request->start_time) : null,
            'end_time' => Carbon::parse($request->end_time),
            'is_active' => $request->is_active ?? true
        ]);

        return response()->json($flashSale->load('products'));
    }

    // Admin: Add/Sync products to flash sale
    public function syncProducts(Request $request, $id)
    {
        if ($request->user()->role !== 'admin' && $request->user()->email !== 'eslamzain8897@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.discount_price' => 'required|numeric|min:0',
        ]);

        $flashSale = FlashSale::findOrFail($id);

        DB::beginTransaction();
        try {
            // Delete old products
            FlashSaleProduct::where('flash_sale_id', $flashSale->id)->delete();

            // Insert new ones
            foreach ($request->products as $prod) {
                FlashSaleProduct::create([
                    'flash_sale_id' => $flashSale->id,
                    'product_id' => $prod['product_id'],
                    'discount_price' => $prod['discount_price'],
                ]);
            }
            DB::commit();

            return response()->json($flashSale->load('products'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Admin: Delete flash sale
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin' && $request->user()->email !== 'eslamzain8897@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        FlashSale::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}



