import re

with open('backend/app/Http/Controllers/FlashSaleController.php', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to store validation
content = content.replace(
    "'teaser_description' => 'nullable|string',",
    "'teaser_description' => 'nullable|string',\n            'products_reveal_time' => 'nullable|date',"
)

# Add to store create
content = content.replace(
    "'teaser_description' => $request->teaser_description,",
    "'teaser_description' => $request->teaser_description,\n            'products_reveal_time' => $request->products_reveal_time ? Carbon::parse($request->products_reveal_time) : null,"
)

# Add to update update
content = content.replace(
    "'teaser_description' => $request->teaser_description,",
    "'teaser_description' => $request->teaser_description,\n            'products_reveal_time' => $request->products_reveal_time ? Carbon::parse($request->products_reveal_time) : null,"
)

with open('backend/app/Http/Controllers/FlashSaleController.php', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated FlashSaleController")
