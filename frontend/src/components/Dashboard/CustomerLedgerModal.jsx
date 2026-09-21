import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../Api/Api";
import { getToken } from "../../utils/auth";
import {
  X,
  DollarSign,
  Loader2,
  Calendar,
  FileText, Printer,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function CustomerLedgerModal({ customer, onClose }) {
  const [ledger, setLedger] = useState(null);
  const [customerData, setCustomerData] = useState(null);
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
        setCustomerData(res.data.user);
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

  
  const handlePrint = () => {
    window.open(`/print/ledger/${customer.id}`, '_blank');
  };

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
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition print:hidden"
            >
              <Printer className="w-4 h-4" />
              طباعة كشف الحساب
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 bg-gray-50 rounded-full hover:bg-gray-100 hover:text-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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
              <div className="print:hidden bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
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

              {/* Detailed Ledger Tables */}
              <div className="mt-8 space-y-6">
                
                {/* Payments History */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-white">سجل الدفعات المسددة</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">التاريخ والوقت</th>
                          <th className="px-4 py-3 font-semibold">المبلغ المسدد</th>
                          <th className="px-4 py-3 font-semibold">طريقة الدفع</th>
                          <th className="px-4 py-3 font-semibold">الملاحظات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {customerData?.payments?.length > 0 ? (
                          customerData.payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {new Date(payment.created_at).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                              </td>
                              <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                                {parseFloat(payment.amount).toLocaleString()} ج.م
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {payment.payment_method === 'cash' ? 'كاش' : payment.payment_method === 'transfer' ? 'تحويل بنكي' : 'شيك'}
                              </td>
                              <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate" title={payment.notes}>
                                {payment.notes || '-'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                              لا توجد دفعات مسجلة حتى الآن.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Orders History (Invoices) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-white">سجل الفواتير (الطلبيات)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">رقم الطلب</th>
                          <th className="px-4 py-3 font-semibold">التاريخ</th>
                          <th className="px-4 py-3 font-semibold">الإجمالي</th>
                          <th className="px-4 py-3 font-semibold">نوع السداد</th>
                          <th className="px-4 py-3 font-semibold">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {customerData?.orders?.length > 0 ? (
                          customerData.orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">
                                #{order.id}
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {new Date(order.created_at).toLocaleDateString('ar-EG')}
                              </td>
                              <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                                {parseFloat(order.total).toLocaleString()} ج.م
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${order.payment_method === 'credit' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {order.payment_method === 'credit' ? 'آجل (مديونية)' : 'كاش'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                  order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {order.status === 'completed' ? 'مكتمل' : 
                                   order.status === 'cancelled' ? 'ملغي' : 
                                   order.status === 'processing' ? 'قيد التجهيز' : 'قيد الانتظار'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                              لا توجد طلبات مسجلة حتى الآن.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

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
