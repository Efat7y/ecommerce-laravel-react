import re

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a new link in the sidebar menu
#     {
#       name: "إدارة التركيبات",
#       path: "/dashboard/formulas",
#       icon: Store,
#       adminOnly: true,
#     },
# I'll add "أسعار الخامات (الحاسبة)" right after it.

replacement = """    {
      name: "إدارة التركيبات القديمة",
      path: "/dashboard/formulas",
      icon: Store,
      adminOnly: true,
    },
    {
      name: "أسعار خامات الحاسبة",
      path: "/dashboard/smart-calculator",
      icon: Beaker,
      adminOnly: true,
    },"""

content = re.sub(
    r'\{\s*name:\s*"إدارة التركيبات",\s*path:\s*"/dashboard/formulas",\s*icon:\s*Store,\s*adminOnly:\s*true,\s*\},',
    replacement,
    content
)

# Also need to import Beaker if not imported
if 'Beaker' not in content:
    content = content.replace('Store,', 'Store, Beaker,')

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Sidebar.jsx")
