import re

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "saveSection([featureKey], false, { [featureKey]: isEnabling ? 'true' : 'false' });",
    "saveSection([featureKey], false, { [featureKey]: isEnabling ? 'true' : 'false' }).then(() => window.location.reload());"
)

with open('frontend/src/pages/Dashboard/SettingsManager/SettingsManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added reload to handleFeatureToggle")
