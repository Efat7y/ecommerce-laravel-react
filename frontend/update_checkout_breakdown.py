import re

with open('frontend/src/pages/Website/CartPage/components/CheckoutSummary.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add originalSubtotal to props
content = content.replace(
    'subtotal,\n    totalFlashSavings,',
    'subtotal,\n    totalFlashSavings,\n    originalSubtotal,'
)

# Build the new breakdown HTML
new_breakdown = """        <div className="space-y-3 text-sm pb-4 border-b border-gray-100 dark:border-gray-800">
          {totalFlashSavings > 0 ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">\\u0627\\u0644\\u0633\\u0639\\u0631 \\u0642\\u0628\\u0644 \\u0627\\u0644\\u062e\\u0635\\u0645:</span>
                <span className="font-semibold line-through text-gray-400">
                  {parseFloat(originalSubtotal).toLocaleString()} \\u062c.\\u0645
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">\\u0627\\u0644\\u0633\\u0639\\u0631 \\u0628\\u0639\\u062f \\u0627\\u0644\\u062e\\u0635\\u0645:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {parseFloat(subtotal).toLocaleString()} \\u062c.\\u0645
                </span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 p-2 rounded-lg mt-2 mb-2">
                <span>\\u0646\\u0633\\u0628\\u0629 \\u0627\\u0644\\u062a\\u0648\\u0641\\u064a\\u0631 ({( (totalFlashSavings / originalSubtotal) * 100 ).toFixed(1)}%):</span>
                <span>-{parseFloat(totalFlashSavings).toLocaleString()} \\u062c.\\u0645</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-gray-500">\\u0627\\u0644\\u0645\\u062c\\u0645\\u0648\\u0639 \\u0627\\u0644\\u0641\\u0631\\u0639\\u064a:</span>
              <span className="font-semibold">
                {parseFloat(subtotal).toLocaleString()} \\u062c.\\u0645
              </span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-500">\\u0645\\u0635\\u0627\\u0631\\u064a\\u0641 \\u0627\\u0644\\u0634\\u062d\\u0646:</span>
            <span className="font-semibold text-blue-600">
              {shippingFee > 0 ? `${shippingFee} \\u062c.\\u0645` : "\\u0645\\u062c\\u0627\\u0646\\u0627\\u064b"}
            </span>
          </div>"""
new_breakdown = new_breakdown.encode('utf-8').decode('unicode_escape')

# Regex to match the old block
old_block_pattern = r'<div className="space-y-3 text-sm pb-4 border-b border-gray-100 dark:border-gray-800">.*?<div className="flex justify-between">\s*<span className="text-gray-500">.*?مصاريف الشحن:.*?</span>.*?</div>'

# Since we might have unicode in the file, we can just replace string directly if regex fails.
# Let's try exact string replacement of the old structure.

old_str = """        <div className="space-y-3 text-sm pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between">
            <span className="text-gray-500">المجموع الفرعي:</span>
            <span className="font-semibold">
              {parseFloat(subtotal).toLocaleString()} ج.م
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">مصاريف الشحن:</span>
            <span className="font-semibold text-blue-600">
              {shippingFee > 0 ? `${shippingFee} ج.م` : "مجاناً"}
            </span>
          </div>"""

# Wait, `old_str` has some arabic text that may not match exactly due to encoding inside the python script.
# Let's just use replace_file_content tool if python string replace fails. But python can read it.
content = re.sub(
    r'<div className="space-y-3 text-sm pb-4 border-b border-gray-100 dark:border-gray-800">\s*<div className="flex justify-between">\s*<span className="text-gray-500">.*?</span>\s*<span className="font-semibold">.*?</span>\s*</div>\s*<div className="flex justify-between">\s*<span className="text-gray-500">.*?</span>\s*<span className="font-semibold text-blue-600">.*?</span>\s*</div>',
    new_breakdown,
    content,
    flags=re.DOTALL
)

with open('frontend/src/pages/Website/CartPage/components/CheckoutSummary.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CheckoutSummary.jsx Breakdown")
