import re

# 1. Update useSettingsManager.js
with open('frontend/src/pages/Dashboard/SettingsManager/hooks/useSettingsManager.js', 'r', encoding='utf-8') as f:
    hook_content = f.read()

old_save = """  const saveSection = (keys, includeLogo = false) => {
    setSaving(true);
    const formData = new FormData();
    
    keys.forEach(key => {
      if (settings[key] !== undefined && key !== 'logo_base64') {
        formData.append(key, settings[key]);
      }
    });"""

new_save = """  const saveSection = (keys, includeLogo = false, overrides = {}) => {
    setSaving(true);
    const formData = new FormData();
    
    keys.forEach(key => {
      let valueToSave = overrides[key] !== undefined ? overrides[key] : settings[key];
      if (valueToSave !== undefined && key !== 'logo_base64') {
        formData.append(key, valueToSave);
      }
    });"""

hook_content = hook_content.replace(old_save, new_save)
with open('frontend/src/pages/Dashboard/SettingsManager/hooks/useSettingsManager.js', 'w', encoding='utf-8') as f:
    f.write(hook_content)

# 2. Update SettingsManager.jsx
with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'r', encoding='utf-8') as f:
    ui_content = f.read()

old_timeout = "setTimeout(() => saveSection([featureKey]), 100);"
new_timeout = "saveSection([featureKey], false, { [featureKey]: isEnabling ? 'true' : 'false' });"
ui_content = ui_content.replace(old_timeout, new_timeout)

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'w', encoding='utf-8') as f:
    f.write(ui_content)

print("Fixed asynchronous state bug in saveSection")
