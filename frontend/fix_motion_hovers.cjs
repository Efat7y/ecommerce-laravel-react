const fs = require('fs');

const files = [
  'src/pages/Dashboard/OrdersManager.jsx',
  'src/pages/Dashboard/ProductManager.jsx',
  'src/pages/Dashboard/CategoryManager.jsx',
  'src/pages/Dashboard/CustomersManager.jsx'
];

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  
  c = c.replace(/whileHover=\{\{\s*scale:\s*([0-9.]+),\s*backgroundColor:\s*"[^"]+"/g, 'whileHover={{ scale: $1, backgroundColor: "#1e293b"');
  
  // Replace the Customer footer
  c = c.replace(/border-t border-gray-50 bg-slate-50\/50/g, 'border-t border-slate-800 bg-slate-800/30');
  
  // Any lingering light backgrounds
  c = c.replace(/hover:bg-slate-50\/30/g, 'hover:bg-slate-800/50');
  c = c.replace(/hover:bg-slate-50\/50/g, 'hover:bg-slate-800/50');
  c = c.replace(/hover:bg-slate-50/g, 'hover:bg-slate-800');

  // Customer Manager modals might have bg-blue-50
  c = c.replace(/bg-blue-50/g, 'bg-blue-900/30');
  c = c.replace(/text-blue-700/g, 'text-blue-400');
  
  // In Customer Manager there's a badge text-blue-500 that might need to be lighter, it's fine.
  
  // In Customer Manager, table header uses:
  // className="bg-slate-800/50 text-slate-300 text-xs border-b border-slate-800"
  // Let's verify no other weird colors are there.
  
  fs.writeFileSync(file, c, 'utf8');
});

console.log("Fixed hovers");
