<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CalcMaterial;
use App\Models\CalcRecipe;
use App\Models\CalcRecipeIngredient;

class SmartCalculatorSeeder extends Seeder
{
    public function run(): void
    {
        // Define materials with estimated prices
        $materials = [
            ['name' => 'سلفونيك', 'price_per_kg' => 60, 'type' => 'active'],
            ['name' => 'تكسابون', 'price_per_kg' => 85, 'type' => 'active'],
            ['name' => 'صودا كاوية', 'price_per_kg' => 30, 'type' => 'active'],
            ['name' => 'تايلوز', 'price_per_kg' => 120, 'type' => 'active'],
            ['name' => 'لون أصفر', 'price_per_kg' => 150, 'type' => 'neutral'],
            ['name' => 'لون أخضر', 'price_per_kg' => 150, 'type' => 'neutral'],
            ['name' => 'لون أزرق', 'price_per_kg' => 150, 'type' => 'neutral'],
            ['name' => 'ريحة ليمون', 'price_per_kg' => 200, 'type' => 'neutral'],
            ['name' => 'ريحة تفاح', 'price_per_kg' => 200, 'type' => 'neutral'],
            ['name' => 'عطر برسيل', 'price_per_kg' => 250, 'type' => 'neutral'],
            ['name' => 'مادة حافظة', 'price_per_kg' => 45, 'type' => 'neutral'],
            ['name' => 'مياه', 'price_per_kg' => 0.05, 'type' => 'filler'],
            ['name' => 'ملح', 'price_per_kg' => 2, 'type' => 'filler'],
            ['name' => 'فات كحول', 'price_per_kg' => 70, 'type' => 'active'],
            ['name' => 'مانع رغوة', 'price_per_kg' => 90, 'type' => 'neutral'],
            ['name' => 'إنزيمات نظافة', 'price_per_kg' => 300, 'type' => 'active'],
        ];

        $matMap = [];
        foreach ($materials as $mat) {
            $created = CalcMaterial::updateOrCreate(['name' => $mat['name']], $mat);
            $matMap[$mat['name']] = $created->id;
        }

        // Define Recipes
        $recipes = [
            [
                'name' => 'بريل أصفر (ليمون)',
                'identifier' => 'pril_yellow',
                'ingredients' => [
                    ['name' => 'سلفونيك', 'percentage' => 10],
                    ['name' => 'تكسابون', 'percentage' => 2.5],
                    ['name' => 'صودا كاوية', 'percentage' => 1.5],
                    ['name' => 'تايلوز', 'percentage' => 0.2],
                    ['name' => 'لون أصفر', 'percentage' => 0.01],
                    ['name' => 'ريحة ليمون', 'percentage' => 0.15],
                    ['name' => 'مادة حافظة', 'percentage' => 0.1],
                    ['name' => 'مياه', 'percentage' => 85.54],
                ]
            ],
            [
                'name' => 'برسيل جيل',
                'identifier' => 'persil_gel',
                'ingredients' => [
                    ['name' => 'سلفونيك', 'percentage' => 12],
                    ['name' => 'تكسابون', 'percentage' => 3],
                    ['name' => 'صودا كاوية', 'percentage' => 1.8],
                    ['name' => 'فات كحول', 'percentage' => 1],
                    ['name' => 'مانع رغوة', 'percentage' => 0.1],
                    ['name' => 'إنزيمات نظافة', 'percentage' => 0.5],
                    ['name' => 'عطر برسيل', 'percentage' => 0.3],
                    ['name' => 'لون أزرق', 'percentage' => 0.01],
                    ['name' => 'مادة حافظة', 'percentage' => 0.1],
                    ['name' => 'مياه', 'percentage' => 81.19],
                ]
            ]
        ];

        foreach ($recipes as $recipeData) {
            $recipe = CalcRecipe::updateOrCreate(
                ['identifier' => $recipeData['identifier']],
                ['name' => $recipeData['name'], 'description' => 'التركيبة القياسية لتصنيع ' . $recipeData['name']]
            );

            // clear old
            CalcRecipeIngredient::where('calc_recipe_id', $recipe->id)->delete();

            foreach ($recipeData['ingredients'] as $ing) {
                CalcRecipeIngredient::create([
                    'calc_recipe_id' => $recipe->id,
                    'calc_material_id' => $matMap[$ing['name']],
                    'percentage' => $ing['percentage']
                ]);
            }
        }
    }
}
