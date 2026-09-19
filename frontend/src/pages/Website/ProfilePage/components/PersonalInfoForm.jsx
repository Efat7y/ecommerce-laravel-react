import { Save } from "lucide-react";

export default function PersonalInfoForm({
  handleUpdateInfo,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  bio,
  setBio,
  saving,
}) {
  return (
    <form onSubmit={handleUpdateInfo} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
        تعديل الملف الشخصي
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">
            الاسم بالكامل
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500  transition dark:border-gray-800 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500  transition dark:border-gray-800 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">
            رقم الهاتف
          </label>
          <input
            type="text"
            placeholder="مثال: 01012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500  transition dark:border-gray-800 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">
            العنوان الافتراضي
          </label>
          <input
            type="text"
            placeholder="المحافظة، المدينة، الشارع"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500  transition dark:border-gray-800 dark:bg-slate-950"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">
          نبذة شخصية أو نشاطك التجاري
        </label>
        <textarea
          rows={4}
          placeholder="اكتب شيئاً عن مجالك أو نشاط مصنعك..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500  transition dark:border-gray-800 dark:bg-slate-950"
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
        >
          <Save className="h-4 w-4" />
          {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </form>
  );
}
