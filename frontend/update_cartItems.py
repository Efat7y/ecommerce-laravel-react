import re

with open('frontend/src/pages/Website/CartPage/components/CartItems.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the unit price block
new_price_block = """
            {item.product.original_price ? (
              <div className="mt-1 space-y-0.5">
                <p className="text-xs text-gray-400 line-through">
                  \\u0627\\u0644\\u0633\\u0639\\u0631 \\u0627\\u0644\\u0623\\u0635\\u0644\\u064a: {parseFloat(item.product.original_price).toLocaleString()} \\u062c.\\u0645
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-bold">
                  \\u0633\\u0639\\u0631 \\u0627\\u0644\\u0639\\u0631\\u0636: {parseFloat(item.product.price).toLocaleString()} \\u062c.\\u0645
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-1 font-bold">
                \\u0633\\u0639\\u0631 \\u0627\\u0644\\u0648\\u062d\\u062f\\u0629: {parseFloat(item.product.price).toLocaleString()} \\u062c.\\u0645
              </p>
            )}
"""
new_price_block = new_price_block.encode('utf-8').decode('unicode_escape')

content = re.sub(r'<p className="text-xs text-gray-500 mt-1 font-bold">.*?</p>', new_price_block, content, flags=re.DOTALL)

with open('frontend/src/pages/Website/CartPage/components/CartItems.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CartItems.jsx")
