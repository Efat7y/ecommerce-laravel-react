const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const correctScrollbar = `
/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-track,
.bg-slate-950 ::-webkit-scrollbar-track,
.bg-slate-900 ::-webkit-scrollbar-track {
  background: #0f172a;
}

.dark ::-webkit-scrollbar-thumb,
.bg-slate-950 ::-webkit-scrollbar-thumb,
.bg-slate-900 ::-webkit-scrollbar-thumb {
  background: #334155;
}

.dark ::-webkit-scrollbar-thumb:hover,
.bg-slate-950 ::-webkit-scrollbar-thumb:hover,
.bg-slate-900 ::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
`;

// Replace everything from /* Custom Scrollbar */ to the end
css = css.replace(/\/\* Custom Scrollbar \*\/[\s\S]*$/, correctScrollbar);
fs.writeFileSync('src/index.css', css, 'utf8');
console.log("Replaced scrollbar");
