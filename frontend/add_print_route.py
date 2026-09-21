import re

with open('frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Import PrintableLedger
if 'PrintableLedger' not in content:
    content = content.replace('import ErrorPage', 'import PrintableLedger from "./pages/Printables/PrintableLedger";\nimport ErrorPage')

# Add route
route_string = '<Route path="/print/ledger/:id" element={<ProtectedRoute adminOnly><PrintableLedger /></ProtectedRoute>} />'
if '/print/ledger' not in content:
    content = content.replace(
        '<Route path="/dashboard" element={<ProtectedRoute adminOnly><DashboardLayout /></ProtectedRoute>}>',
        route_string + '\n\n        <Route path="/dashboard" element={<ProtectedRoute adminOnly><DashboardLayout /></ProtectedRoute>}>'
    )

with open('frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated App.jsx")
