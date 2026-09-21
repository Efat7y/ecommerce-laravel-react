import re

with open('frontend/src/pages/Website/LandingPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'import { useSettings }' not in content:
    content = content.replace(
        'import { Helmet } from "react-helmet-async";',
        'import { Helmet } from "react-helmet-async";\nimport { useSettings } from "@/context/SettingsContext";'
    )

with open('frontend/src/pages/Website/LandingPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed missing import in LandingPage.jsx")
