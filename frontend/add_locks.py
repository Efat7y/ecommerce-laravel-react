import re

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
if 'import Swal' not in content:
    content = content.replace(
        'import { Loader2, Save, Settings as SettingsIcon, FileText } from "lucide-react";',
        'import { Loader2, Save, Settings as SettingsIcon, FileText, Lock, Unlock } from "lucide-react";\nimport Swal from "sweetalert2";'
    )

# Add handleFeatureToggle
toggle_func = """
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
"""

content = content.replace('if (loading) {', toggle_func + '\n  if (loading) {')

# Add the UI section before the Logo section
ui_section = """
          <div className="pt-6 border-t border-slate-800 mt-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" />
              إدارة مميزات النظام (للمطور فقط)
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              هذه الإعدادات محمية برقم سري. عند قفل الميزة، ستختفي تماماً من الموقع أمام الزوار.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature: Formula Calculator */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center gap-3">
                <div className="p-3 bg-slate-900 rounded-full">
                  {(!settings.feature_formulas || settings.feature_formulas === 'false') ? <Lock className="h-6 w-6 text-red-500" /> : <Unlock className="h-6 w-6 text-green-500" />}
                </div>
                <h3 className="font-bold text-white">حاسبة التركيبات</h3>
                <button
                  type="button"
                  onClick={() => handleFeatureToggle('feature_formulas', settings.feature_formulas)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${(!settings.feature_formulas || settings.feature_formulas === 'false') ? 'bg-green-600/20 text-green-500 hover:bg-green-600/30' : 'bg-red-600/20 text-red-500 hover:bg-red-600/30'}`}
                >
                  {(!settings.feature_formulas || settings.feature_formulas === 'false') ? 'فتح القفل والتفعيل' : 'قفل وإخفاء الميزة'}
                </button>
              </div>

              {/* Feature: Flash Sales */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center gap-3">
                <div className="p-3 bg-slate-900 rounded-full">
                  {(!settings.feature_flash_sales || settings.feature_flash_sales === 'false') ? <Lock className="h-6 w-6 text-red-500" /> : <Unlock className="h-6 w-6 text-green-500" />}
                </div>
                <h3 className="font-bold text-white">عروض الفلاش سيل</h3>
                <button
                  type="button"
                  onClick={() => handleFeatureToggle('feature_flash_sales', settings.feature_flash_sales)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${(!settings.feature_flash_sales || settings.feature_flash_sales === 'false') ? 'bg-green-600/20 text-green-500 hover:bg-green-600/30' : 'bg-red-600/20 text-red-500 hover:bg-red-600/30'}`}
                >
                  {(!settings.feature_flash_sales || settings.feature_flash_sales === 'false') ? 'فتح القفل والتفعيل' : 'قفل وإخفاء الميزة'}
                </button>
              </div>

              {/* Feature: Floating Chat */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center gap-3">
                <div className="p-3 bg-slate-900 rounded-full">
                  {(!settings.feature_chat || settings.feature_chat === 'false') ? <Lock className="h-6 w-6 text-red-500" /> : <Unlock className="h-6 w-6 text-green-500" />}
                </div>
                <h3 className="font-bold text-white">الشات الفوري</h3>
                <button
                  type="button"
                  onClick={() => handleFeatureToggle('feature_chat', settings.feature_chat)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${(!settings.feature_chat || settings.feature_chat === 'false') ? 'bg-green-600/20 text-green-500 hover:bg-green-600/30' : 'bg-red-600/20 text-red-500 hover:bg-red-600/30'}`}
                >
                  {(!settings.feature_chat || settings.feature_chat === 'false') ? 'فتح القفل والتفعيل' : 'قفل وإخفاء الميزة'}
                </button>
              </div>

            </div>
          </div>
"""

content = content.replace('<div>\n            <label className="block text-sm font-semibold text-slate-300 mb-2">O\'O1O O O U,U.U^U,O1 (Logo)</label>', ui_section + '\n\n          <div>\n            <label className="block text-sm font-semibold text-slate-300 mb-2">شعار الموقع (Logo)</label>')
# Replacing the mangled text for Logo with Arabic to be safe

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated SettingsManager.jsx with feature locks")
