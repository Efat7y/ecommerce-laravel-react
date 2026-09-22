<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlashSaleProduct extends Model
{
    protected $fillable = [
        'flash_sale_id', 
        'product_id', 
        'discount_price', 
        'flash_quantity', 
        'flash_sold'
    ];
}
