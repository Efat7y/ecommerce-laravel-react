import re

# 1. Update useSettingsManager.js
with open('frontend/src/pages/Dashboard/SettingsManager/hooks/useSettingsManager.js', 'r', encoding='utf-8') as f:
    hook_content = f.read()

# Add saveSection function
save_section_func = """
  const saveSection = (keys, includeLogo = false) => {
    setSaving(true);
    const formData = new FormData();
    
    keys.forEach(key => {
      if (settings[key] !== undefined && key !== 'logo_base64') {
        formData.append(key, settings[key]);
      }
    });

    if (includeLogo && logo) {
      formData.append("logo", logo);
    }

    axios.post(`${baseUrl}/admin/settings`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      toast.success("تم الحفظ بنجاح");
      setTimeout(() => window.location.reload(), 800);
    })
    .catch((err) => {
      console.error(err);
      toast.error("حدث خطأ أثناء الحفظ");
      setSaving(false);
    });
  };
"""
hook_content = hook_content.replace('const handleSubmit = (e) => {', save_section_func + '\n  const handleSubmit = (e) => {')
hook_content = hook_content.replace('handleSubmit\n  };', 'handleSubmit,\n    saveSection\n  };')

with open('frontend/src/pages/Dashboard/SettingsManager/hooks/useSettingsManager.js', 'w', encoding='utf-8') as f:
    f.write(hook_content)

print("Updated hook")

# 2. Update SettingsManager.jsx
with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'r', encoding='utf-8') as f:
    ui_content = f.read()

# Import saveSection
ui_content = ui_content.replace('handleSubmit\n  } = useSettingsManager();', 'handleSubmit,\n    saveSection\n  } = useSettingsManager();')

# Convert the main <form onSubmit={handleSubmit}> to <div className="space-y-6">
ui_content = ui_content.replace('<form onSubmit={handleSubmit} className="space-y-6">', '<div className="space-y-8">')
# Remove the ending </form>
ui_content = ui_content.replace('</form>', '</div>')

# Remove the global save button at the bottom
global_save = """<div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              O-U?O, O U,OO1O_O O_O O
            </button>
          </div>"""
# Since encoding changes it, I'll use regex to remove it
ui_content = re.sub(r'<div className="flex justify-end pt-4 border-t border-slate-800">.*?</button>\s*</div>', '', ui_content, flags=re.DOTALL)

# Add Save Buttons to sections
# Section 1: Site Settings (before contact settings)
btn_site = """
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => saveSection(['site_name', 'shipping_fee', 'site_description', 'whatsapp_number', 'facebook_url'])}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                حفظ إعدادات الموقع
              </button>
            </div>
"""
# We can inject this before the contact settings divider: `<div className="md:col-span-2 pt-6 border-t border-slate-800 mt-2">`
ui_content = ui_content.replace('<div className="md:col-span-2 pt-6 border-t border-slate-800 mt-2">', btn_site + '\n            <div className="md:col-span-2 pt-6 border-t border-slate-800 mt-2">')

# Section 2: Contact Us
btn_contact = """
            <div className="flex justify-end mt-4 md:col-span-2">
              <button
                type="button"
                onClick={() => saveSection(['contact_phone', 'contact_email', 'contact_address'])}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                حفظ بيانات التواصل
              </button>
            </div>
"""
# Inject before Vendor Settings divider: `<div className="pt-6 border-t border-slate-800 mt-6">` (Wait, there are two, one for Features and one for Vendor)
# Vendor section has `<FileText className="h-5 w-5 text-emerald-500" />`
ui_content = re.sub(r'(<div className="pt-6 border-t border-slate-800 mt-6">\s*<h2[^>]*>\s*<FileText)', btn_contact + r'\n          \1', ui_content)

# Section 3: Vendor
btn_vendor = """
            <div className="flex justify-end mt-4 md:col-span-2">
              <button
                type="button"
                onClick={() => saveSection(['vendor_name', 'commercial_record', 'vendor_address', 'support_phone'])}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                حفظ بيانات المورد
              </button>
            </div>
"""
ui_content = re.sub(r'(<div className="pt-6 border-t border-slate-800 mt-6 mb-6">\s*<h2[^>]*>\s*<Lock)', btn_vendor + r'\n          \1', ui_content)

# Section 4: Logo
btn_logo = """
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => saveSection([], true)}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                حفظ الشعار
              </button>
            </div>
"""
# Inject after logo input
ui_content = re.sub(r'(accept="image/\*".*?/>\s*</div>\s*</div>)', r'\1' + '\n' + btn_logo, ui_content, flags=re.DOTALL)

# Modify handleFeatureToggle to save INSTANTLY
ui_content = re.sub(
    r"setSettings\(\{ \.\.\.settings, \[featureKey\]: isEnabling \? 'true' : 'false' \}\);.*?Swal\.fire.*?success'\);",
    "setSettings({ ...settings, [featureKey]: isEnabling ? 'true' : 'false' });\n          setTimeout(() => saveSection([featureKey]), 100);",
    ui_content,
    flags=re.DOTALL
)

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'w', encoding='utf-8') as f:
    f.write(ui_content)

print("Updated Settings UI")
