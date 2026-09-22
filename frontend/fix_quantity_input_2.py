import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find exactly: `updateSaleProductPrice(\n                                    sp.product_id,\n                                    e.target.value\n                                  )\n                                }\n                                className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"\n                              />\n                            </div>`

old_block = """                              <input
                                type="number"
                                value={sp.discount_price}
                                onChange={(e) =>
                                  updateSaleProductPrice(
                                    sp.product_id,
                                    e.target.value
                                  )
                                }
                                className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"
                              />
                            </div>"""

new_block = """                              <input
                                type="number"
                                value={sp.discount_price}
                                onChange={(e) =>
                                  updateSaleProductPrice(
                                    sp.product_id,
                                    e.target.value
                                  )
                                }
                                className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"
                              />
                            </div>
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
                              />
                            </div>"""

content = content.replace(old_block, new_block)

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added quantity field using string replace")
