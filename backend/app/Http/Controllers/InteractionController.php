<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Reaction;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class InteractionController extends Controller
{
    // Toggle Facebook-like Reaction
    public function toggleReaction(Request $request, $productId)
    {
        $request->validate(['type' => 'required|string']);
        $user = Auth::user();
        
        $reaction = Reaction::where('user_id', $user->id)->where('product_id', $productId)->first();
        
        if ($reaction) {
            if ($reaction->type === $request->type) {
                // If same reaction clicked, remove it (unlike)
                $reaction->delete();
                return response()->json(['message' => 'Reaction removed', 'action' => 'removed']);
            } else {
                // Change reaction type
                $reaction->update(['type' => $request->type]);
                return response()->json(['message' => 'Reaction updated', 'action' => 'updated', 'type' => $request->type]);
            }
        } else {
            // Create new reaction
            Reaction::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'type' => $request->type
            ]);
            return response()->json(['message' => 'Reaction added', 'action' => 'added', 'type' => $request->type]);
        }
    }

    // Get reactions for a specific product
    public function getProductReactions($productId)
    {
        $reactions = Reaction::where('product_id', $productId)
            ->select('type', \DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get();
            
        $userReaction = null;
        if (Auth::guard('sanctum')->check()) {
            $userReaction = Reaction::where('user_id', Auth::guard('sanctum')->id())->where('product_id', $productId)->value('type');
        }

        return response()->json([
            'counts' => $reactions,
            'user_reaction' => $userReaction
        ]);
    }

    // Toggle Wishlist
    public function toggleWishlist($productId)
    {
        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', $user->id)->where('product_id', $productId)->first();

        if ($wishlist) {
            $wishlist->delete();
            return response()->json(['message' => 'Removed from wishlist', 'in_wishlist' => false]);
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId
            ]);
            return response()->json(['message' => 'Added to wishlist', 'in_wishlist' => true]);
        }
    }

    // Get User Wishlist
    public function getUserWishlist()
    {
        $wishlists = Wishlist::with('product')->where('user_id', Auth::id())->latest()->get();
        return response()->json($wishlists);
    }
    
    // Get array of wishlisted product IDs for current user (for UI toggles)
    public function getWishlistedIds()
    {
        if (Auth::guard('sanctum')->check()) {
            $ids = Wishlist::where('user_id', Auth::guard('sanctum')->id())->pluck('product_id');
            return response()->json($ids);
        }
        return response()->json([]);
    }
}
