<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalcRecipeIngredient extends Model
{
    protected $fillable = ['calc_recipe_id', 'calc_material_id', 'percentage'];

    public function material()
    {
        return $this->belongsTo(CalcMaterial::class, 'calc_material_id');
    }
}
