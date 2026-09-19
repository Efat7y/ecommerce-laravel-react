const fs = require('fs');
let c = fs.readFileSync('src/pages/Website/InvoicePage.jsx', 'utf8');

// Remove the old auto-download logic
c = c.replace(
  `        // Auto-download if query param is set
        const params = new URLSearchParams(window.location.search);
        if (params.get('download') === '1') {
          setTimeout(() => {
            const btn = document.getElementById('auto-download-btn');
            if (btn) btn.click();
          }, 500);
        }`,
  ''
);

// Insert a new useEffect for auto-download
const newUseEffect = `
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('download') === '1' && order && !loading) {
      setTimeout(() => {
        const btn = document.getElementById('auto-download-btn');
        if (btn) btn.click();
      }, 500);
    }
  }, [order, loading]);
`;

c = c.replace(
  '  const handleDownloadPDF = () => {',
  newUseEffect + '\n  const handleDownloadPDF = () => {'
);

fs.writeFileSync('src/pages/Website/InvoicePage.jsx', c, 'utf8');
console.log('Fixed auto-download logic');
