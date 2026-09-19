<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'شركة الفتح للمنظفات', 'type' => 'string'],
            ['key' => 'site_description', 'value' => 'الشركة الرائدة في مجال المنظفات والخامات الكيميائية', 'type' => 'string'],
            ['key' => 'shipping_fee', 'value' => '50', 'type' => 'integer'],
            ['key' => 'whatsapp_number', 'value' => '01000000000', 'type' => 'string'],
            ['key' => 'facebook_url', 'value' => 'https://facebook.com', 'type' => 'string'],
            ['key' => 'logo', 'value' => null, 'type' => 'file'],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
