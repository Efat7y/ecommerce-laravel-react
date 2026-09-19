const fs = require('fs');
let c = fs.readFileSync('src/pages/Website/InvoicePage.jsx', 'utf8');

c = c.replace(
  '        setLoading(false);',
  `        setLoading(false);
        
        // Auto-download if query param is set
        const params = new URLSearchParams(window.location.search);
        if (params.get('download') === '1') {
          setTimeout(() => {
            const btn = document.getElementById('auto-download-btn');
            if (btn) btn.click();
          }, 500);
        }`
);

c = c.replace(
  'onClick={handleDownloadPDF}',
  'id="auto-download-btn"\n            onClick={handleDownloadPDF}'
);

fs.writeFileSync('src/pages/Website/InvoicePage.jsx', c, 'utf8');

// Also update AdminOrderModal
let m = fs.readFileSync('src/components/Dashboard/AdminOrderModal.jsx', 'utf8');
m = m.replace(
  /<Printer className="h-4 w-4" \/>\s*طباعة\s*<\/button>/,
  `<Printer className="h-4 w-4" />
                طباعة
              </button>
              <button
                onClick={() => window.open(\`/invoice/\${orderId}?download=1\`, '_blank')}
                disabled={loading || !order}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
              >
                تحميل PDF
              </button>`
);
fs.writeFileSync('src/components/Dashboard/AdminOrderModal.jsx', m, 'utf8');

console.log('Added auto-download and modal button');
