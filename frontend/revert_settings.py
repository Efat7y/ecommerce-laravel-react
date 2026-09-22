import re

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Change grid to 3
content = content.replace('grid-cols-1 md:grid-cols-4 gap-6', 'grid-cols-1 md:grid-cols-3 gap-6')

# 2. Rename the formulas card
content = content.replace(
    '<h3 className="font-bold text-white">حاسبة التركيبات</h3>',
    '<h3 className="font-bold text-white">حاسبة التكلفة والتركيبات</h3>'
)

# 3. Remove the 4th card (feature_calculator_materials)
# We will match the entire block exactly from {/* Feature: Smart Calculator Materials */} to the end of its </div>
card_pattern = r"\s*\{/\* Feature: Smart Calculator Materials \*/\}[\s\S]*?</button>\s*</div>"
content = re.sub(card_pattern, "", content)

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Safely removed the 4th card")
