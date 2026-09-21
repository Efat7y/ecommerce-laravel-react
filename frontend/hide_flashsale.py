import re

with open('frontend/src/pages/Website/LandingPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useSettings Context
if 'useSettings' not in content:
    content = content.replace(
        'import FlashSaleSection from "../../components/Website/FlashSaleSection/FlashSaleSection";',
        'import FlashSaleSection from "../../components/Website/FlashSaleSection/FlashSaleSection";\nimport { useSettings } from "../../context/SettingsContext";'
    )
    content = content.replace(
        'export default function LandingPage() {',
        'export default function LandingPage() {\n  const { settings } = useSettings();'
    )

# Hide FlashSaleSection
content = content.replace(
    '<FlashSaleSection />',
    '{settings?.feature_flash_sales === "true" && <FlashSaleSection />}'
)

with open('frontend/src/pages/Website/LandingPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LandingPage.jsx")
