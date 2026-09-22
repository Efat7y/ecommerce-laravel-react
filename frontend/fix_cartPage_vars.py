import re

with open('frontend/src/pages/Website/CartPage/CartPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'subtotal,\s*totalFlashSavings,',
    'subtotal,\n      totalFlashSavings,\n      originalSubtotal,',
    content
)

with open('frontend/src/pages/Website/CartPage/CartPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CartPage.jsx variables")
