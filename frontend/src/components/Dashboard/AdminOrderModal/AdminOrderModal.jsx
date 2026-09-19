import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { baseUrl } from "../../../Api/Api";
import { getToken } from "../../../utils/auth";
import { Loader2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import InvoicePDFTemplate from "../../Website/InvoicePDFTemplate";
import { useSettings } from "../../../context/SettingsContext";
import { toast } from "sonner";
import AdminOrderHeader from "./components/AdminOrderHeader";
import AdminOrderDetails from "./components/AdminOrderDetails";
import AdminOrderItems from "./components/AdminOrderItems";
import AdminOrderSummary from "./components/AdminOrderSummary";

export default function AdminOrderModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const { settings } = useSettings();
  const componentRef = useRef();

  const handlePrintSilent = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `invoice_${orderId}`,
  });

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    axios
      .get(`${baseUrl}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("حدث خطأ أثناء جلب تفاصيل الفاتورة");
        setLoading(false);
      });
  }, [orderId, token]);

  const statusLabel = {
    pending: "جاري التجهيز",
    completed: "مكتمل",
    cancelled: "ملغي",
  };

  const paymentMethodLabel = {
    cash: "نقدي عند الاستلام",
    credit: "آجل (على الحساب)",
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <AdminOrderHeader
          orderId={orderId}
          order={order}
          loading={loading}
          handlePrintSilent={handlePrintSilent}
          onClose={onClose}
        />

        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : order ? (
            <div className="space-y-8" id="invoice-printable-area">
              <AdminOrderDetails
                order={order}
                statusLabel={statusLabel}
                paymentMethodLabel={paymentMethodLabel}
              />
              <AdminOrderItems items={order.items} />
              <AdminOrderSummary order={order} />
            </div>
          ) : (
            <div className="text-center text-red-500 py-10 font-bold">
              لم يتم العثور على الفاتورة.
            </div>
          )}
        </div>
        <div style={{ display: "none" }}>
          <div ref={componentRef} id="pdf-invoice-template-modal">
            <InvoicePDFTemplate order={order} settings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
}
