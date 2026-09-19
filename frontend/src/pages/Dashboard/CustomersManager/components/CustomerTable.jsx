import { motion } from "framer-motion";
import { Phone, Calendar, Eye, FileText, UserX } from "lucide-react";

export default function CustomerTable({
  customers,
  handleSort,
  SortIcon,
  setSelectedCustomer,
  setLedgerCustomer,
  handleUpdateTier,
  handleUpdateStatus
}) {
  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
        <UserX className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-slate-400">لا يوجد عملاء مسجلون حالياً.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-800/80 text-white border-b border-slate-700">
            <tr>
              <th className="py-4 px-4 md:px-6 font-bold">
                <button
                  className="flex items-center gap-1 hover:text-slate-700 transition"
                  onClick={() => handleSort("name")}
                >
                  العميل <SortIcon col="name" />
                </button>
              </th>
              <th className="py-4 px-4 md:px-6 font-bold hidden md:table-cell">
                تواصل
              </th>
              <th className="py-4 px-4 md:px-6 font-bold">
                الحالة
              </th>
              <th className="py-4 px-4 md:px-6 font-bold">
                <button
                  className="flex items-center gap-1 hover:text-slate-700 transition"
                  onClick={() => handleSort("orders")}
                >
                  الطلبات <SortIcon col="orders" />
                </button>
              </th>
              <th className="py-4 px-4 md:px-6 font-bold">
                <button
                  className="flex items-center gap-1 hover:text-slate-700 transition"
                  onClick={() => handleSort("total")}
                >
                  الإجمالي <SortIcon col="total" />
                </button>
              </th>
              <th className="py-4 px-4 md:px-6 font-bold">
                <button
                  className="flex items-center gap-1 hover:text-red-400 transition"
                  onClick={() => handleSort("debt")}
                >
                  المديونية <SortIcon col="debt" />
                </button>
              </th>
              <th className="py-4 px-4 md:px-6 font-bold hidden lg:table-cell">
                التاريخ
              </th>
              <th className="py-4 px-4 md:px-6 font-bold text-center">
                إجراءات
              </th>
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
            {customers.map((c) => {
              const completedCount = c.orders.filter(
                (o) => o.status === "completed",
              ).length;
              return (
                <tr
                  key={c.email}
                  className="hover:bg-slate-800/50 transition text-white"
                >
                  {/* Customer Info */}
                  <td className="py-3 px-4 md:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {c.name?.charAt(0) || "؟"}
                      </div>
                      <div className="min-w-0 flex flex-col items-start gap-1">
                        <div className="font-bold text-white truncate max-w-[120px] md:max-w-none">
                          {c.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate max-w-[120px] md:max-w-none">
                          {c.email}
                        </div>
                        <select
                          value={c.tier}
                          onChange={(e) => handleUpdateTier(c.id, e.target.value)}
                          className={`text-xs font-bold rounded px-1.5 py-0.5 mt-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                            c.tier === 'vip' ? 'bg-amber-900/30 text-amber-400 border border-amber-800' :
                            c.tier === 'wholesale' ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-800' :
                            'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <option value="standard">عميل عادي</option>
                          <option value="vip">VIP</option>
                          <option value="wholesale">جملة</option>
                        </select>
                      </div>
                    </div>
                  </td>

                  {/* Contact - hidden on small */}
                  <td className="py-3 px-4 md:px-6 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-white">{c.phone}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 md:px-6">
                    <select
                        value={c.status}
                        onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                        className={`text-xs font-bold rounded px-2 py-1 focus:outline-none focus:ring-1 cursor-pointer ${
                          c.status === 'active' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' :
                          c.status === 'banned' ? 'bg-red-900/30 text-red-400 border border-red-800' :
                          'bg-amber-900/30 text-amber-400 border border-amber-800'
                        }`}
                      >
                        <option value="unverified">غير مفعل</option>
                        <option value="active">نشط</option>
                        <option value="banned">محظور</option>
                    </select>
                  </td>

                  {/* Orders count */}
                  <td className="py-3 px-4 md:px-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-extrabold text-white">
                        {c.orders.length}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {completedCount} مكتملة
                      </span>
                    </div>
                  </td>

                  {/* Total Spent */}
                  <td className="py-3 px-4 md:px-6 font-black text-blue-400 whitespace-nowrap">
                    {c.totalSpent.toLocaleString()} ج.م
                  </td>

                  {/* Debt */}
                  <td className="py-3 px-4 md:px-6 font-black whitespace-nowrap">
                    {c.outstandingBalance > 0 ? (
                      <span className="text-red-400 bg-red-900/30 px-2.5 py-1 rounded-lg border border-red-800">
                        {c.outstandingBalance.toLocaleString()} ج.م
                      </span>
                    ) : (
                      <span className="text-gray-400 font-medium">—</span>
                    )}
                  </td>

                  {/* Last Order - hidden on small */}
                  <td className="py-3 px-4 md:px-6 text-slate-400 text-xs hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-300" />
                      <span className="text-white">{new Date(c.lastOrder).toLocaleDateString("ar-EG")}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 md:px-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                          التفاصيل
                        </span>
                      </button>
                      <button
                        onClick={() => setLedgerCustomer(c)}
                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-900/30 hover:bg-emerald-900/50 px-3 py-1.5 rounded-lg transition"
                        title="كشف حساب (آجل)"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span className="hidden lg:inline">
                          كشف حساب
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 border-t border-slate-800 bg-slate-800/30 text-xs text-white text-right">
        إجمالي العملاء:{" "}
        <span className="font-bold text-slate-400">
          {customers.length}
        </span>
      </div>
    </div>
  );
}
