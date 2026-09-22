import re

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'Store,\n} from "lucide-react";',
    'Store,\n  Beaker,\n} from "lucide-react";'
)

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed Beaker import in Sidebar.jsx")
