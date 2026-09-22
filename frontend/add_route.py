import re

with open('frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import FormulaManager from './pages/Dashboard/FormulaManager/FormulaManager';",
    "import FormulaManager from './pages/Dashboard/FormulaManager/FormulaManager';\nimport SmartCalculatorManager from './pages/Dashboard/SmartCalculatorManager/SmartCalculatorManager';"
)

content = content.replace(
    '<Route path="formulas" element={<FormulaManager />} />',
    '<Route path="formulas" element={<FormulaManager />} />\n          <Route path="smart-calculator" element={<SmartCalculatorManager />} />'
)

with open('frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated App.jsx with SmartCalculatorManager route")
