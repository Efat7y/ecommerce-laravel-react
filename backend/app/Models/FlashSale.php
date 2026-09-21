<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlashSale extends Model
{
    protected $fillable = ['title', 'teaser_description', 'start_time', 'end_time', 'is_active'];
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_active' => 'boolean'
    ];

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'flash_sale_products')->withPivot('discount_price');
    }
}

