import re

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'autoplay={{ delay: 3000, disableOnInteraction: false }}',
    'autoplay={{ delay: 10000, disableOnInteraction: false }}'
)

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Swiper delay to 10 seconds")
