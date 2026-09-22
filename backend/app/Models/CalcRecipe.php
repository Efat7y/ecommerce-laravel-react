<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalcRecipe extends Model
{
    protected $fillable = ['name', 'description', 'identifier'];

    public function ingredients()
    {
        return $this->hasMany(CalcRecipeIngredient::class, 'calc_recipe_id')->with('material');
    }
}
