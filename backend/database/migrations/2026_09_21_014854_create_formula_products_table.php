<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('formula_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formula_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->decimal('quantity', 8, 2);
            $table->string('unit')->default('kg');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('formula_products');
    }
};
