const fs = require('fs');

let c = fs.readFileSync('src/pages/Website/InvoicePage.jsx', 'utf8');

const handleDownloadPattern = /  const handleDownloadPDF = \(\) => \{[\s\S]*?html2pdf\(\)\.set\(opt\)\.from\(element\)\.save\(\);\s*\};/g;
c = c.replace(handleDownloadPattern, '');

const btnPattern = /          <button\s+id="auto-download-btn"[\s\S]*?تحميل PDF\s*<\/button>/g;
c = c.replace(btnPattern, '');

const effectPattern = /  useEffect\(\(\) => \{\s*const params = new URLSearchParams\(window\.location\.search\);\s*if \(params\.get\('download'\) === '1' && order && !loading\) \{\s*setTimeout\(\(\) => \{\s*const btn = document\.getElementById\('auto-download-btn'\);\s*if \(btn\) btn\.click\(\);\s*\}, 500\);\s*\}\s*\}, \[order, loading\]\);/g;
c = c.replace(effectPattern, '');

c = c.replace(/, Download/g, '');
c = c.replace(/import html2pdf from "html2pdf.js";/g, '');

fs.writeFileSync('src/pages/Website/InvoicePage.jsx', c, 'utf8');

let m = fs.readFileSync('src/components/Dashboard/AdminOrderModal.jsx', 'utf8');
const modalBtnPattern = /              <button\s+onClick=\{\(\) => window\.open\(`\/invoice\/\$\{orderId\}\?download=1`, '_blank'\)\}[\s\S]*?تحميل PDF\s*<\/button>/g;
m = m.replace(modalBtnPattern, '');
fs.writeFileSync('src/components/Dashboard/AdminOrderModal.jsx', m, 'utf8');

console.log('Removed PDF components');
