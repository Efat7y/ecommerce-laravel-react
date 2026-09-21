import re

# 1. Update Header.jsx
with open('frontend/src/components/Website/layout/Header/Header.jsx', 'r', encoding='utf-8') as f:
    header_content = f.read()

# Replace <MessagesDropdown /> with conditional render
header_content = header_content.replace(
    '<MessagesDropdown />',
    '{settings?.feature_chat === "true" && <MessagesDropdown />}'
)

# Replace in mobile menu as well, if it exists there
# Mobile menu uses `<MessagesDropdown />` ? No, let's check if there's another instance.
# Actually, the string replace will replace all instances of `<MessagesDropdown />` if there are multiple.

with open('frontend/src/components/Website/layout/Header/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(header_content)
print("Updated Header.jsx")

# 2. Update Sidebar.jsx
with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'r', encoding='utf-8') as f:
    sidebar_content = f.read()

# Add condition to hide messages path
filter_logic = """  const menuItems = allMenuItems.filter((item) => {
    // Check if feature is locked
    if (item.path === '/dashboard/flash-sales' && settings?.feature_flash_sales !== 'true') return false;
    if (item.path === '/dashboard/formulas' && settings?.feature_formulas !== 'true') return false;
    if (item.path === '/dashboard/messages' && settings?.feature_chat !== 'true') return false;"""

sidebar_content = re.sub(
    r'const menuItems = allMenuItems\.filter\(\(item\) => \{\s*// Check if feature is locked\s*if \(item\.path === \'/dashboard/flash-sales\'.*?return false;\s*if \(item\.path === \'/dashboard/formulas\'.*?return false;',
    filter_logic,
    sidebar_content,
    flags=re.DOTALL
)

with open('frontend/src/components/Dashboard/layout/Sidebar/Sidebar.jsx', 'w', encoding='utf-8') as f:
    f.write(sidebar_content)
print("Updated Sidebar.jsx")
