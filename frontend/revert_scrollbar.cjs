const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const darkScrollbar = `
/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0f172a; /* slate-950 */
}

::-webkit-scrollbar-thumb {
  background: #334155; /* slate-700 */
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #475569; /* slate-600 */
}
`;

css = css.replace(/\/\* Custom Scrollbar \*\/[\s\S]*$/, darkScrollbar);
fs.writeFileSync('src/index.css', css, 'utf8');
console.log("Reverted to global dark scrollbar");
