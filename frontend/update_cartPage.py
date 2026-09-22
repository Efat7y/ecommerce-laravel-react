import re

with open('frontend/src/pages/Website/CartPage/CartPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'subtotal,',
    'subtotal,\n    totalFlashSavings,'
)

content = content.replace(
    '<CheckoutSummary\n              subtotal={subtotal}',
    '<CheckoutSummary\n              subtotal={subtotal}\n              totalFlashSavings={totalFlashSavings}'
)

with open('frontend/src/pages/Website/CartPage/CartPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CartPage.jsx")
