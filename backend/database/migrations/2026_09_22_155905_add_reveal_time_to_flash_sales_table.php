<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('flash_sales', function (Blueprint $table) {
            $table->dateTime('products_reveal_time')->nullable()->after('teaser_description');
        });
    }

    public function down(): void
    {
        Schema::table('flash_sales', function (Blueprint $table) {
            $table->dropColumn('products_reveal_time');
        });
    }
};
