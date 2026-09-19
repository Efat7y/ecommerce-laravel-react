const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const scrollbarCSS = `
/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
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

/* Dark mode scrollbar */
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

if (!css.includes('::-webkit-scrollbar')) {
  fs.appendFileSync('src/index.css', scrollbarCSS);
}
console.log("CSS Updated");
