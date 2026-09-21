<?php

namespace App\Http\Controllers;

use App\Models\Formula;
use App\Models\FormulaProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FormulaController extends Controller
{
    // Public
    public function getActive()
    {
        return response()->json(
            Formula::with('products')->where('is_active', true)->get()
        );
    }

    // Admin: List all
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin' && $request->user()->email !== 'eslamzain8897@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json(Formula::with('products')->latest()->get());
    }

    // Admin: Create
    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin' && $request->user()->email !== 'eslamzain8897@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'batch_size' => 'nullable|integer',
        ]);

        $formula = Formula::create($request->all());
        return response()->json($formula);
    }

    // Admin: Update
    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin' && $request->user()->email !== 'eslamzain8897@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'batch_size' => 'nullable|integer',
        ]);

        $formula = Formula::findOrFail($id);
        $formula->update($request->all());
        return response()->json($formula);
    }

    // Admin: Delete
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin' && $request->user()->email !== 'eslamzain8897@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        Formula::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    // Admin: Sync Products
    public function syncProducts(Request $request, $id)
    {
        if ($request->user()->role !== 'admin' && $request->user()->email !== 'eslamzain8897@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $request->validate([
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|numeric|min:0',
            'products.*.unit' => 'required|string',
            'products.*.price_per_unit' => 'required|numeric|min:0',
        ]);

        $formula = Formula::findOrFail($id);

        DB::beginTransaction();
        try {
            DB::table('formula_products')->where('formula_id', $formula->id)->delete();

            foreach ($request->products as $prod) {
                DB::table('formula_products')->insert([
                    'formula_id' => $formula->id,
                    'product_id' => $prod['product_id'],
                    'quantity' => $prod['quantity'],
                    'unit' => $prod['unit'] ?? 'kg',
                    'price_per_unit' => $prod['price_per_unit'] ?? 0,
                ]);
            }
            DB::commit();
            return response()->json($formula->load('products'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}


