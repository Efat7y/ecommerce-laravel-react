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
  
  // Icon colors in DashboardPage
  c = c.replace(/text-blue-600 bg-blue-50/g, 'text-blue-400 bg-blue-900/30');
  c = c.replace(/text-indigo-600 bg-indigo-50/g, 'text-indigo-400 bg-indigo-900/30');
  c = c.replace(/text-emerald-600 bg-emerald-50/g, 'text-emerald-400 bg-emerald-900/30');
  c = c.replace(/text-purple-600 bg-purple-50/g, 'text-purple-400 bg-purple-900/30');
  
  // Badges in orders table (DashboardPage & OrdersManager)
  c = c.replace(/bg-emerald-50 text-emerald-700/g, 'bg-emerald-900/30 text-emerald-400');
  c = c.replace(/bg-red-50 text-red-700/g, 'bg-red-900/30 text-red-400');
  c = c.replace(/bg-indigo-50 text-indigo-700/g, 'bg-indigo-900/30 text-indigo-400');
  c = c.replace(/bg-amber-50 text-amber-700/g, 'bg-amber-900/30 text-amber-400');
  
  // Small amber badge in DashboardPage
  c = c.replace(/bg-amber-50\/50 p-3 rounded-xl border border-amber-100/g, 'bg-amber-900/20 p-3 rounded-xl border border-amber-900/50');
  c = c.replace(/text-amber-600 bg-white border border-amber-200/g, 'text-amber-400 bg-slate-800 border border-amber-900/50');

  // Any remaining generic white backgrounds for inputs or similar (if any missed)
  c = c.replace(/bg-white/g, 'bg-slate-900');
  
  fs.writeFileSync(file, c, 'utf8');
});
console.log("Done");
