import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSettings } from "../../context/SettingsContext";

export default function PrintableLedger() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { settings } = useSettings();
  const baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    axios
      .get(`${baseUrl}/admin/users/${id}/ledger`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching ledger", err);
      });
  }, [id, baseUrl]);

  // Auto trigger print when data is loaded
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        window.print();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-white" dir="rtl">
        <p className="text-xl font-bold text-slate-500">جاري تجهيز كشف الحساب للطباعة...</p>
      </div>
    );
  }

  const { user, ledger } = data;

  return (
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
        </div>

        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-4">
            {settings?.logo_base64 && (
              <img src={settings.logo_base64} alt="Logo" className="h-20 w-auto object-contain" />
            )}
            <div>
              <h1 className="text-3xl font-black text-slate-900">{settings?.site_name || "متجرنا"}</h1>
              <p className="text-sm text-slate-600 mt-1 font-semibold">{settings?.contact_phone || ""}</p>
              <p className="text-sm text-slate-600">{settings?.contact_email || ""}</p>
            </div>
          </div>
          <div className="text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">كشف حساب</h2>
            <p className="text-slate-500 mt-2 font-medium">
              تاريخ الإصدار: {new Date().toLocaleDateString("ar-EG")}
            </p>
          </div>
        </div>

        {/* Customer Details Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 text-slate-800">بيانات العميل</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">الاسم</p>
              <p className="font-bold text-lg">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">رقم الهاتف</p>
              <p className="font-bold text-lg">{user.phone || "غير مسجل"}</p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="flex gap-4 mb-10">
          <div className="flex-1 border border-slate-200 p-6 rounded-xl text-center">
            <p className="text-sm text-slate-500 font-bold mb-2">إجمالي المسحوبات (آجل)</p>
            <p className="text-2xl font-black text-slate-800">
              {parseFloat(ledger.total_credit_orders).toLocaleString()} ج.م
            </p>
          </div>
          <div className="flex-1 border border-slate-200 p-6 rounded-xl text-center bg-slate-50">
            <p className="text-sm text-slate-500 font-bold mb-2">إجمالي الدفعات المسددة</p>
            <p className="text-2xl font-black text-emerald-700">
              {parseFloat(ledger.total_payments).toLocaleString()} ج.م
            </p>
          </div>
          <div className={`flex-1 border p-6 rounded-xl text-center ${ledger.outstanding_balance > 0 ? "border-red-200 bg-red-50" : "border-slate-200 bg-emerald-50"}`}>
            <p className={`text-sm font-bold mb-2 ${ledger.outstanding_balance > 0 ? "text-red-600" : "text-emerald-600"}`}>الرصيد المتبقي (المديونية)</p>
            <p className={`text-3xl font-black ${ledger.outstanding_balance > 0 ? "text-red-700" : "text-emerald-700"}`}>
              {parseFloat(ledger.outstanding_balance).toLocaleString()} ج.م
            </p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full inline-block"></span>
            الدفعات المسددة
          </h3>
          <table className="w-full text-right border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 p-3 font-bold text-slate-700">التاريخ</th>
                <th className="border border-slate-200 p-3 font-bold text-slate-700">طريقة الدفع</th>
                <th className="border border-slate-200 p-3 font-bold text-slate-700">المبلغ</th>
                <th className="border border-slate-200 p-3 font-bold text-slate-700">الملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {user?.payments?.length > 0 ? (
                user.payments.map((payment) => (
                  <tr key={payment.id} className="odd:bg-white even:bg-slate-50">
                    <td className="border border-slate-200 p-3">
                      {new Date(payment.created_at).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="border border-slate-200 p-3 text-slate-600">
                      {payment.payment_method === 'cash' ? 'كاش' : payment.payment_method === 'transfer' ? 'تحويل بنكي' : 'شيك'}
                    </td>
                    <td className="border border-slate-200 p-3 font-bold text-emerald-700">
                      {parseFloat(payment.amount).toLocaleString()} ج.م
                    </td>
                    <td className="border border-slate-200 p-3 text-slate-600">
                      {payment.notes || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-slate-200 p-4 text-center text-slate-500">
                    لا توجد دفعات مسجلة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Orders Table */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
            بيان الطلبيات (الفواتير)
          </h3>
          <table className="w-full text-right border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 p-3 font-bold text-slate-700">رقم الفاتورة</th>
                <th className="border border-slate-200 p-3 font-bold text-slate-700">التاريخ</th>
                <th className="border border-slate-200 p-3 font-bold text-slate-700">نوع السداد</th>
                <th className="border border-slate-200 p-3 font-bold text-slate-700">حالة الطلب</th>
                <th className="border border-slate-200 p-3 font-bold text-slate-700">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {user?.orders?.length > 0 ? (
                user.orders.map((order) => (
                  <tr key={order.id} className="odd:bg-white even:bg-slate-50">
                    <td className="border border-slate-200 p-3 font-bold text-slate-700">#{order.id}</td>
                    <td className="border border-slate-200 p-3">
                      {new Date(order.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="border border-slate-200 p-3 text-slate-600">
                      {order.payment_method === 'credit' ? 'آجل (مديونية)' : 'كاش'}
                    </td>
                    <td className="border border-slate-200 p-3 text-slate-600">
                      {order.status === 'completed' ? 'مكتمل' : 
                       order.status === 'cancelled' ? 'ملغي' : 
                       order.status === 'processing' ? 'قيد التجهيز' : 'قيد الانتظار'}
                    </td>
                    <td className="border border-slate-200 p-3 font-bold">
                      {parseFloat(order.total).toLocaleString()} ج.م
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border border-slate-200 p-4 text-center text-slate-500">
                    لا توجد طلبيات مسجلة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t-2 border-slate-200 text-center text-sm text-slate-500">
          <p>تم إصدار هذا الكشف آلياً من نظام إدارة المبيعات - {settings?.site_name || "متجرنا"}</p>
        </div>

      </div>
    </div>
  );
}
