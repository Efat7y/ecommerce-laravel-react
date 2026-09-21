import { Loader2, Save, Settings as SettingsIcon, FileText, Lock, Unlock } from "lucide-react";
import Swal from "sweetalert2";
import useSettingsManager from "./hooks/useSettingsManager";

export default function SettingsManager() {
  const {
    settings,
    setSettings,
    logoPreview,
    handleLogoChange,
    loading,
    saving,
    handleSubmit
  } = useSettingsManager();

  
  const handleFeatureToggle = (featureKey, currentValue) => {
    // If it's currently false/undefined, we are trying to enable it (Unlock)
    // If it's true, we are trying to disable it (Lock)
    const isEnabling = !currentValue || currentValue === 'false';
    
    Swal.fire({
      title: isEnabling ? 'فك قفل الميزة' : 'قفل الميزة',
      text: 'أدخل الرقم السري للمطور:',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'تأكيد',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: isEnabling ? '#10b981' : '#ef4444',
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value === 'dev2026') {
          setSettings({ ...settings, [featureKey]: isEnabling ? 'true' : 'false' });
          Swal.fire('نجاح', 'تم تغيير حالة الميزة بنجاح. لا تنسَ حفظ الإعدادات في الأسفل!', 'success');
        } else {
          Swal.fire('خطأ', 'الرقم السري غير صحيح!', 'error');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div dir="rtl">
      <div className="flex items-center gap-2 mb-8">
        <SettingsIcon className="h-7 w-7 text-blue-600" />
        <h1 className="text-2xl font-black text-white">إعدادات الموقع والفاتورة</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">اسم الموقع</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">مصاريف الشحن الافتراضية</label>
              <input
                type="number"
                value={settings.shipping_fee}
                onChange={(e) => setSettings({ ...settings, shipping_fee: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">وصف الموقع (ميتا)</label>
              <textarea
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">رقم الواتساب</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">رابط صفحة فيسبوك</label>
              <input
                type="url"
                value={settings.facebook_url}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
                dir="ltr"
              />
            </div>

            <div className="md:col-span-2 pt-6 border-t border-slate-800 mt-2">
              <h2 className="text-lg font-bold text-white mb-4">معلومات صفحة "تواصل معنا"</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">رقم هاتف التواصل</label>
              <input
                type="text"
                value={settings.contact_phone || ""}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">البريد الإلكتروني للتواصل</label>
              <input
                type="email"
                value={settings.contact_email || ""}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
                dir="ltr"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">عنوان المقر (يظهر في اتصل بنا)</label>
              <input
                type="text"
                value={settings.contact_address || ""}
                onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 mt-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500" />
              بيانات المورد (تظهر في الفاتورة المطبوعة)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">اسم المورد / المؤسسة</label>
                <input
                  type="text"
                  placeholder="مثال: مؤسسة الفتح لخامات المنظفات"
                  value={settings.vendor_name}
                  onChange={(e) => setSettings({ ...settings, vendor_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">رقم السجل التجاري / الضريبي</label>
                <input
                  type="text"
                  placeholder="مثال: 104598-تجاري"
                  value={settings.commercial_record}
                  onChange={(e) => setSettings({ ...settings, commercial_record: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">عنوان المؤسسة</label>
                <input
                  type="text"
                  placeholder="مثال: القاهرة، جمهورية مصر العربية"
                  value={settings.vendor_address}
                  onChange={(e) => setSettings({ ...settings, vendor_address: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">هاتف الدعم الفني للفاتورة</label>
                <input
                  type="text"
                  placeholder="مثال: 01010061178"
                  value={settings.support_phone}
                  onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">شعار الموقع (Logo)</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-500">لا يوجد</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900/30 file:text-blue-400 hover:file:bg-blue-900/50 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              حفظ الإعدادات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
