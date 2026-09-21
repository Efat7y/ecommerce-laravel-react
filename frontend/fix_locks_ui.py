import re

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

ui_section = """
          <div className="pt-6 border-t border-slate-800 mt-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" />
              إدارة مميزات النظام (للمطور فقط)
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              هذه الإعدادات محمية برقم سري. عند قفل الميزة، ستختفي تماماً من الموقع أمام الزوار ومن لوحة تحكم التاجر.
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

# Find `<div>\n            <label className="block text-sm font-semibold text-slate-300 mb-2">` followed by something containing `(Logo)`
pattern = r'(<div>\s*<label[^>]*>.*?\(Logo\)</label>)'

if not re.search(pattern, content):
    print("Could not find the Logo section!")
else:
    content = re.sub(pattern, ui_section + r'\n          \1', content)
    with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added features section successfully")
