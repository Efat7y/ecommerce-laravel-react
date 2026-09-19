import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../Api/Api";
import { getToken } from "../../utils/auth";
import {
  X,
  DollarSign,
  Loader2,
  Calendar,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function CustomerLedgerModal({ customer, onClose }) {
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const token = getToken();

  const fetchLedger = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}/admin/users/${customer.id}/ledger`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLedger(res.data.ledger);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLedger();
  }, [customer.id]);

  const handleRecordPayment = (e) => {
    e.preventDefault();
    setSubmitting(true);
    axios
      .post(
        `${baseUrl}/admin/users/${customer.id}/payments`,
        {
          amount: parseFloat(paymentAmount),
          payment_method: paymentMethod,
          notes: paymentNotes,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        toast.success("تم تسجيل الدفعة بنجاح");
        setPaymentAmount("");
        setPaymentNotes("");
        fetchLedger();
        setSubmitting(false);
      })
      .catch((err) => {
        toast.error("فشل تسجيل الدفعة");
        console.error(err);
        setSubmitting(false);
      });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-100 dark:bg-slate-900 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="text-blue-600 h-6 w-6" />
              كشف حساب: {customer.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 bg-gray-50 rounded-full hover:bg-gray-100 hover:text-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : ledger ? (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl dark:bg-slate-950 border border-gray-100 dark:border-gray-800">
                  <div className="text-xs text-gray-500 mb-1">
                    إجمالي المسحوبات (آجل)
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {parseFloat(ledger.total_credit_orders).toLocaleString()}{" "}
                    ج.م
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl dark:bg-slate-950 border border-gray-100 dark:border-gray-800">
                  <div className="text-xs text-gray-500 mb-1">
                    إجمالي الدفعات المسددة
                  </div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {parseFloat(ledger.total_payments).toLocaleString()} ج.م
                  </div>
                </div>
                <div
                  className={`p-4 rounded-2xl border ${ledger.outstanding_balance > 0 ? "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30" : "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30"}`}
                >
                  <div
                    className={`text-xs mb-1 ${ledger.outstanding_balance > 0 ? "text-red-600" : "text-emerald-600"}`}
                  >
                    الرصيد المستحق (المديونية)
                  </div>
                  <div
                    className={`text-2xl font-black ${ledger.outstanding_balance > 0 ? "text-red-700 dark:text-red-500" : "text-emerald-700 dark:text-emerald-500"}`}
                  >
                    {parseFloat(ledger.outstanding_balance).toLocaleString()}{" "}
                    ج.م
                  </div>
                </div>
              </div>

              {/* Record Payment Form */}
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  تسديد دفعة نقدية
                </h3>
                <form
                  onSubmit={handleRecordPayment}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">
                      المبلغ (ج.م)
                    </label>
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      placeholder="أدخل المبلغ"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full rounded-xl border text-white border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 transition dark:border-gray-700 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">
                      طريقة الدفع
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-xl border text-white border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 transition dark:border-gray-700 dark:bg-slate-800"
                    >
                      <option value="cash">كاش (نقدي)</option>
                      <option value="transfer">تحويل بنكي / فودافون كاش</option>
                      <option value="check">شيك</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-white mb-1">
                      ملاحظات (اختياري)
                    </label>
                    <input
                      type="text"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      placeholder="رقم إيصال أو تفاصيل..."
                      className="w-full rounded-xl border border-gray-200 bg-white text-white px-3 py-2 text-sm outline-none focus:border-blue-500 transition dark:border-gray-700 dark:bg-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={submitting || !paymentAmount}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      تسجيل الدفعة
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              حدث خطأ أثناء جلب كشف الحساب.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
