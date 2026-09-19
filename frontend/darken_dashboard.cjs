const fs = require('fs');

const files = [
  'src/pages/Dashboard/DashboardPage.jsx',
  'src/pages/Dashboard/OrdersManager.jsx',
  'src/pages/Dashboard/ProductManager.jsx',
  'src/pages/Dashboard/CategoryManager.jsx',
  'src/pages/Dashboard/CustomersManager.jsx'
];

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  
  // Backgrounds and borders
  c = c.replace(/bg-white/g, 'bg-slate-900');
  c = c.replace(/border-gray-100/g, 'border-slate-800');
  c = c.replace(/border-gray-200/g, 'border-slate-700');
  c = c.replace(/bg-gray-50/g, 'bg-slate-800/50');
  c = c.replace(/divide-gray-50/g, 'divide-slate-800/50');
  c = c.replace(/divide-gray-100/g, 'divide-slate-800/50');
  c = c.replace(/divide-gray-200/g, 'divide-slate-700');
  
  // Text colors
  c = c.replace(/text-gray-900/g, 'text-white');
  c = c.replace(/text-slate-900/g, 'text-white');
  c = c.replace(/text-gray-500/g, 'text-slate-400');
  c = c.replace(/text-gray-600/g, 'text-slate-400');
  c = c.replace(/text-gray-700/g, 'text-slate-300');
  c = c.replace(/text-gray-800/g, 'text-slate-300');
  
  // Hovers
  c = c.replace(/hover:bg-slate-50\/50/g, 'hover:bg-slate-800/50');
  c = c.replace(/hover:bg-slate-50\/30/g, 'hover:bg-slate-800/50');
  c = c.replace(/hover:bg-slate-50/g, 'hover:bg-slate-800');
  c = c.replace(/hover:bg-gray-50/g, 'hover:bg-slate-800');
  c = c.replace(/hover:bg-blue-50\/50/g, 'hover:bg-blue-900/20');
  
  // Forms / Inputs
  c = c.replace(/bg-transparent/g, 'bg-slate-950');
  
  // Wait, if an input was border-gray-200, it's now border-slate-700.
  // Input focus
  c = c.replace(/focus:border-blue-500/g, 'focus:border-blue-500'); // fine
  
  fs.writeFileSync(file, c, 'utf8');
});
console.log("Done");
