import re

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the useCart destructuring
content = content.replace(
    'const { cart, addToCart } = useCart();',
    'const { cartItems, addToCart } = useCart();'
)

# Fix the cart.find logic
# Notice that `cart.find` could crash if cart is somehow not an array. We use optional chaining and check product.id
content = content.replace(
    'const cartItem = cart.find(item => item.id === product.id);',
    'const cartItem = (cartItems || []).find(item => item.product?.id === product.id);'
)

with open('frontend/src/components/Website/FlashSaleSection/FlashSaleSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed cart reference error")
