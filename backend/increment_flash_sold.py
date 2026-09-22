import re

with open('backend/app/Http/Controllers/OrderController.php', 'r', encoding='utf-8') as f:
    content = f.read()

# Look for this block:
#                         if ($flashSaleProduct) {
#                             $actualPrice = $flashSaleProduct->discount_price;
#                         }
# And add: $flashSaleProduct->increment('flash_sold', $item['quantity']);

old_block = """                        if ($flashSaleProduct) {
                            $actualPrice = $flashSaleProduct->discount_price;
                        }"""
new_block = """                        if ($flashSaleProduct) {
                            $actualPrice = $flashSaleProduct->discount_price;
                            if ($flashSaleProduct->flash_quantity !== null) {
                                // Prevent exceeding available flash quantity if desired, 
                                // but for now just increment flash_sold
                                $flashSaleProduct->increment('flash_sold', $item['quantity']);
                            }
                        }"""
                        
content = content.replace(old_block, new_block)

with open('backend/app/Http/Controllers/OrderController.php', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated OrderController")
