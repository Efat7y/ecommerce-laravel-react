import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'<div className="flex flex-col gap-2 mt-2">.*?</div>\s*</div>'

replacement = """<div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2 justify-end">
                              <span>السعر:</span>
                              <input
                                type="number"
                                value={sp.discount_price}
                                onChange={(e) =>
                                  updateSaleProductPrice(
                                    sp.product_id,
                                    e.target.value
                                  )
                                }
                                className="w-20 p-1 border rounded text-center dark:bg-gray-600"
                              />
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <span>الكمية:</span>
                              <input
                                type="number"
                                min="1"
                                placeholder="الكل"
                                value={sp.flash_quantity || ""}
                                onChange={(e) =>
                                  updateSaleProductQuantity(
                                    sp.product_id,
                                    e.target.value
                                  )
                                }
                                className="w-20 p-1 border rounded text-center dark:bg-gray-600"
                              />
                            </div>
                          </div>"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed block")
