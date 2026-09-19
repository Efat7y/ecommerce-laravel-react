const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.jsx');
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (c.includes('')) {
    c = c.split('/products/ + editingProduct.id').join('\/products/\');
    c = c.split('/categories/ + editingCategory.id').join('\/categories/\');
    c = c.split('/products/ + id').join('\/products/\');
    c = c.split('/categories/ + id').join('\/categories/\');
    c = c.split('/products').join('\/products');
    c = c.split('/categories').join('\/categories');
    changed = true;
  }
  
  if (c.includes('Bearer ')) {
    c = c.split('Bearer ').join('Bearer \');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(f, c, 'utf8');
  }
}
