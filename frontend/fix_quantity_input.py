import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to insert the quantity input after the discount price input.
# The discount price input looks like this:
#                             <div className="flex items-center gap-2">
#                               <span>...</span>
#                               <input type="number" value={sp.discount_price} ... />
#                             </div>
# We will just replace the closing `</div>` of this block with our new input.

quantity_input = """                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span>الكمية المتاحة للعرض:</span>
                              <input
                                type="number"
                                min="1"
                                placeholder="الكمية المتاحة (اختياري)"
                                value={sp.flash_quantity || ""}
                                onChange={(e) =>
                                  updateSaleProductQuantity(
                                    sp.product_id,
                                    e.target.value
                                  )
                                }
                                className="w-32 border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"
                              />"""

content = re.sub(
    r'(<input\s*type="number"\s*value=\{sp\.discount_price\}.*?className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"\s*/>\s*</div>)',
    r'\1\n' + quantity_input,
    content,
    flags=re.DOTALL
)

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added quantity field to Dashboard UI")
