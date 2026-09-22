import re

with open('frontend/src/pages/Website/LandingPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we only replace if not already wrapped
if '{settings?.feature_formulas === "true" && <SmartFormulaCalculator />}' not in content:
    content = content.replace(
        '<SmartFormulaCalculator />',
        '{settings?.feature_formulas === "true" && <SmartFormulaCalculator />}'
    )
    with open('frontend/src/pages/Website/LandingPage.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated LandingPage.jsx with Ghost Mode lock for Calculator")
else:
    print("Lock already present in LandingPage.jsx")
