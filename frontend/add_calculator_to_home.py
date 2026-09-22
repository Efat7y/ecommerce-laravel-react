import re

with open('frontend/src/pages/Website/LandingPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import FormulaSection from "@/components/Website/FormulaSection";',
    'import SmartFormulaCalculator from "@/components/Website/SmartFormulaCalculator/SmartFormulaCalculator";'
)

content = content.replace(
    '<FormulaSection />',
    '<SmartFormulaCalculator />'
)

with open('frontend/src/pages/Website/LandingPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated LandingPage.jsx with SmartFormulaCalculator")
