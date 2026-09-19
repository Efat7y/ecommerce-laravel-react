import { X, Check, Loader2 } from "lucide-react";

export default function ProductModal({
  editingProduct,
  closeModal,
  handleSubmit,
  errorMsg,
  name, setName,
  categoryId, setCategoryId,
  categories,
  unit, setUnit,
  price, setPrice,
  stock, setStock,
  setImageFile,
  description, setDescription,
  submitting,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">
            {editingProduct ? "تحديث بيانات الخامة" : "إضافة مادة خام جديدة"}
          </h2>
          <button onClick={closeModal} className="p-1 rounded-lg text-gray-400 hover:bg-slate-800/50 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-400 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">اسم الخامة بالكامل</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">القسم الكيميائي</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition text-white"
              >
                <option value="">-- اختر القسم --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">وحدة التعبئة</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">السعر للوحدة (ج.م)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">المخزون المتاح (وحدة)</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">صورة المنتج</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900/30 file:text-blue-400 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">الوصف الفني</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800/50 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Check className="h-4 w-4 text-white" />
              )}
              <span>حفظ البيانات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
