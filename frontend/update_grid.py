import re
with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('grid-cols-1 md:grid-cols-3 gap-6', 'grid-cols-1 md:grid-cols-4 gap-6')

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
