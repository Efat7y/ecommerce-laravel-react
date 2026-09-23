import re

with open('frontend/src/Api/Api.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "export const baseUrl = `http://127.0.0.1:8000/api`;",
    "export const baseUrl = import.meta.env.VITE_API_URL || `http://127.0.0.1:8000/api`;"
)

with open('frontend/src/Api/Api.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Api.js")
