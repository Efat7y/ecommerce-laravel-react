import re

with open('backend/app/Http/Controllers/SettingController.php', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a check to skip logo_base64
old_loop = """        foreach ($data as $key => $value) {
            // Handle file upload for logo separately if needed"""

new_loop = """        foreach ($data as $key => $value) {
            if ($key === 'logo_base64' || $key === 'logo') {
                continue;
            }
            
            // Handle file upload for logo separately if needed"""

content = content.replace(old_loop, new_loop)

# Oh wait, logo upload is handled inside the loop using $request->hasFile($key).
# If $key === 'logo', $request->hasFile('logo') will be skipped!
# Let's write a better replacement for SettingController.
