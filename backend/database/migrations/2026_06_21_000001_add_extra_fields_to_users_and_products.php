<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->text('bio')->nullable();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('category')->default('خامات أساسية'); // خامات أساسية, روائح وعطور, ألوان, إضافات ومواد حافظة
            $table->string('unit')->default('كيلو جرام'); // كيلو جرام, برميل 120 كجم, شيكارة 25 كجم
            $table->integer('stock')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'phone', 'address', 'bio']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['category', 'unit', 'stock']);
        });
    }
};
