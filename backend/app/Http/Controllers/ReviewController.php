<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Review;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index($productId)
    {
        $reviews = Review::with('user:id,name,avatar')->where('product_id', $productId)->latest()->get();
        return response()->json($reviews);
    }

    public function store(Request $request, $productId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $product = Product::findOrFail($productId);

        // Check if user already reviewed
        $existing = Review::where('user_id', Auth::id())->where('product_id', $productId)->first();
        if ($existing) {
            return response()->json(['message' => 'لقد قمت بتقييم هذا المنتج مسبقاً'], 400);
        }

        $review = Review::create([
            'user_id' => Auth::id(),
            'product_id' => $productId,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return response()->json(['message' => 'تم إضافة التقييم بنجاح', 'review' => $review->load('user:id,name,avatar')], 201);
    }
}
