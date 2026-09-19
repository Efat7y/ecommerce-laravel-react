import { Link } from "react-router-dom";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Website/layout/Header/Header";
import useOrderDetailPage from "./hooks/useOrderDetailPage";

export default function OrderDetailPage() {
  const {
    id,
    order,
    loading,
    settings
  } = useOrderDetailPage();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col" dir="rtl">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col" dir="rtl">
        <Helmet>
          <title>تفاصيل الطلب</title>
        </Helmet>
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">لم يتم العثور على الفاتورة.</h2>
          <Link to="/profile" className="mt-4 text-blue-600 hover:underline">العودة لحسابي</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-cairo selection:bg-blue-200" dir="rtl">
      <Helmet>
        <title>{`تفاصيل طلب #${order.id}`}</title>
      </Helmet>
      <Header />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12">
        
        {/* Navigation / Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <Link 
            to="/profile" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للطلبات
          </Link>

          <div className="flex items-center gap-3">
            {order.status === 'pending' && (
              <Link
                to={`/orders/edit/${order.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/10 hover:bg-amber-600 transition"
              >
                تعديل الفاتورة
              </Link>
            )}
          </div>
        </div>

        {/* Success alert for new orders */}
        {order.status === "pending" && (
          <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-center gap-3 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400">
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold">تم تسجيل طلبك بنجاح!</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">طلبك الآن قيد المراجعة وسنتواصل معك قريباً لتأكيد الشحن.</p>
            </div>
          </div>
        )}

        {/* Invoice Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200/80 dark:border-gray-800">
          
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-gray-800 pb-8 gap-4">
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">فاتورة شراء</span>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-1">طلب رقم #{order.id}</h2>
              <p className="text-xs text-gray-400 mt-1">تاريخ الطلب: {new Date(order.created_at).toLocaleString("ar-EG")}</p>
            </div>
            
            <div className="text-right sm:text-left">
              <span className="text-xs text-gray-400 block">حالة الطلب الحالية</span>
              <span className={`inline-block mt-1.5 rounded-md px-3 py-1 text-xs font-bold ${
                order.status === "completed"
                  ? "bg-emerald-100 text-emerald-800"
                  : order.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : order.status === "shipped"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
                {order.status === "pending" && "قيد المراجعة والموافقة"}
                {order.status === "processing" && "جاري تجهيز الخامات"}
                {order.status === "shipped" && "تم الشحن مع المندوب"}
                {order.status === "completed" && "تم التسليم بنجاح"}
                {order.status === "cancelled" && "طلب ملغي"}
              </span>
            </div>
          </div>

          {/* Client & Vendor details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-gray-100 dark:border-gray-800 text-sm">
            <div>
              <h4 className="font-bold text-gray-400 mb-2">جهة الشحن والتسليم:</h4>
              <p className="font-extrabold text-gray-900 dark:text-white">{order.user?.name}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">هاتف: {order.phone}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5">العنوان: {order.shipping_address}</p>
              {order.notes && (
                <p className="text-gray-500 dark:text-gray-500 mt-2 italic">ملاحظات: {order.notes}</p>
              )}
            </div>

            <div className="sm:text-left">
              <h4 className="font-bold text-gray-400 mb-2">بيانات المورد:</h4>
              <p className="font-extrabold text-gray-900 dark:text-white">
                {settings?.vendor_name || settings?.site_name || "اسم المؤسسة غير محدد"}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                رقم السجل: {settings?.commercial_record || "غير محدد"}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                {settings?.vendor_address || "عنوان المؤسسة غير محدد"}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                الدعم الفني: <span dir="ltr" className="inline-block">{settings?.support_phone || settings?.whatsapp_number || "غير محدد"}</span>
              </p>
            </div>
          </div>

          {/* Products Table */}
          <div className="py-8">
            <h4 className="font-bold text-gray-400 mb-4">تفاصيل الخامات المطلوبة:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 text-xs">
                    <th className="pb-3 font-semibold w-10">م</th>
                    <th className="pb-3 font-semibold">الصنف</th>
                    <th className="pb-3 font-semibold text-center">التعبئة / الوحدة</th>
                    <th className="pb-3 font-semibold text-center">الكمية</th>
                    <th className="pb-3 font-semibold text-left">سعر الوحدة</th>
                    <th className="pb-3 font-semibold text-left">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-50 dark:border-gray-800/30">
                      <td className="py-4 font-bold text-gray-400">{index + 1}</td>
                      <td className="py-4 font-semibold text-gray-900 dark:text-white">
                        {item.product?.name || "خامة كيميائية"}
                      </td>
                      <td className="py-4 text-center text-gray-500">
                        {item.product?.unit || "كيلو"}
                      </td>
                      <td className="py-4 text-center font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </td>
                      <td className="py-4 text-left text-gray-600 dark:text-gray-400">
                        {parseFloat(item.price).toLocaleString()} ج.م
                      </td>
                      <td className="py-4 text-left font-bold text-gray-950 dark:text-white">
                        {parseFloat(item.total_price).toLocaleString()} ج.م
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex justify-end text-sm">
            <div className="w-full sm:w-64 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">المجموع الفرعي:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {parseFloat(order.subtotal).toLocaleString()} ج.م
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">مصاريف الشحن:</span>
                <span className="font-semibold text-blue-600">
                  {order.shipping_fee > 0 ? `${parseFloat(order.shipping_fee).toLocaleString()} ج.م` : '0 ج.م'}
                </span>
              </div>
              
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>الخصم المطبق:</span>
                  <span>-{parseFloat(order.discount).toLocaleString()} ج.م</span>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-3 text-base font-black">
                <span>الإجمالي الكلي:</span>
                <span className="text-xl text-blue-600 dark:text-blue-400">
                  {parseFloat(order.total).toLocaleString()} ج.م
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
