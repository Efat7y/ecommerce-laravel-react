import re

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """    if (item.path === '/dashboard/formulas' && settings?.feature_formulas !== 'true') return false;
    if (item.path === '/dashboard/smart-calculator' && settings?.feature_formulas !== 'true') return false;"""

content = re.sub(
    r"if \(item\.path === '/dashboard/formulas' && settings\?\.feature_formulas !== 'true'\) return false;",
    replacement,
    content
)

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Sidebar to hide smart-calculator when locked")
