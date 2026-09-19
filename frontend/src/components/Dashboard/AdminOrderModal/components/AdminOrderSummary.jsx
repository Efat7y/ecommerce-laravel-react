export default function AdminOrderSummary({ order }) {
  return (
    <div className="flex justify-end pt-6 border-t border-slate-700">
      <div className="w-full max-w-sm space-y-3 bg-slate-800/50 p-6 rounded-2xl">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400 font-semibold">المجموع الفرعي:</span>
          <span className="font-bold text-white">
            {order?.subtotal
              ? parseFloat(order.subtotal).toLocaleString()
              : "0"}{" "}
            ج.م
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400 font-semibold">مصاريف الشحن:</span>
          <span className="font-bold text-blue-500">
            {order?.shipping_fee > 0
              ? `${parseFloat(order.shipping_fee).toLocaleString()} ج.م`
              : "مجاناً"}
          </span>
        </div>

        {order?.discount && parseFloat(order.discount) > 0 && (
          <div className="flex justify-between items-center text-sm text-emerald-600">
            <span className="font-semibold">الخصم المطبق:</span>
            <span className="font-bold">
              -{parseFloat(order.discount).toLocaleString()} ج.م
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-slate-700 mt-3">
          <span className="text-lg font-black text-white">
            الإجمالي النهائي:
          </span>
          <span className="text-2xl font-black text-blue-700">
            {order?.total ? parseFloat(order.total).toLocaleString() : "0"} ج.م
          </span>
        </div>
      </div>
    </div>
  );
}
