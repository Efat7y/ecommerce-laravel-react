import { User, MapPin, Phone, StickyNote } from "lucide-react";

export default function AdminOrderDetails({ order, statusLabel, paymentMethodLabel }) {
  return (
    <>
      <div className="flex justify-between items-start border-b border-slate-700 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">
            فاتورة طلب #{order?.id}
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            تاريخ الإنشاء:{" "}
            {order?.created_at
              ? new Date(order.created_at).toLocaleString("ar-EG")
              : ""}
          </p>
        </div>
        <div className="text-left">
          <span className="block text-sm font-bold text-gray-400 mb-1">
            حالة الطلب
          </span>
          <span className="inline-block px-3 py-1 bg-gray-100 text-slate-300 rounded-lg text-sm font-bold">
            {order?.status ? statusLabel[order.status] || order.status : ""}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-800">
        <div className="space-y-4">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider">
            بيانات العميل
          </h3>

          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-400" />
            <span className="font-bold text-white">
              {order?.user?.name || "عميل غير معروف"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <span className="font-semibold text-slate-300" dir="ltr">
              {order?.phone || order?.user?.phone || "غير محدد"}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
            <span className="font-semibold text-slate-300">
              {order?.shipping_address || "لا يوجد عنوان محدد"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider">
            تفاصيل الدفع
          </h3>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">طريقة الدفع:</span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              {order?.payment_method
                ? paymentMethodLabel[order.payment_method] ||
                  order.payment_method
                : "غير محدد"}
            </span>
          </div>

          {order?.notes && (
            <div className="flex items-start gap-3 mt-4 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
              <StickyNote className="h-5 w-5 text-yellow-600 shrink-0" />
              <div className="text-sm font-semibold text-yellow-800">
                {order.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
