import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all those garbled texts with unicode sequences
# Garbled text for price: O U,O3O1O: -> <span>\u0627\u0644\u0633\u0639\u0631:</span>
content = re.sub(r'<span>O U,O3O1O:</span>', r'<span>\u0627\u0644\u0633\u0639\u0631:</span>', content)

# Garbled text for quantity: O U,UU.USOc: -> <span>\u0627\u0644\u0643\u0645\u064a\u0629:</span>
content = re.sub(r'<span>O U,UU.USOc:</span>', r'<span>\u0627\u0644\u0643\u0645\u064a\u0629:</span>', content)

# Garbled text for open: placeholder="O U,UU," -> placeholder="\u0627\u0644\u0643\u0644"
content = re.sub(r'placeholder="O U,UU,"', r'placeholder="\u0627\u0644\u0643\u0644"', content)


with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed arabic encoding using unicode")
