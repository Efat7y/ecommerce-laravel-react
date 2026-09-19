const fs = require('fs');

function fixSyntax(content) {
  return content.replace(/to=\{\"\/products\/\" \+ \}/g, 'to={/products/}');
}

const files = [
  'frontend/src/pages/Website/ProductCatalog.jsx',
  'frontend/src/components/Website/FeaturedProducts/FeaturedProducts.jsx',
  'frontend/src/pages/Website/ProductDetail.jsx'
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  c = fixSyntax(c);
  fs.writeFileSync(f, c, 'utf8');
}
