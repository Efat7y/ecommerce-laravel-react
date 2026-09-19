const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.jsx');
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (c.includes('$baseUrl')) {
    c = c.split('$baseUrl/products/ + editingProduct.id').join('`${baseUrl}/products/${editingProduct.id}`');
    c = c.split('$baseUrl/categories/ + editingCategory.id').join('`${baseUrl}/categories/${editingCategory.id}`');
    c = c.split('$baseUrl/products/ + id').join('`${baseUrl}/products/${id}`');
    c = c.split('$baseUrl/categories/ + id').join('`${baseUrl}/categories/${id}`');
    c = c.split('$baseUrl/products').join('`${baseUrl}/products`');
    c = c.split('$baseUrl/categories').join('`${baseUrl}/categories`');
    changed = true;
  }
  
  if (c.includes('Bearer $token')) {
    c = c.split('Bearer $token').join('`Bearer ${token}`');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(f, c, 'utf8');
  }
}
