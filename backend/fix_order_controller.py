import re

with open('backend/app/Http/Controllers/OrderController.php', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "$flashSaleProduct->increment('flash_sold', $item['quantity']);",
    "$flashSaleProduct->increment('flash_sold', $itemData['quantity']);"
)

with open('backend/app/Http/Controllers/OrderController.php', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed Undefined variable $item in OrderController")
