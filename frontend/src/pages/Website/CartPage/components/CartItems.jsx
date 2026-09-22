import { Link } from "react-router-dom";
import { Trash2, Sparkles } from "lucide-react";

export default function CartItems({
  cartItems,
  updateQuantity,
  handleRemoveItem,
  nextCoupon,
  subtotal,
}) {
  return (
    <div className="lg:col-span-2 space-y-4">
      {cartItems.map((item) => (
        <div
          key={item.product.id}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 gap-4"
        >
          {/* Info */}
          <div className="flex-1">
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
              {item.product.category?.name || "بدون قسم"}
            </span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1.5">
              <Link
                to={`/products/${item.product.id}`}
                className="hover:text-blue-600 transition"
              >
                {item.product.name}
              </Link>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              وحدة القياس: {item.product.unit}
            </p>
            
            {item.product.original_price ? (
              <div className="mt-1 space-y-0.5">
                <p className="text-xs text-gray-400 line-through">
                  السعر الأصلي: {parseFloat(item.product.original_price).toLocaleString()} ج.م
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-bold">
                  سعر العرض: {parseFloat(item.product.price).toLocaleString()} ج.م
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-1 font-bold">
                سعر الوحدة: {parseFloat(item.product.price).toLocaleString()} ج.م
              </p>
            )}

          </div>

          {/* Quantity & Actions */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
            {/* Qty controller */}
            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 dark:border-gray-800 dark:bg-slate-950">
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-r-xl transition dark:text-gray-400 dark:hover:bg-slate-800"
              >
                -
              </button>
              <span className="px-3 text-sm font-bold text-gray-800 dark:text-white">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-l-xl transition dark:text-gray-400 dark:hover:bg-slate-800"
              >
                +
              </button>
            </div>

            {/* Total Price */}
            <div className="text-left">
              <span className="text-sm font-black text-blue-600 dark:text-blue-400 block">
                {parseFloat(item.product.price * item.quantity).toLocaleString()}{" "}
                ج.م
              </span>
            </div>

            {/* Trash Button */}
            <button
              onClick={() => handleRemoveItem(item.product.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition"
              title="إزالة من السلة"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}

      {/* Next Coupon Threshold Warning */}
      {nextCoupon && (
        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-amber-800 text-sm dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-400 mt-4">
          <Sparkles className="h-5 w-5 flex-shrink-0" />
          <span>
            أضف منتجات بقيمة **
            {parseFloat(nextCoupon.min_order_value - subtotal).toLocaleString()} ج.م**
            إضافية لتستفيد من **كود خصم {nextCoupon.type === 'percent' ? `${nextCoupon.value}%` : `${nextCoupon.value} ج.م`}** !
          </span>
        </div>
      )}
    </div>
  );
}
