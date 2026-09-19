import { Save } from "lucide-react";

export default function SecurityForm({
  handleUpdatePassword,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  saving,
}) {
  return (
    <form onSubmit={handleUpdatePassword} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
        تحديث كلمة المرور
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">
            كلمة المرور الجديدة
          </label>
          <input
            type="password"
            required
            placeholder="لا تقل عن 6 أحرف"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500  transition dark:border-gray-800 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">
            تأكيد كلمة المرور الجديدة
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500  transition dark:border-gray-800 dark:bg-slate-950"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
        >
          <Save className="h-4 w-4" />
          {saving ? "جاري التحديث..." : "تحديث كلمة المرور"}
        </button>
      </div>
    </form>
  );
}
