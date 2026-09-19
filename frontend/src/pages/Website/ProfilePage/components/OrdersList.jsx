import { Loader2, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrdersList({ orders, loadingOrders }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 mb-6">
        فواتيرك وطلباتك السابقة
      </h3>

      {loadingOrders ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          لا توجد فواتير أو طلبات سابقة مسجلة لهذا الحساب.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 text-xs">
                <th className="pb-3 font-semibold">رقم الفاتورة</th>
                <th className="pb-3 font-semibold">التاريخ</th>
                <th className="pb-3 font-semibold">القطع</th>
                <th className="pb-3 font-semibold">قيمة الفاتورة</th>
                <th className="pb-3 font-semibold">الحالة</th>
                <th className="pb-3 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition"
                >
                  <td className="py-4 font-bold text-gray-900 dark:text-white">
                    #{o.id}
                  </td>
                  <td className="py-4 text-gray-500">
                    {new Date(o.created_at).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="py-4 text-gray-600">
                    {o.items?.length || 0} خامات
                  </td>
                  <td className="py-4 font-extrabold text-blue-600 dark:text-blue-400">
                    {parseFloat(o.total).toLocaleString()} ج.م
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                        o.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-white"
                          : o.status === "cancelled"
                            ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-white"
                            : o.status === "shipped"
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-white"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-white"
                      }`}
                    >
                      {o.status === "pending" && "قيد المراجعة"}
                      {o.status === "processing" && "جاري التجهيز"}
                      {o.status === "shipped" && "تم الشحن"}
                      {o.status === "completed" && "تم التسليم"}
                      {o.status === "cancelled" && "ملغي"}
                    </span>
                  </td>
                  <td className="py-4">
                    <Link
                      to={`/orders/${o.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      الفاتورة بالتفصيل
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
