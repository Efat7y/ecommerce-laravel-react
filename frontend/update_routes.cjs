const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

if (!c.includes('AnimatePresence')) {
  c = c.replace(
    'import { Routes, Route } from "react-router-dom";',
    'import { Routes, Route, useLocation } from "react-router-dom";\nimport { AnimatePresence } from "framer-motion";\nimport PageTransition from "./components/PageTransition";'
  );
  
  c = c.replace('function App() {\n  return (\n    <Routes>', 'function App() {\n  const location = useLocation();\n\n  return (\n    <AnimatePresence mode="wait">\n      <Routes location={location} key={location.pathname}>');
  c = c.replace('</Routes>\n  );\n}', '</Routes>\n    </AnimatePresence>\n  );\n}');
  
  c = c.replace(/element=\{([\s\S]*?)\}/g, (match, p1) => {
    // Check if it already has PageTransition to avoid double wrapping
    if (p1.includes('PageTransition')) return match;
    return `element={\n        <PageTransition>\n          ${p1.trim()}\n        </PageTransition>\n      }`;
  });

  fs.writeFileSync('src/App.jsx', c, 'utf8');
}
console.log("Done");
