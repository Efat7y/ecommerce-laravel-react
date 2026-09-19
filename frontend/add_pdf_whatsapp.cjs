const fs = require('fs');
let c = fs.readFileSync('src/pages/Website/InvoicePage.jsx', 'utf8');

if (!c.includes('InvoicePDFTemplate')) {
  c = c.replace(
    'import { Loader2, Printer, ArrowRight } from "lucide-react";',
    'import { Loader2, Printer, ArrowRight, Download, MessageCircle } from "lucide-react";\nimport html2pdf from "html2pdf.js";\nimport InvoicePDFTemplate from "../../components/Website/InvoicePDFTemplate";'
  );

  const newButtons = `        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              const whatsappUrl = \`https://wa.me/?text=\${encodeURIComponent('مرحباً، تفاصيل فاتورتك رقم ' + order.id + ' جاهزة. قم بزيارة: ' + window.location.href)}\`;
              window.open(whatsappUrl, '_blank');
            }}
            className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-white shadow-lg shadow-green-500/30 hover:bg-green-600 font-bold transition"
          >
            <MessageCircle className="h-5 w-5" />
            مشاركة واتساب
          </button>
          
          <button
            onClick={() => {
              const element = document.getElementById('pdf-invoice-template');
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
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-white shadow-lg shadow-green-600/30 hover:bg-green-700 font-bold transition"
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
    newButtons
  );

  c = c.replace(
    '      {/* A4 Invoice Paper */}',
    '      <div style={{ position: "absolute", top: "-9999px", left: "-9999px", zIndex: -10 }}>\n        <InvoicePDFTemplate order={order} settings={settings} />\n      </div>\n\n      {/* A4 Invoice Paper */}'
  );
  
  // also add download PDF button to AdminOrderModal
  let m = fs.readFileSync('src/components/Dashboard/AdminOrderModal.jsx', 'utf8');
  if (!m.includes('window.open(`/invoice/${orderId}?download=1`')) {
      const modalBtn = `<Printer className="h-4 w-4" />
                طباعة
              </button>
              <button
                onClick={() => window.open(\`/invoice/\${orderId}?download=1\`, '_blank')}
                disabled={loading || !order}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
              >
                تحميل PDF
              </button>`;
      m = m.replace(/<Printer className="h-4 w-4" \/>\s*طباعة\s*<\/button>/, modalBtn);
      fs.writeFileSync('src/components/Dashboard/AdminOrderModal.jsx', m, 'utf8');
  }

  // add auto-download logic
  const autoDownLogic = `
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('download') === '1' && order && !loading) {
      setTimeout(() => {
        const element = document.getElementById('pdf-invoice-template');
        if (!element) return;
        const opt = {
          margin: 0,
          filename: \`invoice_\${id}.pdf\`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
      }, 500);
    }
  }, [order, loading]);
  
  const handlePrint = () => {`;
  c = c.replace('  const handlePrint = () => {', autoDownLogic);

  fs.writeFileSync('src/pages/Website/InvoicePage.jsx', c, 'utf8');
  console.log('Added PDF and WhatsApp sharing');
}
