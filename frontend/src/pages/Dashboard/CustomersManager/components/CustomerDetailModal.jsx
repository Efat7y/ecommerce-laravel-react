import { X, ShoppingCart, DollarSign, Calendar, Phone, ClipboardList, Eye } from "lucide-react";

export default function CustomerDetailModal({ selectedCustomer, setSelectedCustomer, setViewOrderId, statusColor, statusLabel }) {
  if (!selectedCustomer) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedCustomer(null);
      }}
    >
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-l from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
              {selectedCustomer.name?.charAt(0) || "؟"}
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                {selectedCustomer.name}
              </h2>
              <p className="text-xs text-slate-400">
                {selectedCustomer.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCustomer(null)}
            className="p-2 rounded-xl text-gray-400 hover:bg-blue-900/30 hover:text-slate-300 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Customer Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-900/30 rounded-2xl p-3 text-center">
              <ShoppingCart className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-black text-blue-400">
                {selectedCustomer.orders.length}
              </div>
              <div className="text-[10px] text-blue-500 font-semibold">
                إجمالي الطلبات
              </div>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-3 text-center">
              <DollarSign className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-base font-black text-emerald-700 leading-tight">
                {selectedCustomer.totalSpent.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-500 font-semibold">
                ج.م إجمالي
              </div>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-3 text-center">
              <Calendar className="h-5 w-5 text-indigo-600 mx-auto mb-1" />
              <div className="text-xs font-black text-indigo-700">
                {new Date(selectedCustomer.firstOrder).toLocaleDateString(
                  "ar-EG",
                )}
              </div>
              <div className="text-[10px] text-indigo-500 font-semibold">
                أول طلب
              </div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-3 text-center">
              <Phone className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <div className="text-xs font-black text-purple-700 truncate">
                {selectedCustomer.phone}
              </div>
              <div className="text-[10px] text-purple-500 font-semibold">
                رقم الهاتف
              </div>
            </div>
          </div>

          {/* Orders History */}
          <div>
            <h3 className="text-sm font-black text-slate-300 mb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-blue-600" />
              سجل الفواتير ({selectedCustomer.orders.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedCustomer.orders
                .sort(
                  (a, b) => new Date(b.created_at) - new Date(a.created_at),
                )
                .map((order) => (
                  <button
                    onClick={() => setViewOrderId(order.id)}
                    key={order.id}
                    className="flex items-center justify-between w-full bg-slate-800/50 hover:bg-blue-900/20 rounded-xl px-4 py-3 border border-transparent hover:border-blue-100 transition group text-right"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-300 group-hover:text-blue-400 text-sm transition">
                        #{order.id}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString(
                          "ar-EG",
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-blue-600 text-sm">
                        {parseFloat(order.total).toLocaleString()} ج.م
                      </span>
                      <span
                        className={`inline-block rounded-lg px-2.5 py-0.5 font-semibold text-[11px] border ${
                          statusColor[order.status] ||
                          "bg-slate-800/50 text-slate-400 border-slate-700"
                        }`}
                      >
                        {statusLabel[order.status] || order.status}
                      </span>
                      <Eye className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition mr-1 hidden sm:block" />
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-800/50 flex justify-end">
          <button
            onClick={() => setSelectedCustomer(null)}
            className="rounded-xl border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-400 hover:bg-slate-900 transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
