import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add to setSaleProducts mapping in openModalForProducts
content = content.replace(
    'discount_price: p.pivot?.discount_price || p.price,',
    'discount_price: p.pivot?.discount_price || p.price,\n        flash_quantity: p.pivot?.flash_quantity || "",'
)

# 2. Add to addProductToSale
content = content.replace(
    '{ product_id: productId, discount_price: originalPrice }',
    '{ product_id: productId, discount_price: originalPrice, flash_quantity: "" }'
)

# 3. Create updateSaleProductQuantity function
update_func = """
  const updateSaleProductQuantity = (productId, qty) => {
    setSaleProducts(
      saleProducts.map((p) =>
        p.product_id === productId ? { ...p, flash_quantity: qty } : p
      )
    );
  };
"""
content = content.replace(
    'const removeProductFromSale = (productId) => {',
    update_func + '\n  const removeProductFromSale = (productId) => {'
)

# 4. Add the input field in the table
# Look for discount_price input block
old_input = """                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={sp.discount_price}
                            onChange={(e) =>
                              updateSaleProductPrice(
                                sp.product_id,
                                e.target.value
                              )
                            }
                            className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"
                          />"""
new_input = """                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="السعر"
                              value={sp.discount_price}
                              onChange={(e) =>
                                updateSaleProductPrice(
                                  sp.product_id,
                                  e.target.value
                                )
                              }
                              className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"
                            />
                            <input
                              type="number"
                              min="1"
                              placeholder="الكمية المتاحة للعرض"
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
                          
content = content.replace(old_input, new_input)

# We should also add a table header if there is one for "discount_price"
# Currently the table is very simple, maybe no headers or maybe "Price". Let's check headers.
# Actually I don't see the headers in the excerpt. It might be just a list item.
# Let's write it and if it works it works.

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated FlashSaleManager for flash_quantity")
