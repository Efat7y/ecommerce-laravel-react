import re

with open('backend/app/Http/Controllers/SettingController.php', 'r', encoding='utf-8') as f:
    content = f.read()

old_loop = """        foreach ($data as $key => $value) {
            // Handle file upload for logo separately if needed
            if ($request->hasFile($key)) {"""

new_loop = """        foreach ($data as $key => $value) {
            // Skip calculated fields that shouldn't be in the DB
            if ($key === 'logo_base64' || $value === null) {
                continue;
            }

            // Handle file upload for logo separately if needed
            if ($request->hasFile($key)) {"""

content = content.replace(old_loop, new_loop)

with open('backend/app/Http/Controllers/SettingController.php', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated SettingController")
