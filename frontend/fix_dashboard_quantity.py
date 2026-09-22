import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """                          <div className="flex items-center gap-2">
                            <span>O3O1O O U,O1OO :</span>
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
                          </div>"""

new_block = """                          <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2">
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
                            <div className="flex items-center gap-2">
                              <span>الكمية:</span>
                              <input
                                type="number"
                                min="1"
                                placeholder="مفتوح"
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

content = content.replace(old_block, new_block)

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Quantity UI injected successfully.")
