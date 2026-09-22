import re

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I previously added:
# if (item.path === '/dashboard/smart-calculator' && settings?.feature_formulas !== 'true') return false;
# I need to change it to feature_calculator_materials

content = content.replace(
    "if (item.path === '/dashboard/smart-calculator' && settings?.feature_formulas !== 'true') return false;",
    "if (item.path === '/dashboard/smart-calculator' && settings?.feature_calculator_materials !== 'true') return false;"
)

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Sidebar to use feature_calculator_materials")
