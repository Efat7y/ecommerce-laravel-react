import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">\s*U\^U,O O,UU\^O.*?</label>',
    '<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">وقت ظهور المنتجات (ترقب السعر) (اختياري)</label>',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">\s*U\^U,O U\?U O U,U,U\?U,.*?</label>',
    '<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">وقت فك القفل وبدء العرض (أساسي)</label>',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">\s*U\^U,O O U,U\+OUO.*?</label>',
    '<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">وقت نهاية العرض</label>',
    content,
    flags=re.DOTALL
)

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed arabic labels")
