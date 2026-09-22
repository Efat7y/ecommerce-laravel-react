import re

with open('frontend/src/pages/Website/CartPage/CartPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'subtotal,\n      totalFlashSavings,',
    'subtotal,\n      totalFlashSavings,\n      originalSubtotal,'
)

with open('frontend/src/pages/Website/CartPage/CartPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CartPage.jsx variables")
