<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource (Admin).
     */
    public function index()
    {
        $coupons = Coupon::orderBy('created_at', 'desc')->get();
        return response()->json($coupons);
    }

    /**
     * Store a newly created resource in storage (Admin).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:coupons',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
            'is_public' => 'boolean',
            'allowed_tier' => 'in:all,standard,vip',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        if (isset($data['min_order_value']) && $data['min_order_value'] === null) {
            $data['min_order_value'] = 0;
        }

        $coupon = Coupon::create($data);

        return response()->json([
            'message' => 'Coupon created successfully',
            'coupon' => $coupon
        ], 201);
    }

    /**
     * Update the specified resource in storage (Admin).
     */
    public function update(Request $request, Coupon $coupon)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:coupons,code,' . $coupon->id,
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
            'is_public' => 'boolean',
            'allowed_tier' => 'in:all,standard,vip',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        if (isset($data['min_order_value']) && $data['min_order_value'] === null) {
            $data['min_order_value'] = 0;
        }

        $coupon->update($data);

        return response()->json([
            'message' => 'Coupon updated successfully',
            'coupon' => $coupon
        ]);
    }

    /**
     * Remove the specified resource from storage (Admin).
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return response()->json(['message' => 'Coupon deleted successfully']);
    }

    /**
     * Validate and apply a coupon (Customer).
     */
    public function apply(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'cart_total' => 'required|numeric|min:0'
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon) {
            return response()->json(['message' => 'كود الخصم غير صحيح'], 404);
        }

        if (!$coupon->is_active) {
            return response()->json(['message' => 'كود الخصم غير مفعل'], 400);
        }

        if ($coupon->expires_at && Carbon::now()->greaterThan($coupon->expires_at)) {
            return response()->json(['message' => 'كود الخصم منتهي الصلاحية'], 400);
        }

        if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
            return response()->json(['message' => 'تم تجاوز الحد الأقصى لاستخدام الكود'], 400);
        }

        // Check tier restriction
        if ($coupon->allowed_tier !== 'all') {
            $user = auth('sanctum')->user();
            if (!$user) {
                return response()->json(['message' => 'يجب تسجيل الدخول لاستخدام هذا الكود'], 401);
            }
            if ($user->tier !== $coupon->allowed_tier) {
                return response()->json(['message' => 'هذا الكود غير مخصص لحسابك'], 403);
            }
        }

        if ($request->cart_total < $coupon->min_order_value) {
            return response()->json([
                'message' => 'يجب أن تتجاوز قيمة المشتريات ' . $coupon->min_order_value . ' جنيه لاستخدام الكود'
            ], 400);
        }

        // Calculate discount
        $discount = 0;
        if ($coupon->type === 'fixed') {
            $discount = $coupon->value;
            // Prevent discount from being greater than cart total
            if ($discount > $request->cart_total) {
                $discount = $request->cart_total;
            }
        } else {
            $discount = ($coupon->value / 100) * $request->cart_total;
            if ($coupon->max_discount !== null && $discount > $coupon->max_discount) {
                $discount = $coupon->max_discount;
            }
        }

        return response()->json([
            'message' => 'تم تطبيق الكود بنجاح',
            'discount' => round($discount, 2),
            'coupon' => $coupon
        ]);
    }
    
    /**
     * Get all valid public coupons (Customer).
     */
    public function eligible(Request $request)
    {
        $user = auth('sanctum')->user();
        $userTier = $user ? $user->tier : null;

        $coupons = Coupon::where('is_active', true)
            ->where('is_public', true)
            ->where(function($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', Carbon::now());
            })
            ->where(function($query) {
                $query->whereNull('usage_limit')
                      ->orWhereRaw('used_count < usage_limit');
            })
            ->where(function($query) use ($userTier) {
                $query->where('allowed_tier', 'all');
                if ($userTier) {
                    $query->orWhere('allowed_tier', $userTier);
                }
            })
            ->get();
            
        return response()->json($coupons);
    }
}
