import { Link } from "react-router-dom";
import Header from "../../../components/Website/layout/Header/Header";
import { ShoppingCart } from "lucide-react";
import CartItems from "./components/CartItems";
import CheckoutSummary from "./components/CheckoutSummary";
import useCartPage from "./hooks/useCartPage";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    subtotal,
    totalFlashSavings,
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
    shippingAddress, setShippingAddress,
    phone, setPhone,
    paymentMethod, setPaymentMethod,
    notes, setNotes,
    handleCheckout,
    handleRemoveItem,
  } = useCartPage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100" dir="rtl">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-blue-600" />
          سلة المشتريات
        </h1>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-slate-900">
            <span className="text-6xl block mb-4">🛒</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              السلة فارغة حالياً
            </h2>
            <p className="text-gray-500 mb-6">
              تصفح أقسام الخامات وأضف ما تحتاجه لتجربتك أو مصنعك.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              الذهاب لصفحة المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CartItems
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              handleRemoveItem={handleRemoveItem}
              nextCoupon={nextCoupon}
              subtotal={subtotal}
            />

            <CheckoutSummary
              subtotal={subtotal}
              totalFlashSavings={totalFlashSavings}
              shippingFee={shippingFee}
              discount={discount}
              finalTotal={finalTotal}
              appliedCoupon={appliedCoupon}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              applyingCoupon={applyingCoupon}
              eligibleCoupons={eligibleCoupons}
              showManualCouponInput={showManualCouponInput}
              setShowManualCouponInput={setShowManualCouponInput}
              handleApplyCoupon={handleApplyCoupon}
              handleRemoveCoupon={handleRemoveCoupon}
              token={token}
              handleCheckout={handleCheckout}
              errorMessage={errorMessage}
              shippingAddress={shippingAddress}
              setShippingAddress={setShippingAddress}
              phone={phone}
              setPhone={setPhone}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              notes={notes}
              setNotes={setNotes}
              loading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
}
