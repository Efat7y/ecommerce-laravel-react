<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalcMaterial extends Model
{
    protected $fillable = ['name', 'price_per_kg', 'type'];

    public function ingredients()
    {
        return $this->hasMany(CalcRecipeIngredient::class, 'calc_material_id');
    }
}
