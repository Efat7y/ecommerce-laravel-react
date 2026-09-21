<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formula extends Model
{
    protected $fillable = ['title', 'description', 'image', 'is_active', 'batch_size'];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'formula_products')
                    ->withPivot('quantity', 'unit', 'price_per_unit');
    }
}

