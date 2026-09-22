import re

with open('frontend/src/pages/Website/CartPage/hooks/useCartPage.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'subtotal,',
    'subtotal,\n    originalSubtotal,\n    totalFlashSavings,'
)

with open('frontend/src/pages/Website/CartPage/hooks/useCartPage.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated useCartPage.js")
