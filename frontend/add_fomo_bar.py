import re

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to extract flash_quantity and flash_sold
extract_old = """              {flashSale.products.map((product) => {
                const flashPrice = product.pivot.discount_price;
                const discountPercentage = Math.round("""
extract_new = """              {flashSale.products.map((product) => {
                const flashPrice = product.pivot.discount_price;
                const flashQty = product.pivot.flash_quantity;
                const flashSold = product.pivot.flash_sold || 0;
                const discountPercentage = Math.round("""

content = content.replace(extract_old, extract_new)

# Add the progress bar / quantity indicator right before the Add to Cart button
quantity_block = """
                        {/* Quantity Indicator */}
                        {!isEnded && flashQty && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1 font-bold text-gray-500 dark:text-gray-400">
                              <span>تم بيع {flashSold}</span>
                              <span className="text-red-600">متاح {flashQty - flashSold} فقط!</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                                style={{ width: `${Math.min((flashSold / flashQty) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
"""

content = re.sub(
    r'(<button\s*onClick=\{\(e\)\s*=>\s*handleAddToCart)',
    quantity_block + r'\1',
    content
)

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated FlashSaleSection with quantity FOMO bar")
