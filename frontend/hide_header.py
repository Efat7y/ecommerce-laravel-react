import re

with open('frontend/src/components/Website/layout/Header/Header.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Hide Profit Calculator link in Desktop Navbar
content = content.replace(
    '<Link to="/profit-calculator" className="flex items-center gap-1">',
    '{settings?.feature_formulas === "true" && <Link to="/profit-calculator" className="flex items-center gap-1">'
)
content = content.replace(
    'حاسبة الأرباح\n            </Link>',
    'حاسبة الأرباح\n            </Link>}'
)

# And in Mobile Menu if it exists
if '<Link to="/profit-calculator" className="block' in content:
    content = re.sub(
        r'(<Link to="/profit-calculator".*?حاسبة الأرباح\s*</Link>)',
        r'{settings?.feature_formulas === "true" && \1}',
        content,
        flags=re.DOTALL
    )

with open('frontend/src/components/Website/layout/Header/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Header.jsx")
