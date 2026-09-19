import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddVendorModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    status: "active",
    tier: "standard",
    role: "vendor"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd(form);
      toast.success("تمت إضافة التاجر بنجاح");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء إضافة التاجر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" dir="rtl">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-lg font-bold text-white">إضافة تاجر جديد</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">اسم التاجر / المتجر <span className="text-red-500">*</span></label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">البريد الإلكتروني <span className="text-red-500">*</span></label>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">كلمة المرور <span className="text-red-500">*</span></label>
            <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">رقم الهاتف</label>
            <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500" />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-semibold">
              إلغاء
            </button>
            <button disabled={loading} type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              حفظ التاجر
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
