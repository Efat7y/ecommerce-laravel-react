import re

with open('frontend/src/pages/Website/CartPage/components/CheckoutSummary.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '  subtotal,\n  totalFlashSavings,\n  shippingFee,',
    '  subtotal,\n  totalFlashSavings,\n  originalSubtotal,\n  shippingFee,'
)

with open('frontend/src/pages/Website/CartPage/components/CheckoutSummary.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CheckoutSummary props")
