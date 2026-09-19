const fs = require('fs');
let c = fs.readFileSync('app/Models/Order.php', 'utf8');
c = c.replace(
  /'discount',/,
  "'discount',\n        'shipping_fee',"
);
fs.writeFileSync('app/Models/Order.php', c, 'utf8');
console.log('Added shipping_fee to fillable');
