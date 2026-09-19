const fs = require('fs');
let c = fs.readFileSync('app/Http/Controllers/OrderController.php', 'utf8');

if (!c.includes('App\\Models\\Setting')) {
  c = c.replace(
    'use App\\Models\\Order;',
    'use App\\Models\\Order;\nuse App\\Models\\Setting;'
  );
}

const newTotalLogic = `
                // Add shipping fee
                $shippingFeeSetting = Setting::where('key', 'shipping_fee')->first();
                $shippingFee = $shippingFeeSetting ? (int)$shippingFeeSetting->value : 0;
                
                $total = $subtotal - $discount + $shippingFee;`;

c = c.replace(
  /\$total = \$subtotal - \$discount;/g,
  newTotalLogic
);

fs.writeFileSync('app/Http/Controllers/OrderController.php', c, 'utf8');
console.log('OrderController updated with shipping fee');
