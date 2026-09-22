import re

with open('backend/app/Http/Controllers/FlashSaleController.php', 'r', encoding='utf-8') as f:
    content = f.read()

# Update validation in syncProducts
content = content.replace(
    "'products.*.discount_price' => 'required|numeric|min:0',",
    "'products.*.discount_price' => 'required|numeric|min:0',\n            'products.*.flash_quantity' => 'nullable|integer|min:1',"
)

# Update insertion in syncProducts
old_insert = """                    'flash_sale_id' => $flashSale->id,
                    'product_id' => $prod['product_id'],
                    'discount_price' => $prod['discount_price'],
                ]);"""
new_insert = """                    'flash_sale_id' => $flashSale->id,
                    'product_id' => $prod['product_id'],
                    'discount_price' => $prod['discount_price'],
                    'flash_quantity' => $prod['flash_quantity'] ?? null,
                    'flash_sold' => 0,
                ]);"""
content = content.replace(old_insert, new_insert)

with open('backend/app/Http/Controllers/FlashSaleController.php', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated FlashSaleController for flash_quantity")
