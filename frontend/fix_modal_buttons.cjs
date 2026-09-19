const fs = require('fs');
let c = fs.readFileSync('src/components/Dashboard/AdminOrderModal.jsx', 'utf8');

if (!c.includes('react-to-print')) {
  // Add imports
  c = c.replace(
    'import { X, Loader2, Printer, ClipboardList, User, MapPin, Phone, StickyNote } from "lucide-react";',
    'import { X, Loader2, Printer, ClipboardList, User, MapPin, Phone, StickyNote, Download, MessageCircle } from "lucide-react";\nimport { useReactToPrint } from "react-to-print";\nimport { useRef } from "react";\nimport html2pdf from "html2pdf.js";\nimport InvoicePDFTemplate from "../Website/InvoicePDFTemplate";\nimport { useSettings } from "../../context/SettingsContext";'
  );

  // Add hooks
  c = c.replace(
    '  const token = getToken();',
    '  const token = getToken();\n  const { settings } = useSettings();\n  const componentRef = useRef();\n  const handlePrintSilent = useReactToPrint({ contentRef: () => componentRef.current, documentTitle: `invoice_${orderId}` });'
  );

  // Remove handlePrint
  const pStart = c.indexOf('  const handlePrint = () => {');
  const pEnd = c.indexOf('  return (');
  if (pStart !== -1 && pEnd !== -1) {
    c = c.substring(0, pStart) + c.substring(pEnd);
  }

  // Add template at the end
  const endDiv = c.lastIndexOf('        </div>\n      </div>\n    </div>\n  );\n}');
  if (endDiv !== -1) {
    c = c.substring(0, endDiv) + `        </div>\n        <div style={{ display: 'none' }}>\n          <div ref={componentRef} id="pdf-invoice-template-modal">\n            <InvoicePDFTemplate order={order} settings={settings} />\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}`;
  }

  // Replace buttons
  const bStart = c.indexOf('<div className="flex items-center gap-3">');
  const bEnd = c.indexOf('<button\n                onClick={onClose}');
  if (bStart !== -1 && bEnd !== -1) {
    const newButtons = `<div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  const url = \`http://\${window.location.host}/invoice/\${orderId}\`;
                  const text = \`مرحباً، تفاصيل فاتورتك رقم \${orderId} جاهزة.\\n\\nلرؤية الفاتورة بالكامل، تفضل بزيارة الرابط التالي:\\n\${url}\`;
                  window.open(\`https://wa.me/?text=\${encodeURIComponent(text)}\`, '_blank');
                }}
                disabled={loading || !order}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
              >
                <MessageCircle className="h-4 w-4" />
                واتساب
              </button>
              
              <button
                onClick={() => {
                  const element = document.getElementById('pdf-invoice-template-modal');
                  if (!element) return;
                  const opt = {
                    margin: 0,
                    filename: \`invoice_\${orderId}.pdf\`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                  };
                  html2pdf().set(opt).from(element).save();
                }}
                disabled={loading || !order}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                تحميل PDF
              </button>

              <button
                onClick={() => handlePrintSilent()}
                disabled={loading || !order}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                طباعة
              </button>
              
              `;
    c = c.substring(0, bStart) + newButtons + c.substring(bEnd);
  }

  fs.writeFileSync('src/components/Dashboard/AdminOrderModal.jsx', c, 'utf8');
  console.log('Fixed AdminOrderModal buttons safely');
}
