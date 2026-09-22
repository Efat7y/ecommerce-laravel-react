<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calc_materials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price_per_kg', 10, 2)->default(0);
            $table->enum('type', ['active', 'filler', 'neutral'])->default('active'); // active=expensive chemical to scale down, filler=water to scale up
            $table->timestamps();
        });

        Schema::create('calc_recipes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "بريل أصفر"
            $table->text('description')->nullable();
            $table->string('identifier')->unique(); // e.g., "pril_yellow"
            $table->timestamps();
        });

        Schema::create('calc_recipe_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('calc_recipe_id')->constrained('calc_recipes')->onDelete('cascade');
            $table->foreignId('calc_material_id')->constrained('calc_materials')->onDelete('cascade');
            $table->decimal('percentage', 8, 4); // standard percentage (e.g., 10.00 for 10%)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calc_recipe_ingredients');
        Schema::dropIfExists('calc_recipes');
        Schema::dropIfExists('calc_materials');
    }
};
