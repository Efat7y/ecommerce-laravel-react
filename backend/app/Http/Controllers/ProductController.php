<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'vendor']);
        
        // If a vendor is logged in and requesting dashboard products, maybe filter them.
        // But for public API (which this index is used for), we return all products.
        // For admin/vendor dashboard, they might pass a ?dashboard=1 parameter
        if ($request->query('dashboard')) {
            $user = $request->user();
            if ($user && $user->role === 'vendor') {
                $query->where('vendor_id', $user->id);
            }
        }
        
        return response()->json($query->get());
    }

    public function show($id)
    {
        return response()->json(Product::with(['category', 'vendor'])->findOrFail($id));
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['admin', 'vendor'])) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'unit' => 'required|string',
            'stock' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'vendor_id' => 'nullable|exists:users,id'
        ]);

        $data = $request->all();

        if ($user->role === 'vendor') {
            $data['vendor_id'] = $user->id; // Enforce vendor ID
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = url('storage/' . $path);
        }

        $product = Product::create($data);
        return response()->json($product->load(['category', 'vendor']), 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['admin', 'vendor'])) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

        $product = Product::findOrFail($id);
        
        if ($user->role === 'vendor' && $product->vendor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized access to this product'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
            'category_id' => 'sometimes|required|exists:categories,id',
            'unit' => 'sometimes|required|string',
            'stock' => 'sometimes|required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'vendor_id' => 'nullable|exists:users,id'
        ]);

        $data = $request->all();
        
        if ($user->role === 'vendor') {
            unset($data['vendor_id']); // Vendor cannot change product owner
        }

        if ($request->hasFile('image')) {
            if ($product->image) {
                $oldPath = str_replace(url('storage') . '/', '', $product->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = url('storage/' . $path);
        }

        $product->update($data);
        return response()->json($product->load(['category', 'vendor']));
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['admin', 'vendor'])) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }
        
        $product = Product::findOrFail($id);
        
        if ($user->role === 'vendor' && $product->vendor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized access to this product'], 403);
        }

        if ($product->image) {
            $oldPath = str_replace(url('storage') . '/', '', $product->image);
            Storage::disk('public')->delete($oldPath);
        }

        $product->delete();
        return response()->json(['message' => 'deleted']);
    }
}