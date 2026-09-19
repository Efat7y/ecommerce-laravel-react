const fs = require('fs');

['src/pages/Dashboard/OrdersManager.jsx', 'src/pages/Dashboard/ProductManager.jsx', 'src/pages/Dashboard/CustomersManager.jsx', 'src/pages/Dashboard/CategoryManager.jsx'].forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  
  c = c.replace(/<\/motion\.tr>/g, '</tr>');
  c = c.replace(/<motion\.tr([\s\S]*?)<\/tr>/g, '<motion.tr$1</motion.tr>');
  
  fs.writeFileSync(file, c, 'utf8');
});
console.log("Done fixing tags");
