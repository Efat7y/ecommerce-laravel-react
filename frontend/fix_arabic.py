import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix garbled Arabic
content = re.sub(
    r'<span>O U,O3O1O:</span>',
    r'<span>السعر:</span>',
    content
)

content = re.sub(
    r'<span>O U,UU.USOc:</span>',
    r'<span>الكمية:</span>',
    content
)

content = re.sub(
    r'placeholder="O U,UU,"',
    r'placeholder="مفتوح"',
    content
)

content = re.sub(
    r'placeholder="U.U\?OU\^O-"',
    r'placeholder="مفتوح"',
    content
)

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed Arabic encoding")
