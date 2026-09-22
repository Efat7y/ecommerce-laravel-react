import re

with open('backend/app/Http/Controllers/OrderController.php', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to find the `store` method
# $subtotal = 0; -> $subtotal = 0; $totalFlashDiscount = 0;
content = re.sub(
    r'\$subtotal = 0;\s*\$itemsToCreate = \[\];',
    '$subtotal = 0;\n                $totalFlashDiscount = 0;\n                $itemsToCreate = [];',
    content
)

# And inside the loop:
# $itemTotal = $actualPrice * $itemData['quantity'];
# $subtotal += $itemTotal;
#
# $itemsToCreate[] = [
#     'product_id' => $product->id,
#     'quantity' => $itemData['quantity'],
#     'price' => $actualPrice,
#     'total_price' => $itemTotal,
# ];

replacement = """                    $itemTotal = $actualPrice * $itemData['quantity'];
                    $originalItemTotal = $product->price * $itemData['quantity'];
                    
                    // Add the original price to the subtotal
                    $subtotal += $originalItemTotal;
                    
                    // Accumulate the flash sale savings
                    $totalFlashDiscount += ($originalItemTotal - $itemTotal);

                    $itemsToCreate[] = [
                        'product_id' => $product->id,
                        'quantity' => $itemData['quantity'],
                        'price' => $product->price, // Store original price
                        'total_price' => $originalItemTotal, // Store original total
                    ];"""

content = re.sub(
    r'\$itemTotal = \$actualPrice \* \$itemData\[\'quantity\'\];\s*\$subtotal \+= \$itemTotal;\s*\$itemsToCreate\[\] = \[\s*\'product_id\' => \$product->id,\s*\'quantity\' => \$itemData\[\'quantity\'\],\s*\'price\' => \$actualPrice,\s*\'total_price\' => \$itemTotal,\s*\];',
    replacement,
    content
)

# Now for the coupon check:
# $discount = 0; -> $discount = $totalFlashDiscount;
content = re.sub(
    r'\$discount = 0;\s*\$coupon_id = null;',
    '$discount = $totalFlashDiscount;\n                $coupon_id = null;',
    content
)

# And if there is a coupon:
# if ($coupon->type === 'fixed') {
#     $discount = min($coupon->value, $subtotal);
# } else {
#     $discount = ($coupon->value / 100) * $subtotal;
# ...
# -> We should ADD the coupon discount to the flash discount!
coupon_replacement = """                            if ($coupon->type === 'fixed') {
                                $couponDiscount = min($coupon->value, $subtotal - $totalFlashDiscount);
                            } else {
                                $couponDiscount = ($coupon->value / 100) * ($subtotal - $totalFlashDiscount);
                                if ($coupon->max_discount !== null && $couponDiscount > $coupon->max_discount) {
                                    $couponDiscount = $coupon->max_discount;
                                }
                            }
                            $discount += $couponDiscount;"""

content = re.sub(
    r'if \(\$coupon->type === \'fixed\'\) \{\s*\$discount = min\(\$coupon->value, \$subtotal\);\s*\} else \{\s*\$discount = \(\$coupon->value / 100\) \* \$subtotal;\s*if \(\$coupon->max_discount !== null && \$discount > \$coupon->max_discount\) \{\s*\$discount = \$coupon->max_discount;\s*\}\s*\}',
    coupon_replacement,
    content
)

with open('backend/app/Http/Controllers/OrderController.php', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated OrderController.php to combine discounts")
