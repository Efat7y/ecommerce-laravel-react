import { Link } from "react-router-dom";
import { LogIn, Send } from "lucide-react";

export default function CheckoutSummary({
  subtotal,
  totalFlashSavings,
  originalSubtotal,
  shippingFee,
  discount,
  finalTotal,
  appliedCoupon,
  couponCode,
  setCouponCode,
  applyingCoupon,
  eligibleCoupons,
  showManualCouponInput,
  setShowManualCouponInput,
  handleApplyCoupon,
  handleRemoveCoupon,
  token,
  handleCheckout,
  errorMessage,
  shippingAddress,
  setShippingAddress,
  phone,
  setPhone,
  paymentMethod,
  setPaymentMethod,
  notes,
  setNotes,
  loading,
}) {
  // const totalPrice = subtotal - appliedCoupon;
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          ملخص الفاتورة
        </h2>

        {/* Coupons Section */}
        <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          {appliedCoupon ? (
            <>
              <label className="block text-xs font-semibold text-gray-500 mb-2">
                كود الخصم المطبق
              </label>
              <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl">
                <div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {appliedCoupon.code}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-500 block">
                    تم تطبيق الخصم بنجاح
                  </span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-red-500 hover:text-red-700 underline"
                >
                  إزالة
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Toggle Manual Input */}
              {!showManualCouponInput ? (
                <button
                  onClick={() => setShowManualCouponInput(true)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  هل لديك كود خصم خاص؟
                </button>
              ) : (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">
                      أدخل كود الخصم
                    </label>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. VIP2024"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 transition dark:border-gray-800 dark:bg-slate-950"
                        dir="ltr"
                      />
                      <button
                        type="submit"
                        disabled={applyingCoupon || !couponCode}
                        className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 transition disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
                      >
                        {applyingCoupon ? "جاري..." : "تأكيد"}
                      </button>
                    </form>
                  </div>

                  {/* Eligible Public Coupons Display */}
                  {eligibleCoupons.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {eligibleCoupons.map((coupon) => (
                        <div
                          key={coupon.id}
                          className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2"
                        >
                          <span>
                            كود خصم متاح لك:{" "}
                            <strong className="font-mono text-sm bg-emerald-50 dark:bg-emerald-900/30 px-1 rounded select-all">
                              {coupon.code}
                            </strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleApplyCoupon(null, coupon.code)}
                            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 font-bold"
                          >
                            (تطبيق الكود فوراً)
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

                <div className="space-y-3 text-sm pb-4 border-b border-gray-100 dark:border-gray-800">
          {totalFlashSavings > 0 ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">السعر قبل الخصم:</span>
                <span className="font-semibold line-through text-gray-400">
                  {parseFloat(originalSubtotal).toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">السعر بعد الخصم:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {parseFloat(subtotal).toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 p-2 rounded-lg mt-2 mb-2">
                <span>نسبة التوفير ({( (totalFlashSavings / originalSubtotal) * 100 ).toFixed(1)}%):</span>
                <span>-{parseFloat(totalFlashSavings).toLocaleString()} ج.م</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-gray-500">المجموع الفرعي:</span>
              <span className="font-semibold">
                {parseFloat(subtotal).toLocaleString()} ج.م
              </span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-500">مصاريف الشحن:</span>
            <span className="font-semibold text-blue-600">
              {shippingFee > 0 ? `${shippingFee} ج.م` : "مجاناً"}
            </span>
          </div>
          {discount > 0 && appliedCoupon && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>خصم الكوبون ({appliedCoupon.code}):</span>
              <span>-{parseFloat(discount).toLocaleString()} ج.م</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center py-4 text-base font-black">
          <span>الإجمالي النهائي:</span>
          <span className="text-2xl text-blue-600 dark:text-blue-400">
            {parseFloat(finalTotal).toLocaleString()} ج.م
          </span>
        </div>

        {token ? (
          <form onSubmit={handleCheckout} className="mt-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-4">
              بيانات شحن الطلب
            </h3>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg dark:bg-red-950/30 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                عنوان التوصيل بالتفصيل
              </label>
              <input
                type="text"
                required
                placeholder="المحافظة، المدينة، اسم الشارع، المعالم المميزة"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition dark:border-gray-800 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                رقم الهاتف للتواصل
              </label>
              <input
                type="tel"
                required
                placeholder="مثال: 01012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition dark:border-gray-800 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-1.5">
                طريقة الدفع
              </label>
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-950 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    نقدي عند الاستلام
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="credit"
                    checked={paymentMethod === "credit"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    آجل (على الحساب)
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                ملاحظات إضافية (اختياري)
              </label>
              <textarea
                placeholder="أي تفاصيل خاصة بتعبئة الخامات أو شحنها..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 transition dark:border-gray-800 dark:bg-slate-950"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              {loading ? "جاري إرسال الطلب..." : "تأكيد وإرسال الطلب"}
              <Send className="h-4 w-4 rotate-180" />
            </button>
          </form>
        ) : (
          <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-500 mb-4">
              يجب تسجيل الدخول لإتمام عملية الشحن وتسجيل الفاتورة.
            </p>
            <Link
              to="/login?redirect=cart"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <LogIn className="h-4 w-4" />
              تسجيل الدخول للمتابعة
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
