<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CalcMaterial;
use App\Models\CalcRecipe;
use App\Models\CalcRecipeIngredient;

class SmartCalculatorController extends Controller
{
    // GET /api/smart-calculator/materials
    public function getMaterials()
    {
        return response()->json(CalcMaterial::all());
    }

    // POST /api/smart-calculator/materials
    public function storeMaterial(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price_per_kg' => 'required|numeric|min:0',
            'type' => 'required|in:active,filler,neutral'
        ]);

        $material = CalcMaterial::create($request->all());
        return response()->json($material, 201);
    }

    // PUT /api/smart-calculator/materials/{id}
    public function updateMaterial(Request $request, $id)
    {
        $material = CalcMaterial::findOrFail($id);
        
        $request->validate([
            'name' => 'string',
            'price_per_kg' => 'numeric|min:0',
            'type' => 'in:active,filler,neutral'
        ]);

        $material->update($request->all());
        return response()->json($material);
    }

    // DELETE /api/smart-calculator/materials/{id}
    public function destroyMaterial($id)
    {
        CalcMaterial::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // GET /api/smart-calculator/recipes
    public function getRecipes()
    {
        $recipes = CalcRecipe::with('ingredients.material')->get();
        return response()->json($recipes);
    }

    // POST /api/smart-calculator/recipes
    public function storeRecipe(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'identifier' => 'required|string|unique:calc_recipes',
            'ingredients' => 'required|array',
            'ingredients.*.calc_material_id' => 'required|exists:calc_materials,id',
            'ingredients.*.percentage' => 'required|numeric|min:0'
        ]);

        $recipe = CalcRecipe::create([
            'name' => $request->name,
            'identifier' => $request->identifier,
            'description' => $request->description
        ]);

        foreach ($request->ingredients as $ing) {
            CalcRecipeIngredient::create([
                'calc_recipe_id' => $recipe->id,
                'calc_material_id' => $ing['calc_material_id'],
                'percentage' => $ing['percentage']
            ]);
        }

        return response()->json($recipe->load('ingredients.material'), 201);
    }
}
