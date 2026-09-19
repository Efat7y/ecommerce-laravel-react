const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const modernScrollbar = `
/* Custom Scrollbar */
:root {
  --sb-track: transparent;
  --sb-thumb: #cbd5e1;
  --sb-thumb-hover: #94a3b8;
}

html.dark, .dark, .bg-slate-950, .bg-slate-900 {
  --sb-track: #0f172a;
  --sb-thumb: #334155;
  --sb-thumb-hover: #475569;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--sb-track);
}

::-webkit-scrollbar-thumb {
  background: var(--sb-thumb);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--sb-thumb-hover);
}
`;

css = css.replace(/\/\* Custom Scrollbar \*\/[\s\S]*$/, modernScrollbar);
fs.writeFileSync('src/index.css', css, 'utf8');
console.log("Replaced scrollbar to use CSS variables");
