<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$categories = App\Models\Category::all();

$descriptions = [
    'خامات أساسية' => 'مجموعة متكاملة من الخامات الأساسية عالية الجودة التي تدخل في صميم الصناعات وتعتبر حجر الأساس لمنتجاتك.',
    'روائح وعطور' => 'تشكيلة واسعة من الزيوت العطرية والروائح المركزة لإضافة لمسة عطرية مميزة وجذابة لمنتجاتك النهائية.',
    'ألوان' => 'ألوان طبيعية وصناعية بمختلف الدرجات، مصممة لإعطاء منتجاتك المظهر المثالي والثبات الطويل.',
    'إضافات ومواد حافظة' => 'مواد حافظة وإضافات كيميائية معتمدة لضمان استقرار منتجاتك وزيادة فترة صلاحيتها بأمان تام.',
];

foreach ($categories as $c) {
    if (isset($descriptions[$c->name])) {
        $c->description = $descriptions[$c->name];
        $c->save();
        echo "Updated: {$c->name}\n";
    } else {
        $c->description = "أفضل الخامات وأعلاها جودة في قسم {$c->name} بأسعار تنافسية تلبي احتياجات مصنعك.";
        $c->save();
        echo "Default updated: {$c->name}\n";
    }
}
echo "Done.\n";
