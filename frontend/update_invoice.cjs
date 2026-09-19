const fs = require('fs');
let c = fs.readFileSync('src/pages/Website/InvoicePage.jsx', 'utf8');

if (!c.includes('html2pdf')) {
  c = c.replace(
    'import { Loader2, Printer, ArrowRight } from "lucide-react";',
    'import { Loader2, Printer, ArrowRight, Download } from "lucide-react";\nimport html2pdf from "html2pdf.js";'
  );

  const pdfLogic = `
  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-content');
    const opt = {
      margin: 0,
      filename: \`invoice_\${order.id}.pdf\`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };`;

  c = c.replace(
    '  const handlePrint = () => {',
    pdfLogic + '\n\n  const handlePrint = () => {'
  );

  const buttonsHTML = `        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-white shadow-lg shadow-green-500/30 hover:bg-green-700 font-bold transition"
          >
            <Download className="h-5 w-5" />
            تحميل PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 font-bold transition"
          >`;

  c = c.replace(
    /<button\s+onClick=\{handlePrint\}\s+className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2\.5 text-white shadow-lg shadow-blue-500\/30 hover:bg-blue-700 font-bold transition"\s*>/,
    buttonsHTML
  );
  
  c = c.replace(
    /<\/button>\s*<\/div>\s*\{\/\* A4 Invoice Paper \*\/\}/,
    '</button>\n        </div>\n      </div>\n\n      {/* A4 Invoice Paper */}\n      <div id="invoice-content">'
  );

  c = c.replace(
    /        <\/div>\s*<\/div>\s*<\/div>\s*\);\s*}/,
    '        </div>\n      </div>\n    </div>\n  );\n}'
  );

  fs.writeFileSync('src/pages/Website/InvoicePage.jsx', c, 'utf8');
  console.log('InvoicePage updated with PDF download');
}
