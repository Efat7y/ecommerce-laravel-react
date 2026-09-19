const fs = require('fs');

function replaceFile(path, regex, replacement) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(path, content, 'utf8');
}

// ProductCatalog
replaceFile('frontend/src/pages/Website/ProductCatalog.jsx', /className=\{\	ext-right px-3 py-2 text-sm rounded-lg transition \ \+ \(/g, 'className={	ext-right px-3 py-2 text-sm rounded-lg transition /g, ': "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800/50"\n                    }}');
replaceFile('frontend/src/pages/Website/ProductCatalog.jsx', /className=\{\lex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white shadow-sm transition \ \+ \(/g, 'className={lex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white shadow-sm transition /g, '? "bg-gray-300 cursor-not-allowed"\n                                      : "bg-blue-600 hover:bg-blue-700"\n                                  }}');

// FeaturedProducts
replaceFile('frontend/src/components/Website/FeaturedProducts/FeaturedProducts.jsx', /className=\{\p-2 rounded-xl transition shadow-sm \ \+ \(/g, 'className={p-2 rounded-xl transition shadow-sm /g, '? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800"\n                            : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:hover:bg-blue-600"\n                        }}');

// CategoriesSection
replaceFile('frontend/src/components/Website/CategoriesSection/CategoriesSection.jsx', /className=\{\elative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br p-6 shadow-sm hover:shadow-md transition duration-300 dark:border-gray-800 \\\\}/, 'className={elative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br p-6 shadow-sm hover:shadow-md transition duration-300 dark:border-gray-800 }');

// ProductDetail
replaceFile('frontend/src/pages/Website/ProductDetail.jsx', /className=\{\lex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white shadow-lg transition \ \+ \(/g, 'className={lex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white shadow-lg transition /g, '? "bg-gray-300 cursor-not-allowed shadow-none"\n                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"\n                    }}');
