<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Api\CouponController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Guest / Public Auth Routes
Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/verify-otp', 'verifyOtp')->middleware('auth:sanctum');
});

// Public Product Catalog Routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Coupons (Public)
Route::post('/coupons/apply', [CouponController::class, 'apply']);
Route::get('/coupons/eligible', [CouponController::class, 'eligible']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    
    // User Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']); // Use POST to allow multipart/form-data (for avatar uploads)
    
    // Orders / Invoices
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);

    // Admin Specific Routes (Role check is enforced inside controllers)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    
    Route::get('/admin/orders', [OrderController::class, 'adminOrders']);
    Route::post('/admin/orders/create', [OrderController::class, 'storeAdminOrder']);
    Route::put('/admin/orders/{id}', [OrderController::class, 'updateAdminOrder']);
    Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::get('/admin/users', [UserController::class, 'adminUsers']);
    Route::post('/admin/users', [UserController::class, 'store']);
    Route::put('/admin/users/{id}/status', [UserController::class, 'updateStatus']);
    Route::put('/admin/users/{id}/tier', [UserController::class, 'updateTier']);
    Route::get('/admin/users/{id}/ledger', [PaymentController::class, 'getUserLedger']);
    Route::post('/admin/users/{id}/payments', [PaymentController::class, 'storePayment']);
    Route::post('/admin/settings', [SettingController::class, 'update']);
    
    // Coupons (Admin)
    Route::get('/admin/coupons', [CouponController::class, 'index']);
    Route::post('/admin/coupons', [CouponController::class, 'store']);
    Route::put('/admin/coupons/{coupon}', [CouponController::class, 'update']);
    Route::delete('/admin/coupons/{coupon}', [CouponController::class, 'destroy']);

    // Reviews (Authenticated User)
    Route::post('/products/{productId}/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);

    // Admin Messages
    Route::get('/admin/messages', [\App\Http\Controllers\MessageController::class, 'index']);
    Route::put('/admin/messages/{id}/read', [\App\Http\Controllers\MessageController::class, 'markAsRead']);
});

// Reviews (Public)
Route::get('/products/{productId}/reviews', [\App\Http\Controllers\ReviewController::class, 'index']);

// Contact Us (Public)
Route::post('/contact', [\App\Http\Controllers\MessageController::class, 'store']);

// Reactions (Public - can view counts)
Route::get('/products/{productId}/reactions', [\App\Http\Controllers\InteractionController::class, 'getProductReactions']);

// Wishlist (Public - can view own IDs if logged in via sanctum fallback, but strict auth is below)
Route::get('/wishlists/ids', [\App\Http\Controllers\InteractionController::class, 'getWishlistedIds']);

// Protected User Interactions
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products/{productId}/react', [\App\Http\Controllers\InteractionController::class, 'toggleReaction']);
    Route::post('/products/{productId}/wishlist', [\App\Http\Controllers\InteractionController::class, 'toggleWishlist']);
    Route::get('/wishlist', [\App\Http\Controllers\InteractionController::class, 'getUserWishlist']);
});
