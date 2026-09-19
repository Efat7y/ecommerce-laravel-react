import { ClipboardList, MessageCircle, Download, Printer, X } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function AdminOrderHeader({ orderId, order, loading, handlePrintSilent, onClose }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">
            مراجعة الفاتورة #{orderId}
          </h2>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            const url = `http://${window.location.host}/invoice/${orderId}`;
            const text = `مرحباً، تفاصيل فاتورتك رقم ${orderId} جاهزة.\n\nلرؤية الفاتورة بالكامل، تفضل بزيارة الرابط التالي:\n${url}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
          }}
          disabled={loading || !order}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
        >
          <MessageCircle className="h-4 w-4" />
          واتساب
        </button>

        <button
          onClick={() => {
            const element = document.getElementById("pdf-invoice-template-modal");
            if (!element) return;
            const opt = {
              margin: 0,
              filename: `invoice_${orderId}.pdf`,
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true },
              jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
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

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
