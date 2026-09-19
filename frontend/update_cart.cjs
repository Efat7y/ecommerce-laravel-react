const fs = require('fs');
let c = fs.readFileSync('src/pages/Website/CartPage.jsx', 'utf8');

if (!c.includes('useSettings')) {
  c = c.replace(
    'import { useCart } from "../../../context/CartContext";',
    'import { useCart } from "../../../context/CartContext";\nimport { useSettings } from "../../../context/SettingsContext";'
  );
  
  c = c.replace(
    '  const {',
    '  const { settings } = useSettings();\n  const {'
  );
  
  // Calculate final total including shipping
  c = c.replace(
    'const [notes, setNotes] = useState("");',
    'const [notes, setNotes] = useState("");\n\n  const shippingFee = parseInt(settings?.shipping_fee || 0);\n  const finalTotal = total + shippingFee;'
  );
  
  // Display shipping fee
  const shippingHTML = `                  <div className="flex justify-between">
                    <span className="text-gray-500">مصاريف الشحن:</span>
                    <span className="font-semibold text-blue-600">
                      {shippingFee > 0 ? \`\${shippingFee} ج.م\` : 'مجاناً'}
                    </span>
                  </div>`;
                  
  c = c.replace(
    /\{discount > 0 && \(/,
    shippingHTML + '\n                  {discount > 0 && ('
  );
  
  // Replace total display with finalTotal
  c = c.replace(
    /\{parseFloat\(total\)\.toLocaleString\(\)\} O\.U\./,
    '{parseFloat(finalTotal).toLocaleString()} ج.م'
  );
  
  fs.writeFileSync('src/pages/Website/CartPage.jsx', c, 'utf8');
  console.log('CartPage updated with shipping fee');
}
