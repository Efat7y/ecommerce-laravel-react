import re

with open('frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make FloatingChat conditional
if 'settings?.feature_chat === "true"' not in content:
    content = content.replace(
        '<FloatingChat />',
        '{settings?.feature_chat === "true" && <FloatingChat />}'
    )

with open('frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated App.jsx")
