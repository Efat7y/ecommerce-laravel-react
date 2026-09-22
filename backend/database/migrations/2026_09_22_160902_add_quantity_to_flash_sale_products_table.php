<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('flash_sale_products', function (Blueprint $table) {
            $table->integer('flash_quantity')->nullable()->after('discount_price');
            $table->integer('flash_sold')->default(0)->after('flash_quantity');
        });
    }

    public function down(): void
    {
        Schema::table('flash_sale_products', function (Blueprint $table) {
            $table->dropColumn(['flash_quantity', 'flash_sold']);
        });
    }
};
