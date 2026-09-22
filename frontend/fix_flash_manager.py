import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add state
content = content.replace(
    'const [teaserDescription, setTeaserDescription] = useState("");\n  const [startTime, setStartTime] = useState("");',
    'const [teaserDescription, setTeaserDescription] = useState("");\n  const [productsRevealTime, setProductsRevealTime] = useState("");\n  const [startTime, setStartTime] = useState("");'
)

# Update openModalForEdit
content = content.replace(
    'setTeaserDescription(sale?.teaser_description || "");\n    setStartTime(',
    'setTeaserDescription(sale?.teaser_description || "");\n    setProductsRevealTime(sale?.products_reveal_time ? moment(sale.products_reveal_time).format("YYYY-MM-DDTHH:mm") : "");\n    setStartTime('
)

# Update resetForm
content = content.replace(
    'setTeaserDescription("");\n    setStartTime("");',
    'setTeaserDescription("");\n    setProductsRevealTime("");\n    setStartTime("");'
)

# Update payload
content = content.replace(
    'teaser_description: teaserDescription,\n      start_time: startTime || null,',
    'teaser_description: teaserDescription,\n      products_reveal_time: productsRevealTime || null,\n      start_time: startTime || null,'
)

# Reset in handleCreate
content = content.replace(
    'setTeaserDescription("");\n      setStartTime("");',
    'setTeaserDescription("");\n      setProductsRevealTime("");\n      setStartTime("");'
)

# Add Input field in JSX
# Before start_time input block
start_time_block = """            <div>
              <label className="block text-sm font-medium mb-1">
                U^U,O O"O_O O U,OO1O  (OOOUSOOUS)
              </label>"""
              
# The arabic string inside is garbled. We will just use regex to insert it before the block containing `value={startTime}`
input_block = """            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                وقت ظهور المنتجات (ترقب السعر) (اختياري)
              </label>
              <input
                type="datetime-local"
                value={productsRevealTime}
                onChange={(e) => setProductsRevealTime(e.target.value)}
                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>\n"""

# Inject before the div that contains value={startTime}
content = re.sub(
    r'(<div>\s*<label[^>]*>\s*[^<]*\s*</label>\s*<input\s*type="datetime-local"\s*value=\{startTime\})',
    input_block + r'\1',
    content
)

# Update labels for clarity
# The original labels were garbled, let's just do a string replace on the startTime label
# It's probably `وقت بدء العرض (اختياري)`
content = re.sub(
    r'<label className="block text-sm font-medium mb-1[^>]*>.*?وقت بدء العرض \(اختياري\).*?</label>',
    '<label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">وقت فك القفل وبدء العرض (اختياري)</label>',
    content,
    flags=re.DOTALL | re.IGNORECASE
)


with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated FlashSaleManager")
