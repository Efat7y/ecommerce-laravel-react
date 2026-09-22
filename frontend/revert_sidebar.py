import re

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "if (item.path === '/dashboard/smart-calculator' && settings?.feature_calculator_materials !== 'true') return false;",
    "if (item.path === '/dashboard/smart-calculator' && settings?.feature_formulas !== 'true') return false;"
)

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Sidebar to link dashboard smart calculator to feature_formulas")
