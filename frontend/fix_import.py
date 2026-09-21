import re

with open('frontend/src/pages/Printables/PrintableLedger.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('../../../context/SettingsContext', '../../context/SettingsContext')

with open('frontend/src/pages/Printables/PrintableLedger.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed import path")
