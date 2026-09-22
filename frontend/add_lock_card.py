import re

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_card = """
              {/* Feature: Smart Calculator Materials */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center gap-3">
                <div className="p-3 bg-slate-900 rounded-full">
                  {(!settings.feature_calculator_materials || settings.feature_calculator_materials === 'false') ? <Lock className="h-6 w-6 text-red-500" /> : <Unlock className="h-6 w-6 text-green-500" />}
                </div>
                <h3 className="font-bold text-white">أسعار خامات الحاسبة</h3>
                <button
                  type="button"
                  onClick={() => handleFeatureToggle('feature_calculator_materials', settings.feature_calculator_materials)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${(!settings.feature_calculator_materials || settings.feature_calculator_materials === 'false') ? 'bg-green-600/20 text-green-500 hover:bg-green-600/30' : 'bg-red-600/20 text-red-500 hover:bg-red-600/30'}`}
                >
                  {(!settings.feature_calculator_materials || settings.feature_calculator_materials === 'false') ? 'فتح القفل والتفعيل' : 'قفل وإخفاء الميزة'}
                </button>
              </div>
"""

pattern = r"(onClick=\{\(\) => handleFeatureToggle\('feature_chat', settings\.feature_chat\)\}.*?</button>\s*</div>\s*)</div>\s*</div>"
replacement = r"\1" + new_card + r"\n              </div>\n            </div>"

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added new card to SettingsManager successfully")
