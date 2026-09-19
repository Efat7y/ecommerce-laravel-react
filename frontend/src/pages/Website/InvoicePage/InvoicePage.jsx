import { Loader2, Printer, ArrowRight, Download, MessageCircle } from "lucide-react";
import InvoicePDFTemplate from "@/components/Website/InvoicePDFTemplate";
import useInvoicePage from "./hooks/useInvoicePage";

export default function InvoicePage() {
  const {
    id,
    navigate,
    settings,
    order,
    loading,
    error,
    componentRef,
    handlePrintSilent,
    handleShareWhatsapp,
    handleDownloadPDF
  } = useInvoicePage();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 text-center">
        <p className="text-xl font-bold text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 font-semibold"
        >
          العودة
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 py-8 print:bg-white print:py-0" dir="rtl">
      {/* Action Bar (Hidden in Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between px-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 font-semibold transition"
        >
          <ArrowRight className="h-5 w-5" />
          رجوع
        </button>
        <div className="flex gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleShareWhatsapp}
              className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-white shadow-lg shadow-green-500/30 hover:bg-green-600 font-bold transition"
            >
              <MessageCircle className="h-5 w-5" />
              مشاركة واتساب
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-white shadow-lg shadow-green-600/30 hover:bg-green-700 font-bold transition"
            >
              <Download className="h-5 w-5" />
              تحميل PDF
            </button>
            
            <button
              onClick={() => handlePrintSilent()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 font-bold transition"
            >
              <Printer className="h-5 w-5" />
              طباعة الفاتورة
            </button>
          </div>
        </div>
      </div>

      <div className="print:hidden" style={{ position: "absolute", top: "-9999px", left: "-9999px", zIndex: -10 }}>
        <div ref={componentRef}><InvoicePDFTemplate order={order} settings={settings} /></div>
      </div>

      {/* A4 Invoice Paper */}
      <div id="invoice-content">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-xl print:shadow-none print:border-0 rounded-2xl print:rounded-none overflow-hidden text-gray-900">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-8 border-b border-gray-100 bg-gray-50/50 print:bg-white print:border-b-2 print:border-gray-800">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              {settings?.logo ? (
                <img src={`http://127.0.0.1:8000${settings.logo}`} alt="Logo" className="h-16 object-contain" />
              ) : (
                <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl">
                  {settings?.site_name?.charAt(0) || "F"}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-gray-900">{settings?.site_name || "الفتح للمنظفات"}</h1>
                <p className="text-sm text-gray-500">{settings?.site_description || "متجر خامات كيميائية ومنظفات"}</p>
              </div>
            </div>
            <div className="text-center sm:text-left text-gray-600 space-y-1">
              <h2 className="text-3xl font-black text-gray-200 uppercase tracking-wider print:text-gray-300">INVOICE</h2>
              <p className="font-semibold text-gray-800">رقم الفاتورة: #{order.id}</p>
              <p className="text-sm text-gray-500">التاريخ: {new Date(order.created_at).toLocaleDateString("ar-EG")}</p>
            </div>
          </div>

          {/* Customer & Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">بيانات العميل</h3>
              <p className="text-lg font-bold text-gray-900">{order.user?.name || "عميل محذوف"}</p>
              <p className="text-gray-600 mt-1">{order.phone || order.user?.phone}</p>
              <p className="text-gray-600 mt-1">{order.shipping_address || "لم يتم تحديد عنوان"}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">تفاصيل الدفع</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold inline-block w-24">طريقة الدفع:</span> 
                  {order.payment_method === 'cash' ? 'نقدي عند الاستلام' : 'آجل (على الحساب)'}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold inline-block w-24">حالة الطلب:</span> 
                  {order.status === 'pending' ? 'جاري التجهيز' : 
                   order.status === 'completed' ? 'تم التسليم' : 'ملغي'}
                </p>
                {order.notes && (
                  <p className="text-gray-600">
                    <span className="font-semibold inline-block w-24">ملاحظات:</span> 
                    {order.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-8 pb-8">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-100 print:bg-gray-200 border-y border-gray-200 print:border-gray-800 text-gray-700">
                  <th className="py-3 px-4 font-bold w-12 text-center">م</th>
                  <th className="py-3 px-4 font-bold">اسم الصنف</th>
                  <th className="py-3 px-4 font-bold text-center">الكمية</th>
                  <th className="py-3 px-4 font-bold text-center">سعر الوحدة</th>
                  <th className="py-3 px-4 font-bold text-left">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 print:border-gray-300">
                    <td className="py-4 px-4 text-center text-gray-500">{index + 1}</td>
                    <td className="py-4 px-4 font-semibold text-gray-800">
                      {item.product?.name || "منتج محذوف"}
                      {item.product?.unit && <span className="text-xs text-gray-500 ml-2">({item.product.unit})</span>}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{parseFloat(item.price).toLocaleString()} ج.م</td>
                    <td className="py-4 px-4 font-bold text-gray-900 text-left">{parseFloat(item.total_price).toLocaleString()} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col sm:flex-row justify-between items-end p-8 bg-gray-50/50 print:bg-white pt-6 border-t border-gray-100 print:border-t-2 print:border-gray-800">
            <div className="mb-6 sm:mb-0 space-y-2">
              {settings?.whatsapp_number && (
                <p className="text-sm text-gray-500">📞 الدعم الفني: <span dir="ltr" className="inline-block">{settings.whatsapp_number}</span></p>
              )}
              <p className="text-xs text-gray-400">شكراً لثقتكم بنا.</p>
            </div>
            
            <div className="w-full sm:w-72 space-y-3">
              <div className="flex justify-between items-center text-gray-600">
                <span>المجموع الفرعي:</span>
                <span className="font-semibold">{parseFloat(order.subtotal || 0).toLocaleString()} ج.م</span>
              </div>
              
              <div className="flex justify-between items-center text-gray-600">
                <span>مصاريف الشحن:</span>
                <span className="font-semibold">{order.shipping_fee > 0 ? `${parseFloat(order.shipping_fee).toLocaleString()} ج.م` : '0 ج.م'}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between items-center text-emerald-600">
                  <span>الخصم المطبق:</span>
                  <span className="font-semibold">-{parseFloat(order.discount).toLocaleString()} ج.م</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 print:border-gray-800 mt-4">
                <span className="text-lg font-black text-gray-900">الإجمالي النهائي:</span>
                <span className="text-2xl font-black text-blue-600 print:text-gray-900">{parseFloat(order.total || 0).toLocaleString()} ج.م</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
