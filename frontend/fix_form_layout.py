import re

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract from <form to </form>
pattern = r'<form\s*onSubmit=\{handleCreate\}\s*className="flex flex-wrap gap-4 items-end"\s*>.*?</form>'

new_form = """<form
          onSubmit={handleCreate}
          className="flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
              \\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0644\\u0639\\u0631\\u0636
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
              placeholder="\\u0645\\u062b\\u0627\\u0644: \\u062e\\u0635\\u0645 \\u0646\\u0647\\u0627\\u064a\\u0629 \\u0627\\u0644\\u0623\\u0633\\u0628\\u0648\\u0639"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
              \\u0627\\u0644\\u0648\\u0635\\u0641 \\u0627\\u0644\\u062a\\u0634\\u0648\\u064a\\u0642\\u064a
            </label>
            <input
              type="text"
              value={teaserDescription}
              onChange={(e) => setTeaserDescription(e.target.value)}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
              placeholder="\\u0645\\u062b\\u0627\\u0644: \\u062a\\u0628\\u062f\\u0623 \\u0627\\u0644\\u062e\\u0635\\u0648\\u0645\\u0627\\u062a \\u0642\\u0631\\u064a\\u0628\\u0627\\u064b!"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1 font-bold text-blue-600 dark:text-blue-400">
              \\u0648\\u0642\\u062a \\u0627\\u0644\\u0628\\u062f\\u0621
            </label>
            <input
              type="datetime-local"
              value={productsRevealTime}
              onChange={(e) => setProductsRevealTime(e.target.value)}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1 font-bold text-green-600 dark:text-green-400">
              \\u0648\\u0642\\u062a \\u0641\\u062a\\u062d \\u0627\\u0644\\u0642\\u0641\\u0644
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1 font-bold text-red-600 dark:text-red-400">
              \\u0648\\u0642\\u062a \\u0627\\u0646\\u062a\\u0647\\u0627\\u0621 \\u0627\\u0644\\u0639\\u0631\\u0636
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div className="flex items-center gap-2 mb-3 w-full md:w-auto">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                \\u062a\\u0641\\u0639\\u064a\\u0644 \\u0627\\u0644\\u0639\\u0631\\u0636
              </span>
            </label>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 flex-1 md:flex-none justify-center"
            >
              <Plus className="w-4 h-4" /> {editingSaleId ? "\\u062d\\u0641\\u0638 \\u0627\\u0644\\u062a\\u0639\\u062f\\u064a\\u0644\\u0627\\u062a" : "\\u0625\\u0636\\u0627\\u0641\\u0629"}
            </button>
            {editingSaleId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex-1 md:flex-none justify-center"
              >
                \\u0625\\u0644\\u063a\\u0627\\u0621
              </button>
            )}
          </div>
        </form>"""

# decode unicode escapes to real arabic chars so the file is clean UTF-8
new_form = new_form.encode('utf-8').decode('unicode_escape')

content = re.sub(pattern, new_form, content, flags=re.DOTALL)

with open('frontend/src/pages/Dashboard/FlashSaleManager/FlashSaleManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed Form Layout")
