import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AdminOrderModal from "@/components/Dashboard/AdminOrderModal/AdminOrderModal";
import { Loader2, Plus, Eye, Search, ClipboardList } from "lucide-react";
import useOrdersManager from "./hooks/useOrdersManager";

export default function OrdersManager() {
  const {
    loading,
    updatingId,
    viewOrderId, setViewOrderId,
    searchTerm, setSearchTerm,
    filteredOrders,
    handleStatusChange
  } = useOrdersManager();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8" dir="rtl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ClipboardList className="h-7 w-7 text-blue-600" />
            إدارة طلبات وخامات التنظيف
          </h1>
          <p className="text-xs text-slate-400 mt-1">متابعة فواتير خامات المنظفات وتعديل حالة التسليم.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            to="/dashboard/orders/add"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            إنشاء فاتورة
          </Link>
          
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="ابحث برقم الفاتورة، أو الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pr-10 pl-4 text-sm outline-none focus:border-blue-500 transition"
              dir="rtl"
            />
            <Search className="absolute top-3 right-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center" dir="rtl">
          <p className="text-slate-400">لا يوجد أي طلبات أو فواتير مسجلة حالياً.</p>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden" dir="rtl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm whitespace-nowrap">
              <thead className="bg-slate-800/50 text-slate-300 text-xs border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6 font-bold">رقم الفاتورة</th>
                  <th className="py-4 px-6 font-bold">العميل</th>
                  <th className="py-4 px-6 font-bold">الهاتف</th>
                  <th className="py-4 px-6 font-bold">التاريخ</th>
                  <th className="py-4 px-6 font-bold">إجمالي الفاتورة</th>
                  <th className="py-4 px-6 font-bold">حالة الطلب</th>
                  <th className="py-4 px-6 font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <motion.tbody
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                }}
                className="divide-y divide-slate-800/50"
              >
                {filteredOrders.map((o) => (
                  <motion.tr
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ scale: 1.01, backgroundColor: "#1e293b", transition: { duration: 0.2 } }}
                    key={o.id}
                    className="hover:bg-blue-900/20 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 font-extrabold text-white">#{o.id}</td>
                    <td className="py-4 px-6 font-semibold">{o.user?.name || "عميل غير معروف"}</td>
                    <td className="py-4 px-6 text-slate-400">{o.phone}</td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(o.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="py-4 px-6 font-black text-blue-600">
                      {parseFloat(o.total).toLocaleString()} ج.م
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {updatingId === o.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        ) : (
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className={`rounded-lg px-2 py-1 text-xs font-semibold outline-none border transition ${
                              o.status === "completed"
                                ? "bg-emerald-900/30 text-emerald-400 border-emerald-200"
                                : o.status === "cancelled"
                                ? "bg-red-900/30 text-red-400 border-red-200"
                                : o.status === "shipped"
                                ? "bg-indigo-900/30 text-indigo-400 border-indigo-200"
                                : "bg-amber-900/30 text-amber-400 border-amber-200"
                            }`}
                          >
                            <option value="pending">قيد المراجعة</option>
                            <option value="processing">جاري التجهيز</option>
                            <option value="shipped">تم الشحن</option>
                            <option value="completed">تم التسليم</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setViewOrderId(o.id)}
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-400 bg-blue-900/30 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                          title="عرض تفاصيل الفاتورة"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>عرض الفاتورة</span>
                        </button>
                        
                        <Link
                          to={`/dashboard/orders/edit/${o.id}`}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition"
                          title="تعديل الفاتورة"
                        >
                          <span>تعديل</span>
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      )}
      {/* Admin Order Modal */}
      {viewOrderId && (
        <AdminOrderModal
          orderId={viewOrderId}
          onClose={() => setViewOrderId(null)}
        />
      )}
    </>
  );
}
