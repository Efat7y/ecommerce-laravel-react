const fs = require('fs');
const glob = require('glob');

function fixSyntax(content) {
  content = content.replace(/to=\{.*?\/products.*? \+ (.*?)\}/g, 'to={"/products/" + }');
  content = content.replace(/to=\{.*?\/products\?category=.*? \+ (.*?)\}/g, 'to={"/products?category=" + }');
  return content;
}

const files = [
  'frontend/src/components/Website/CategoriesSection/CategoriesSection.jsx',
  'frontend/src/pages/Website/ProductCatalog.jsx',
  'frontend/src/components/Website/FeaturedProducts/FeaturedProducts.jsx',
  'frontend/src/pages/Website/ProductDetail.jsx'
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  c = fixSyntax(c);
  fs.writeFileSync(f, c, 'utf8');
}
