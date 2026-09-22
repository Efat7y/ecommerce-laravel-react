import re

with open('frontend/src/pages/Website/CartPage/CartPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'<CheckoutSummary\s+subtotal=\{subtotal\}\s+totalFlashSavings=\{totalFlashSavings\}',
    '<CheckoutSummary\n              subtotal={subtotal}\n              totalFlashSavings={totalFlashSavings}\n              originalSubtotal={originalSubtotal}',
    content
)

with open('frontend/src/pages/Website/CartPage/CartPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CartPage.jsx checkout summary props")
