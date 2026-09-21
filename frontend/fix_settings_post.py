import re

with open('frontend/src/pages/Dashboard/SettingsManager/hooks/useSettingsManager.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the formData loop
old_loop = """    Object.keys(settings).forEach(key => {
      formData.append(key, settings[key]);
    });"""

new_loop = """    Object.keys(settings).forEach(key => {
      if (key !== 'logo_base64') {
        formData.append(key, settings[key]);
      }
    });"""

content = content.replace(old_loop, new_loop)

with open('frontend/src/pages/Dashboard/SettingsManager/hooks/useSettingsManager.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated formData loop")
