import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Labels to match his mental model perfectly
content = re.sub(
    r'<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">وقت ظهور المنتجات \(ترقب السعر\) \(اختياري\)</label>',
    '<label className="block text-sm mb-1 font-bold text-blue-600 dark:text-blue-400">وقت بدء ظهور المنتجات (قفل السعر)</label>',
    content
)

content = re.sub(
    r'<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">وقت فك القفل وبدء العرض \(أساسي\)</label>',
    '<label className="block text-sm mb-1 font-bold text-green-600 dark:text-green-400">وقت فتح القفل (بدء العرض الفعلي)</label>',
    content
)

content = re.sub(
    r'<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">وقت نهاية العرض</label>',
    '<label className="block text-sm mb-1 font-bold text-red-600 dark:text-red-400">وقت انتهاء العرض</label>',
    content
)

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Dashboard labels updated")
