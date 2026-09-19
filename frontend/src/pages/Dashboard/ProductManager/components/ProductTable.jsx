import { motion } from "framer-motion";
import { Edit2, Trash2, ImageIcon } from "lucide-react";

export default function ProductTable({ filteredProducts, openEditModal, handleDelete }) {
  if (filteredProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center" dir="rtl">
        <p className="text-slate-400">لا توجد خامات معروضة حالياً تطابق شروط البحث.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden" dir="rtl">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm whitespace-nowrap">
          <thead className="bg-slate-800/50 text-slate-300 text-xs border-b border-slate-800">
            <tr>
              <th className="py-4 px-6 font-bold">الصورة</th>
              <th className="py-4 px-6 font-bold">الخامة / المنتج</th>
              <th className="py-4 px-6 font-bold">القسم</th>
              <th className="py-4 px-6 font-bold">السعر للوحدة</th>
              <th className="py-4 px-6 font-bold">وحدة التعبئة</th>
              <th className="py-4 px-6 font-bold">المخزون الحالي</th>
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
            {filteredProducts.map((p) => (
              <motion.tr
                variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.01, backgroundColor: "#1e293b", transition: { duration: 0.2 } }}
                key={p.id}
                className="hover:bg-blue-900/20 transition-colors duration-150"
              >
                <td className="py-4 px-6">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover border border-slate-700" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-gray-400">
                      <ImageIcon size={16} />
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="font-bold text-white">{p.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">{p.description}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="rounded-full bg-blue-900/30 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                    {p.category?.name || "بدون قسم"}
                  </span>
                </td>
                <td className="py-4 px-6 font-extrabold text-blue-600">
                  {parseFloat(p.price).toLocaleString()} ج.م
                </td>
                <td className="py-4 px-6 text-slate-400 font-medium">{p.unit}</td>
                <td className="py-4 px-6">
                  {p.stock > 5 ? (
                    <span className="text-slate-300 font-bold">{p.stock} وحدة</span>
                  ) : p.stock > 0 ? (
                    <span className="text-amber-600 font-bold animate-pulse">{p.stock} وحدة (منخفض!)</span>
                  ) : (
                    <span className="text-red-500 font-bold">منتهي</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-blue-900/30 hover:text-blue-400 transition"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
