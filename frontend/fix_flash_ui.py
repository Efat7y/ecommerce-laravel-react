import re

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update timing logic
timing_logic_old = """  const endTimeMs = +new Date(flashSale.end_time);
  const startTimeMs = flashSale.start_time
    ? +new Date(flashSale.start_time)
    : null;
  const nowMs = +new Date();

  const isTeaser = startTimeMs && nowMs < startTimeMs;
  const isEnded = nowMs > endTimeMs;

  if (isTeaser) {"""

timing_logic_new = """  const endTimeMs = +new Date(flashSale.end_time);
  const startTimeMs = flashSale.start_time
    ? +new Date(flashSale.start_time)
    : null;
  const revealTimeMs = flashSale.products_reveal_time
    ? +new Date(flashSale.products_reveal_time)
    : null;
  const nowMs = +new Date();

  const isEnded = nowMs > endTimeMs;
  const isPureTeaser = revealTimeMs ? nowMs < revealTimeMs : (startTimeMs && nowMs < startTimeMs);
  const isPriceTeaser = revealTimeMs && startTimeMs && nowMs >= revealTimeMs && nowMs < startTimeMs;
  
  // Which timer to show?
  const currentTimerEnd = isPriceTeaser ? flashSale.start_time : flashSale.end_time;

  if (isPureTeaser) {"""

content = content.replace(timing_logic_old, timing_logic_new)

# 2. Update Timer in the Swiper Section
# From: <CountdownTimer endTime={flashSale.end_time} />
# To: <CountdownTimer endTime={currentTimerEnd} />
content = content.replace('<CountdownTimer endTime={flashSale.end_time} />', '<CountdownTimer endTime={currentTimerEnd} />')

# 3. Update the Top Bar in Swiper Section for Price Teaser
# From: {isEnded ? "انتهى العرض ⏰" : flashSale.title || "عرض فلاش سيل ⚡"}
# To: {isEnded ? "انتهى العرض ⏰" : isPriceTeaser ? "ترقبوا العرض ⏳" : flashSale.title || "عرض فلاش سيل ⚡"}
# We will use regex to find and replace the title logic
content = re.sub(
    r'\{isEnded\s*\?\s*"[^"]+"\s*:\s*flashSale\.title\s*\|\|\s*"[^"]+"\}',
    r'{isEnded ? "انتهى العرض ⏰" : isPriceTeaser ? "ترقبوا العرض ⏳" : flashSale.title || "عرض فلاش سيل ⚡"}',
    content
)

# 4. Update the subtitle logic
content = re.sub(
    r'\{isEnded\s*\?\s*"[^"]+"\s*:\s*"[^"]+"\}',
    r'{isEnded ? "لقد فاتك هذا العرض، ترقب عروضنا القادمة!" : isPriceTeaser ? "سيتم فتح قفل السعر قريباً، استعد!" : "سارع قبل نفاد الكمية أو انتهاء الوقت!"}',
    content
)

# 5. Update the discount badge logic
content = re.sub(
    r'\{isEnded \? "[^"]+" : `خصم \$\{discountPercentage\}%`\}',
    r'{isEnded ? "فاتك العرض" : isPriceTeaser ? "مفاجأة قريباً" : `خصم ${discountPercentage}%`}',
    content
)

# 6. Update Price display
price_display_old = """                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className={`text-xl font-bold ${isEnded ? "text-gray-500 line-through" : "text-red-600 dark:text-red-400"}`}
                          >
                            {flashPrice} O.U.
                          </span>
                          {!isEnded && (
                            <span className="text-sm text-gray-400 line-through">
                              {product.price} O.U.
                            </span>
                          )}
                        </div>"""
                        
price_display_new = """                        <div className="flex items-center gap-2 mb-4">
                          {isPriceTeaser ? (
                            <div className="flex items-center justify-center w-full bg-slate-100 dark:bg-slate-700 py-2 rounded-lg gap-2">
                              <Lock className="w-5 h-5 text-slate-500" />
                              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">السعر مغلق مؤقتاً</span>
                            </div>
                          ) : (
                            <>
                              <span
                                className={`text-xl font-bold ${isEnded ? "text-gray-500 line-through" : "text-red-600 dark:text-red-400"}`}
                              >
                                {flashPrice} ج.م
                              </span>
                              {!isEnded && (
                                <span className="text-sm text-gray-400 line-through">
                                  {product.price} ج.م
                                </span>
                              )}
                            </>
                          )}
                        </div>"""
                        
content = re.sub(
    r'<div className="flex items-center gap-2 mb-4">.*?</div>',
    price_display_new,
    content,
    flags=re.DOTALL,
    count=1
)

# 7. Update Button
button_old = """                        <button
                          onClick={(e) =>
                            handleAddToCart(e, product, flashPrice)
                          }
                          disabled={isEnded}
                          className={`w-full text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isEnded ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                        >
                          {isEnded ? (
                            <>
                              <Clock className="w-5 h-5" /> O U+OUU% O U,O1OO 
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" /> OO U? U,U,O3U,Oc
                            </>
                          )}
                        </button>"""

button_new = """                        <button
                          onClick={(e) =>
                            handleAddToCart(e, product, flashPrice)
                          }
                          disabled={isEnded || isPriceTeaser}
                          className={`w-full text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isEnded || isPriceTeaser ? "bg-gray-400 cursor-not-allowed dark:bg-slate-700" : "bg-red-600 hover:bg-red-700"}`}
                        >
                          {isEnded ? (
                            <>
                              <Clock className="w-5 h-5" /> انتهى العرض
                            </>
                          ) : isPriceTeaser ? (
                            <>
                              <Lock className="w-5 h-5" /> السلة مغلقة
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" /> أضف للسلة
                            </>
                          )}
                        </button>"""

content = re.sub(
    r'<button\s*onClick=\{[^\}]+\}\s*disabled=\{isEnded\}\s*className=[^>]+>.*?</button>',
    button_new,
    content,
    flags=re.DOTALL
)

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated FlashSaleSection UI")
