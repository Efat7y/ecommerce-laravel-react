const fs = require('fs');

function fixPage(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  if (c.includes('useReactToPrint')) return;

  // Add imports
  c = c.replace(
    'import { Loader2',
    'import { useReactToPrint } from "react-to-print";\nimport { useRef } from "react";\nimport { Loader2'
  );

  // Add hook
  const pStart = c.indexOf('  useEffect(() => {');
  if (pStart !== -1) {
    c = c.substring(0, pStart) + `  const componentRef = useRef();\n  const handlePrintSilent = useReactToPrint({ contentRef: () => componentRef.current, documentTitle: \`invoice_${filePath.includes('Admin') ? 'orderId' : 'id'}\` });\n\n` + c.substring(pStart);
  }

  // Replace handlePrint
  c = c.replace(/onClick=\{handlePrint\}/g, 'onClick={() => handlePrintSilent()}');
  c = c.replace(/  const handlePrint = \(\) => \{\n    window\.print\(\);\n  \};\n/g, '');
  
  // Add ref to template
  c = c.replace(
    /<InvoicePDFTemplate order=\{order\} settings=\{settings\} \/>/,
    `<div ref={componentRef}><InvoicePDFTemplate order={order} settings={settings} /></div>`
  );

  fs.writeFileSync(filePath, c, 'utf8');
  console.log('Fixed ' + filePath);
}

fixPage('src/pages/Website/InvoicePage.jsx');

// For OrderDetailPage
let o = fs.readFileSync('src/pages/Website/OrderDetailPage.jsx', 'utf8');
if (!o.includes('react-to-print')) {
  o = o.replace(
    'import { Loader2, ArrowRight, Printer, CheckCircle, FileText } from "lucide-react";',
    'import { Loader2, ArrowRight, Printer, CheckCircle, FileText, Download, MessageCircle } from "lucide-react";\nimport { useReactToPrint } from "react-to-print";\nimport { useRef } from "react";\nimport html2pdf from "html2pdf.js";\nimport InvoicePDFTemplate from "../../components/Website/InvoicePDFTemplate";\nimport { useSettings } from "../../context/SettingsContext";'
  );

  o = o.replace(
    '  const [loading, setLoading] = useState(true);',
    '  const [loading, setLoading] = useState(true);\n  const { settings } = useSettings();\n  const componentRef = useRef();\n  const handlePrintSilent = useReactToPrint({ contentRef: () => componentRef.current, documentTitle: `invoice_${id}` });'
  );

  const pStart = o.indexOf('  const handlePrint = () => {');
  const pEnd = o.indexOf('  if (loading) {');
  if (pStart !== -1 && pEnd !== -1) {
    o = o.substring(0, pStart) + o.substring(pEnd);
  }

  const endDiv = o.lastIndexOf('    </>');
  if (endDiv !== -1) {
    o = o.substring(0, endDiv) + `      <div style={{ display: 'none' }}>\n        <div ref={componentRef} id="pdf-invoice-template-order">\n          <InvoicePDFTemplate order={order} settings={settings} />\n        </div>\n      </div>\n    </>`;
  }

  const btnRegex = /<button\s+onClick=\{\(\) => window\.open\(\/invoice\/, '_blank'\)\}[\s\S]*?<\/button>/;
  const newButtons = `<div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const url = \`http://\${window.location.host}/invoice/\${id}\`;
                    const text = \`مرحباً، تفاصيل فاتورتك رقم \${id} جاهزة.\\n\\nلرؤية الفاتورة بالكامل، تفضل بزيارة الرابط التالي:\\n\${url}\`;
                    window.open(\`https://wa.me/?text=\${encodeURIComponent(text)}\`, '_blank');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-500/10 hover:bg-green-600 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  مشاركة واتساب
                </button>
                
                <button
                  onClick={() => {
                    const element = document.getElementById('pdf-invoice-template-order');
                    if (!element) return;
                    const opt = {
                      margin: 0,
                      filename: \`invoice_\${id}.pdf\`,
                      image: { type: 'jpeg', quality: 0.98 },
                      html2canvas: { scale: 2, useCORS: true },
                      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                    };
                    html2pdf().set(opt).from(element).save();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-600/10 hover:bg-green-700 transition"
                >
                  <Download className="h-4 w-4" />
                  تحميل PDF
                </button>

                <button
                  onClick={() => handlePrintSilent()}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition"
                >
                  <Printer className="h-4 w-4" />
                  طباعة
                </button>
              </div>`;
              
  o = o.replace(btnRegex, newButtons);
  fs.writeFileSync('src/pages/Website/OrderDetailPage.jsx', o, 'utf8');
  console.log('Fixed OrderDetailPage');
}
