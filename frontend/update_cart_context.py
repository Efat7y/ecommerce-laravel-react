import re

with open('frontend/src/context/CartContext.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Calculate original subtotal
calc_replacement = """
  // Calculations
  const subtotal = cartItems.reduce((sum, item) => {
    if (item && item.product && item.product.price) {
      return sum + Number(item.product.price) * Number(item.quantity || 1);
    }
    return sum;
  }, 0);

  const originalSubtotal = cartItems.reduce((sum, item) => {
    if (item && item.product && item.product.price) {
      const origPrice = item.product.original_price ? Number(item.product.original_price) : Number(item.product.price);
      return sum + origPrice * Number(item.quantity || 1);
    }
    return sum;
  }, 0);

  const totalFlashSavings = originalSubtotal > subtotal ? originalSubtotal - subtotal : 0;
"""

content = re.sub(r'// Calculations\s+const subtotal = cartItems\.reduce\(\(sum, item\) => \{.*?\}, 0\);', calc_replacement, content, flags=re.DOTALL)

# Add to provider value
provider_replacement = """        subtotal,
        originalSubtotal,
        totalFlashSavings,"""
content = content.replace("        subtotal,", provider_replacement)

with open('frontend/src/context/CartContext.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CartContext")
