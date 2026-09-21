import re

# --- 1. Fix CustomerLedgerModal.jsx ---
with open('frontend/src/components/Dashboard/CustomerLedgerModal.jsx', 'r', encoding='utf-8') as f:
    modal = f.read()

# Add useNavigate
if 'useNavigate' not in modal:
    modal = modal.replace('import { toast } from "sonner";', 'import { toast } from "sonner";\nimport { useNavigate } from "react-router-dom";')

# Inject const navigate = useNavigate(); inside the component
if 'const navigate = useNavigate();' not in modal:
    modal = modal.replace('export default function CustomerLedgerModal({ customer, onClose }) {', 'export default function CustomerLedgerModal({ customer, onClose }) {\n  const navigate = useNavigate();')

# Replace window.open with navigate
old_print = "window.open(`/print/ledger/${customer.id}`, '_blank');"
new_print = "navigate(`/print/ledger/${customer.id}`);"
modal = modal.replace(old_print, new_print)

with open('frontend/src/components/Dashboard/CustomerLedgerModal.jsx', 'w', encoding='utf-8') as f:
    f.write(modal)
print("Updated Modal")


# --- 2. Fix PrintableLedger.jsx ---
with open('frontend/src/pages/Printables/PrintableLedger.jsx', 'r', encoding='utf-8') as f:
    ledger = f.read()

# Import useNavigate
if 'useNavigate' not in ledger:
    ledger = ledger.replace('import { useParams } from "react-router-dom";', 'import { useParams, useNavigate } from "react-router-dom";')

if 'const navigate = useNavigate();' not in ledger:
    ledger = ledger.replace('const { id } = useParams();', 'const { id } = useParams();\n  const navigate = useNavigate();')

# Add @page styles and Back button, fix layout classes
old_header_wrapper = """  return (
    <div className="min-h-screen bg-white text-black font-sans print:p-0 p-8" dir="rtl">
      <div className="mx-auto" style={{ maxWidth: "210mm" }}>
        
        {/* Print Controls (Hidden when printing) */}
        <div className="mb-8 flex justify-end print:hidden">
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            طباعة الورقة الآن
          </button>
        </div>"""

new_header_wrapper = """  return (
    <div className="min-h-screen bg-white text-black font-sans p-8 print:p-0 w-full" dir="rtl">
      <style>
        {`
          @page {
            size: A4;
            margin: 15mm;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background: white;
            }
          }
        `}
      </style>
      <div className="mx-auto w-full max-w-4xl print:max-w-full print:mx-0 print:w-full">
        
        {/* Print Controls (Hidden when printing) */}
        <div className="mb-8 flex justify-between items-center print:hidden">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-slate-200 text-slate-800 font-bold rounded-lg hover:bg-slate-300"
          >
            &rarr; العودة للوحة التحكم
          </button>
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            طباعة كشف الحساب
          </button>
        </div>"""

ledger = ledger.replace(old_header_wrapper, new_header_wrapper)

with open('frontend/src/pages/Printables/PrintableLedger.jsx', 'w', encoding='utf-8') as f:
    f.write(ledger)
print("Updated PrintableLedger")
