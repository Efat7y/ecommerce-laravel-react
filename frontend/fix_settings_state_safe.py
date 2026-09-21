import re

with open('frontend/src/pages/Dashboard/SettingsManager/hooks/useSettingsManager.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific block of setSettings inside useEffect
old_set_settings = """        setSettings({
          site_name: res.data.site_name || "",
          site_description: res.data.site_description || "",
          shipping_fee: res.data.shipping_fee || "",
          whatsapp_number: res.data.whatsapp_number || "",
          facebook_url: res.data.facebook_url || "",
          vendor_name: res.data.vendor_name || "",
          commercial_record: res.data.commercial_record || "",
          vendor_address: res.data.vendor_address || "",
          support_phone: res.data.support_phone || "",
        });"""

new_set_settings = """        setSettings(prev => ({
          ...prev,
          ...res.data
        }));"""

content = content.replace(old_set_settings, new_set_settings)

# Replace the success toast block inside handleSubmit
old_success = """      .then((res) => {
        toast.success("تم حفظ الإعدادات بنجاح");
        setSaving(false);
      })"""

# Note: the original file had garbled arabic in toast.success. Let's just find the generic `.then((res) => {` inside the post request.
pattern_post = r'(axios\.post\(`\$\{baseUrl\}/admin/settings`, formData, \{\s*headers: \{ Authorization: `Bearer \$\{token\}` \}\s*\}\)\s*\.then\(\(res\) => \{)'
content = re.sub(pattern_post, r'\1\n        toast.success("تم حفظ الإعدادات بنجاح");\n        setTimeout(() => window.location.reload(), 1000);', content)

with open('frontend/src/pages/Dashboard/SettingsManager/hooks/useSettingsManager.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully via exact string matching")
