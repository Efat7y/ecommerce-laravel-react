import re

with open('frontend/src/pages/Dashboard/SettingsManager/hooks/useSettingsManager.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the initial fetch to merge all settings (including dynamic feature toggles) instead of hardcoding keys.
new_fetch = """
  useEffect(() => {
    axios.get(`${baseUrl}/settings`)
      .then((res) => {
        setSettings(prev => ({
          ...prev,
          ...res.data
        }));
        if (res.data.logo) {
          setLogoPreview(`http://127.0.0.1:8000${res.data.logo}`);
        }
        setLoading(false);
      })
"""
content = re.sub(r'useEffect\(\(\) => \{.*?axios\.get.*?\.then\(\(res\) => \{.*?setSettings\(\{.*?\}\);.*?if \(res\.data\.logo\) \{', new_fetch + 'if (res.data.logo) {', content, flags=re.DOTALL)

# 2. In handleSubmit, reload the page after success so changes reflect everywhere immediately.
new_success = """
      .then((res) => {
        toast.success("تم حفظ الإعدادات بنجاح");
        setSaving(false);
        // Reload to apply settings globally and instantly to all components
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
"""
content = re.sub(r'\.then\(\(res\) => \{.*?toast\.success\(.*?\);.*?setSaving\(false\);.*?\}\)', new_success, content, flags=re.DOTALL)

with open('frontend/src/pages/Dashboard/SettingsManager/hooks/useSettingsManager.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated useSettingsManager.js")
