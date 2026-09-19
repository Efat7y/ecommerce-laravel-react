const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.jsx');
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (c.includes('\')) {
    c = c.replace(/\\/products\/ \+ id/g, '\\/products/\\');
    c = c.replace(/\\/categories\/ \+ id/g, '\\/categories/\\');
    c = c.replace(/\\/products\/ \+ editingProduct\.id/g, '\\/products/\\');
    c = c.replace(/\\/categories\/ \+ editingCategory\.id/g, '\\/categories/\\');
    
    c = c.replace(/\\/products/g, '\\/products\');
    c = c.replace(/\\/categories/g, '\\/categories\');
    changed = true;
  }
  
  if (c.includes('Bearer \')) {
    c = c.replace(/Bearer \/g, '\Bearer \\');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(f, c, 'utf8');
  }
}
