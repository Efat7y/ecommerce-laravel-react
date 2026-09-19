const fs = require('fs');

const files = [
  'src/pages/Admin/Dashboard.jsx',
  'src/pages/Dashboard/OrdersManager.jsx',
  'src/pages/Dashboard/ProductManager.jsx',
  'src/pages/Dashboard/CategoryManager.jsx',
  'src/pages/Dashboard/CustomersManager.jsx',
  'src/pages/Dashboard/AddOrder.jsx',
  'src/pages/Dashboard/EditOrder.jsx'
];

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  
  // Remove import DashboardLayout
  c = c.replace(/import DashboardLayout from "[^"]+";\n/g, '');
  
  // Replace <DashboardLayout> with <>
  c = c.replace(/<DashboardLayout>/g, '<>');
  c = c.replace(/<\/DashboardLayout>/g, '</>');
  
  fs.writeFileSync(file, c, 'utf8');
});

console.log("Stripped DashboardLayout");
