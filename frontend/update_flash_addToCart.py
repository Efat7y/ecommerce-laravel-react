import re

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'addToCart({ ...product, price: flashPrice });',
    'addToCart({ ...product, price: flashPrice, original_price: product.price });'
)

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated FlashSaleSection")
