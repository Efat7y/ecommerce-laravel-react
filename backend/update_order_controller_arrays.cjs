const fs = require('fs');
let c = fs.readFileSync('app/Http/Controllers/OrderController.php', 'utf8');

c = c.replace(
  /'discount' => \$discount,/g,
  "'discount' => $discount,\n                    'shipping_fee' => $shippingFee,"
);

c = c.replace(
  /'total' => \$total,/g,
  "'total' => $total,\n                'shipping_fee' => $shippingFee,"
);

fs.writeFileSync('app/Http/Controllers/OrderController.php', c, 'utf8');
console.log('Added shipping_fee to create/update arrays');
