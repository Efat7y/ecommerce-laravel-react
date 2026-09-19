<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'تكسابون (ماليزي 70%)',
                'description' => 'مادة فعالة سطحية (SLES) عالية الرغوة، تستخدم كأساس في صناعة الشامبو، شاور جل، وصابون الأطباق.',
                'price' => 4500.00,
                'image' => null,
                'category_name' => 'خامات أساسية',
                'unit' => 'برميل 120 كجم',
                'stock' => 10,
            ],
            [
                'name' => 'تكسابون (بالكيلو)',
                'description' => 'مادة تكسابون عالية الرغوة تباع بالكيلو للتركيبات الصغيرة والتجارب.',
                'price' => 45.00,
                'image' => null,
                'category_name' => 'خامات أساسية',
                'unit' => 'كيلو جرام',
                'stock' => 500,
            ],
            [
                'name' => 'تايلوز ألماني (100 كجم)',
                'description' => 'بودرة تايلوز (HEC) عالية الجودة لتغليظ القوام ورفع لزوجة المنظفات السائلة.',
                'price' => 4800.00,
                'image' => null,
                'category_name' => 'خامات أساسية',
                'unit' => 'شيكارة 25 كجم',
                'stock' => 15,
            ],
            [
                'name' => 'تايلوز كوري (بالكيلو)',
                'description' => 'بودرة مغلظة لقوام الصابون السائل والمنظفات جل سريعة الانتشار والتذويب.',
                'price' => 210.00,
                'image' => null,
                'category_name' => 'خامات أساسية',
                'unit' => 'كيلو جرام',
                'stock' => 100,
            ],
            [
                'name' => 'سلفونيك الفتح (برميل كامل)',
                'description' => 'حمض السلفونيك الغازي النقي، ممتاز للشفافية والنظافة، المادة الفعالة الأساسية للصابون السائل والمنظفات الشعبية.',
                'price' => 3200.00,
                'image' => null,
                'category_name' => 'خامات أساسية',
                'unit' => 'برميل 50 كجم',
                'stock' => 20,
            ],
            [
                'name' => 'سلفونيك الفتح (بالكيلو)',
                'description' => 'حمض السلفونيك النقي ممتاز الشفافة والتعادل لتركيبات الصابون السائل والمنظفات.',
                'price' => 70.00,
                'image' => null,
                'category_name' => 'خامات أساسية',
                'unit' => 'كيلو جرام',
                'stock' => 800,
            ],
            [
                'name' => 'صودا كاوية',
                'description' => 'هيدروكسيد الصوديوم النقي 99% قشور، تستخدم لمعادلة حمض السلفونيك  وصناعة الصابون السائل والمنظفات.',
                'price' => 1200.00,
                'image' => null,
                'category_name' => 'خامات أساسية',
                'unit' => 'شيكارة 25 كجم',
                'stock' => 30,
            ],
            [
                'name' => 'رائحة ليمون زيتية مركزة',
                'description' => 'عطر زيتي فواح فائق التركيز برائحة الليمون المنعش، مخصص للصابون السائل ومنظفات الأطباق ومقاوم للحرارة والتعادل.',
                'price' => 450.00,
                'image' => null,
                'category_name' => 'روائح وعطور',
                'unit' => 'عبوة 1 كجم',
                'stock' => 50,
            ],
            [
                'name' => 'رائحة لافندر زيتية مركزة',
                'description' => 'عطر زيتي فرنسي مركز برائحة اللاف ندر (الخزامى) الهادئة، يستخدم في منعمات الأقمشة (داوني) ومعطرات الجو والأرضيات.',
                'price' => 500.00,
                'image' => null,
                'category_name' => 'روائح وعطور',
                'unit' => 'عبوة 1 كجم',
                'stock' => 40,
            ],
            [
                'name' => 'لون أزرق منظفات مائي',
                'description' => 'صبغة زرقاء مركزة سريعة الذوبان في الماء، مخصصة لتلوين الصابون السائل، الكلوركس الألوان، ومنظف  الزجاج.',
                'price' => 180.00,
                'image' => null,
                'category_name' => 'ألوان',
                'unit' => 'عبوة 1 كجم',
                'stock' => 60,
            ],
            [
                'name' => 'لون أصفر منظفات مائي',
                'description' => 'صبغة صفراء زاهية فائقة النقاوة، ممتازة لتلوين صابون الأطباق برائحة الليمون.',
                'price' => 180.00,
                'image' => null,
                'category_name' => 'ألوان',
                'unit' => 'عبوة 1 كجم',
                'stock' => 60,
            ],
            [
                'name' => 'جلسرين طبي نقاوة عالية',
                'description' => 'جلسرين طبيعي نقي يستخدم كمطري ومحسن للملمس في صابون الأيدي، الشاور جل، والمنظفات لحماية البشرة من الجف اف .',
                'price' => 150.00,
                'image' => null,
                'category_name' => 'إضافات ومواد حافظة',
                'unit' => 'عبوة 1 كجم',
                'stock' => 100,
            ],
            [
                'name' => 'فورمالين حافظ نقي',
                'description' => 'مادة حافظة فعالة جداً تمنع تعفن وتحلل المواد العضوية في المنظفات وتطيل صلاحية المنتج النهائي.',
                'price' => 90.00,
                'image' => null,
                'category_name' => 'إضافات ومواد حافظة',
                'unit' => 'عبوة 1 كجم',
                'stock' => 150,
            ],
        ];

        foreach ($products as $productData) {
            $catName = $productData['category_name'];
            $cat = Category::firstOrCreate(
                ['name' => $catName],
                ['slug' => Str::slug($catName, '-')]
            );

            unset($productData['category_name']);
            $productData['category_id'] = $cat->id;

            Product::create($productData);
        }
    }
}
