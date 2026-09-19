const fs = require('fs');

const files = [
  'src/pages/Dashboard/OrdersManager.jsx',
  'src/pages/Dashboard/ProductManager.jsx',
  'src/pages/Dashboard/CategoryManager.jsx',
  'src/pages/Dashboard/CustomersManager.jsx'
];

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');

  // Fix table head backgrounds
  c = c.replace(/bg-slate-50 text-slate-500/g, 'bg-slate-800/50 text-slate-300');
  
  // Fix button hovers
  c = c.replace(/hover:bg-gray-100/g, 'hover:bg-blue-900/30');
  c = c.replace(/hover:text-blue-600/g, 'hover:text-blue-400');
  
  c = c.replace(/hover:bg-red-50/g, 'hover:bg-red-900/30');
  c = c.replace(/text-red-600/g, 'text-red-400');
  
  c = c.replace(/hover:bg-emerald-50/g, 'hover:bg-emerald-900/30');
  c = c.replace(/text-emerald-600/g, 'text-emerald-400');

  // Fix inner table borders
  c = c.replace(/border-slate-800\/50/g, 'border-slate-800');

  // Any remaining generic white backgrounds for inputs or similar (if any missed)
  c = c.replace(/bg-gray-100/g, 'bg-slate-800'); // the image placeholder placeholder

  fs.writeFileSync(file, c, 'utf8');
});
console.log("Hover colors updated.");
