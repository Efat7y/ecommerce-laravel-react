import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "../../../../Api/Api";
import { getToken, getUser } from "../../../../utils/auth";
import { useCart } from "../../../../context/CartContext";
import { useSettings } from "../../../../context/SettingsContext";

export default function useCartPage() {
  const { settings } = useSettings();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    total,
    appliedCoupon,
    setAppliedCoupon
  } = useCart();

  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  // Checkout states
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [publicCoupons, setPublicCoupons] = useState([]);
  const [showManualCouponInput, setShowManualCouponInput] = useState(false);

  const shippingFee = parseInt(settings?.shipping_fee || 0);
  const finalTotal = total + shippingFee;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setShippingAddress(user.address || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Fetch all valid public coupons
  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios.get(`${baseUrl}/coupons/eligible`, { headers })
      .then(res => setPublicCoupons(res.data))
      .catch(err => console.error(err));
  }, [token]);

  const eligibleCoupons = publicCoupons.filter(c => subtotal >= c.min_order_value);
  const lockedCoupons = publicCoupons.filter(c => subtotal < c.min_order_value).sort((a, b) => a.min_order_value - b.min_order_value);
  const nextCoupon = lockedCoupons.length > 0 ? lockedCoupons[0] : null;

  const handleApplyCoupon = (e, codeToApply = couponCode) => {
    if (e) e.preventDefault();
    if (!codeToApply) return;
    
    setApplyingCoupon(true);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios.post(`${baseUrl}/coupons/apply`, {
      code: codeToApply,
      cart_total: subtotal
    }, { headers })
    .then(res => {
      setAppliedCoupon(res.data.coupon);
      toast.success(res.data.message);
      setCouponCode("");
    })
    .catch(err => {
      toast.error(err.response?.data?.message || "كود الخصم غير صالح");
    })
    .finally(() => setApplyingCoupon(false));
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success("تم إزالة الكوبون");
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login?redirect=cart");
      return;
    }

    if (cartItems.length === 0) return;

    setLoading(true);
    setErrorMessage("");

    const orderPayload = {
      items: cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      shipping_address: shippingAddress,
      phone: phone,
      notes: notes,
      payment_method: paymentMethod,
    };

    if (appliedCoupon) {
      orderPayload.coupon_code = appliedCoupon.code;
    }

    axios
      .post(`${baseUrl}/orders`, orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        clearCart();
        toast.success("تم تسجيل طلبك بنجاح");
        navigate(`/orders/${res.data.order.id}`);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("انتهت الجلسة. يرجى تسجيل الدخول مجدداً");
          navigate("/login?redirect=cart");
          return;
        }
        toast.error(
          err.response?.data?.message || "حدث خطأ أثناء تسجيل الطلب. يرجى المحاولة لاحقاً."
        );
      });
  };

  const handleRemoveItem = (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج من السلة؟")) return;
    removeFromCart(id);
    toast.success("تم إزالة المنتج من السلة");
  };

  return {
    cartItems,
    updateQuantity,
    subtotal,
    discount,
    total,
    shippingFee,
    finalTotal,
    appliedCoupon,
    couponCode, setCouponCode,
    applyingCoupon,
    eligibleCoupons,
    nextCoupon,
    showManualCouponInput, setShowManualCouponInput,
    handleApplyCoupon,
    handleRemoveCoupon,
    
    token,
    loading,
    errorMessage,
    
    // Checkout form states
    shippingAddress, setShippingAddress,
    phone, setPhone,
    paymentMethod, setPaymentMethod,
    notes, setNotes,
    
    // Actions
    handleCheckout,
    handleRemoveItem
  };
}
