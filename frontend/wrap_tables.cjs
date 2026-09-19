const fs = require('fs');

const files = [
  'src/pages/Dashboard/OrdersManager.jsx',
  'src/pages/Dashboard/ProductManager.jsx',
  'src/pages/Dashboard/CategoryManager.jsx',
  'src/pages/Dashboard/CustomersManager.jsx'
];

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/<table className="w-full text-right text-sm">/g, '<table className="w-full text-right text-sm whitespace-nowrap">');
  fs.writeFileSync(file, c, 'utf8');
});
console.log('Tables updated');
