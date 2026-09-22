import re

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = """  const endTimeMs = +new Date(flashSale.end_time);
  const startTimeMs = flashSale.start_time
    ? +new Date(flashSale.start_time)
    : 0;

  // 24 hours grace period for FOMO state
  const gracePeriodMs = 24 * 60 * 60 * 1000;

  const isUpcoming = startTimeMs > 0 && startTimeMs - currentTime > 0;
  const isEnded = endTimeMs - currentTime <= 0;
  const isFullyExpired = isEnded && currentTime - endTimeMs > gracePeriodMs;

  // If time completely passed the grace period, hide the section
  if (isFullyExpired) return null;

  const handleAddToCart = (e, product, flashPrice) => {
    e.preventDefault();
    if (isEnded) return; // Prevent adding if ended
    addToCart({ ...product, price: flashPrice });
    flyToCart(e, product.image);
  };

  // -------------------------------------------------------------
  // STATE 1: TEASER (Upcoming Sale) - Hides products
  // -------------------------------------------------------------
  if (isUpcoming) {"""

new_logic = """  const endTimeMs = +new Date(flashSale.end_time);
  const startTimeMs = flashSale.start_time ? +new Date(flashSale.start_time) : 0;
  const revealTimeMs = flashSale.products_reveal_time ? +new Date(flashSale.products_reveal_time) : 0;
  
  // 24 hours grace period for FOMO state
  const gracePeriodMs = 24 * 60 * 60 * 1000;

  const isEnded = endTimeMs - currentTime <= 0;
  const isFullyExpired = isEnded && currentTime - endTimeMs > gracePeriodMs;

  // If time completely passed the grace period, hide the section
  if (isFullyExpired) return null;
  
  // Teaser 1: Pure Teaser (Banner only)
  const isPureTeaser = revealTimeMs > 0 ? currentTime < revealTimeMs : (startTimeMs > 0 && currentTime < startTimeMs);
  
  // Teaser 2: Price Teaser (Products shown, prices locked)
  const isPriceTeaser = revealTimeMs > 0 && startTimeMs > 0 && currentTime >= revealTimeMs && currentTime < startTimeMs;
  
  // Timer selection
  const currentTimerEnd = isPriceTeaser ? flashSale.start_time : flashSale.end_time;

  const handleAddToCart = (e, product, flashPrice) => {
    e.preventDefault();
    if (isEnded || isPriceTeaser) return; // Prevent adding if ended or locked
    addToCart({ ...product, price: flashPrice });
    flyToCart(e, product.image);
  };

  // -------------------------------------------------------------
  // STATE 1: PURE TEASER (Banner only)
  // -------------------------------------------------------------
  if (isPureTeaser) {"""

# Do a smart replacement in case exact spaces don't match
content = re.sub(
    r'const endTimeMs = \+new Date\(flashSale\.end_time\);.*?if \(isUpcoming\) \{',
    new_logic,
    content,
    flags=re.DOTALL
)

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed FlashSale logic")
