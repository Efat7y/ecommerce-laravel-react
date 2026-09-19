<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'مسؤول النظام (الآدمن)',
            'email' => 'eslamzain8897@gmail.com',
            'password' => Hash::make('123456'),
            'role' => 'admin',
            'phone' => '01012345678',
            'address' => 'القاهرة، مصر',
            'bio' => 'مسؤول إدارة متجر خامات المنظفات والطلبات.',
        ]);

        // Create Regular Customer User
        User::create([
            'name' => 'عميل تجريبي',
            'email' => 'customer@example.com',
            'password' => Hash::make('123456'),
            'role' => 'user',
            'phone' => '01234567890',
            'address' => 'الجيزة، الدقي، مصر',
            'bio' => 'عميل تجاري مهتم بشراء خامات الصابون والروائح.',
        ]);

        // Seed Products
        $this->call([
            ProductSeeder::class,
        ]);
    }
}
