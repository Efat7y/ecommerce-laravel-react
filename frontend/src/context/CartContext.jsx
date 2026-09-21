/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { getToken } from "../utils/auth";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && item.product && typeof item.product.price !== 'undefined');
        }
      }
    } catch (e) {
      console.error("Cart parse error:", e);
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const token = getToken();
    if (!token) {
      toast.error('يرجى تسجيل الدخول أولاً للتمكن من الإضافة للسلة');
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        // Check stock
        const newQty = existing.quantity + qty;
        if (newQty > product.stock) {
          toast.error(
            `عذراً، المتوفر من هذا المنتج: ${product.stock}`,
          );
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item,
        );
      }
      if (qty > product.stock) {
        toast.error(
          `عذراً، المتوفر من هذا المنتج: ${product.stock}`,
        );
        return prev;
      }
      return [...prev, { product, quantity: qty }];
    });
    toast.success("تم إضافة المنتج إلى السلة 🛍️");
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          if (qty > item.product.stock) {
            toast.error(`أقصى كمية متاحة هي ${item.product.stock}`);
            return { ...item, quantity: item.product.stock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => {
    if (item && item.product && item.product.price) {
      return sum + Number(item.product.price) * Number(item.quantity || 1);
    }
    return sum;
  }, 0);

  // Auto-remove coupon if subtotal falls below min_order_value
  useEffect(() => {
    if (appliedCoupon && subtotal < appliedCoupon.min_order_value) {
      setAppliedCoupon(null);
      toast.error(`تم إزالة الكوبون لأن قيمة المشتريات أقل من الحد الأدنى (${appliedCoupon.min_order_value} ج.م)`);
    }
  }, [subtotal, appliedCoupon]);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'fixed') {
      discount = Math.min(appliedCoupon.value, subtotal);
    } else {
      discount = (appliedCoupon.value / 100) * subtotal;
      if (appliedCoupon.max_discount !== null && discount > appliedCoupon.max_discount) {
        discount = appliedCoupon.max_discount;
      }
    }
  }

  const total = subtotal - discount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        discount,
        total,
        appliedCoupon,
        setAppliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
