import re

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'useSettings' not in content:
    content = content.replace(
        'import { getUser } from "../../../../utils/auth";',
        'import { getUser } from "../../../../utils/auth";\nimport { useSettings } from "../../../../context/SettingsContext";'
    )
    content = content.replace(
        'export default function Sidebar({ isOpen, onClose }) {\n  const location = useLocation();\n  const user = getUser();',
        'export default function Sidebar({ isOpen, onClose }) {\n  const location = useLocation();\n  const user = getUser();\n  const { settings } = useSettings();'
    )

# Filter allMenuItems dynamically based on settings
filter_logic = """
  const menuItems = allMenuItems.filter((item) => {
    // Check if feature is locked
    if (item.path === '/dashboard/flash-sales' && settings?.feature_flash_sales !== 'true') return false;
    if (item.path === '/dashboard/formulas' && settings?.feature_formulas !== 'true') return false;

    if (user?.role === "vendor") {
      return (
        !item.adminOnly &&
        ["/dashboard/products", "/dashboard/orders", "/"].includes(item.path)
      );
    }
    return true;
  });
"""
content = re.sub(
    r'const menuItems = allMenuItems\.filter\(\(item\) => \{.*?return true;\n\s*\}\);',
    filter_logic,
    content,
    flags=re.DOTALL
)

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Sidebar.jsx")
