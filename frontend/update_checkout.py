import re

with open('frontend/src/pages/Website/CartPage/components/CheckoutSummary.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to props
content = content.replace(
    'subtotal,',
    'subtotal,\n  totalFlashSavings,'
)

# Decode unicode for UI text
savings_block = """          <div className="space-y-3 mb-4">
            {totalFlashSavings > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 p-2 rounded-lg mb-2">
                <span>\\u0648\\u0641\\u0631\\u062a \\u0645\\u0646 \\u0627\\u0644\\u0639\\u0631\\u0648\\u0636:</span>
                <span>-{parseFloat(totalFlashSavings).toLocaleString()} \\u062c.\\u0645</span>
              </div>
            )}"""
savings_block = savings_block.encode('utf-8').decode('unicode_escape')

content = content.replace(
    '<div className="space-y-3 mb-4">',
    savings_block
)

with open('frontend/src/pages/Website/CartPage/components/CheckoutSummary.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CheckoutSummary.jsx")
