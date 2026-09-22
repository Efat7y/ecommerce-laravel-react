import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add productsRevealTime input field
# The start time wrapper looks like:
# <div className="flex-1 min-w-[200px]">
#   <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
#     ...
#   </label>
#   <input type="datetime-local" value={startTime} ... />
# </div>
reveal_block = """            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                وقت ظهور المنتجات (ترقب السعر) (اختياري)
              </label>
              <input
                type="datetime-local"
                value={productsRevealTime}
                onChange={(e) => setProductsRevealTime(e.target.value)}
                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
"""

content = re.sub(
    r'(<div className="flex-1 min-w-\[200px\]">\s*<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">\s*.*?\s*</label>\s*<input\s*type="datetime-local"\s*value=\{startTime\})',
    reveal_block + r'\1',
    content,
    flags=re.DOTALL
)

# 2. Add flash_quantity input field
# The price block looks like:
#                             <div className="flex items-center gap-2">
#                               <span>...</span>
#                               <input type="number" value={sp.discount_price} ... />
#                             </div>

quantity_input = """                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span>الكمية المتاحة للعرض:</span>
                              <input
                                type="number"
                                min="1"
                                placeholder="اختياري"
                                value={sp.flash_quantity || ""}
                                onChange={(e) =>
                                  updateSaleProductQuantity(
                                    sp.product_id,
                                    e.target.value
                                  )
                                }
                                className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"
                              />"""

content = re.sub(
    r'(<input\s*type="number"\s*value=\{sp\.discount_price\}.*?className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"\s*/>\s*</div>)',
    r'\1' + quantity_input,
    content,
    flags=re.DOTALL
)

# Let's fix the Arabic garbled text for Start Time label:
content = re.sub(
    r'<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">\s*U\^U,O.*? O U,O"O_O.*?\s*</label>',
    '<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">وقت فك القفل وبدء العرض (الأساسي)</label>',
    content,
    flags=re.DOTALL
)

# Fix End Time label:
content = re.sub(
    r'<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">\s*U\^U,O.*? O U,O U\+OUO O.*?\s*</label>',
    '<label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">وقت نهاية العرض</label>',
    content,
    flags=re.DOTALL
)

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed UI missing fields in Dashboard")
