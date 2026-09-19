export default function AdminOrderItems({ items }) {
  return (
    <div>
      <h3 className="text-lg font-black text-white mb-4">
        المنتجات (الخامات) المطلوبة
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="bg-gray-100 text-slate-400">
              <th className="py-3 px-4 font-bold rounded-r-xl">م</th>
              <th className="py-3 px-4 font-bold">اسم المنتج</th>
              <th className="py-3 px-4 font-bold text-center">الكمية</th>
              <th className="py-3 px-4 font-bold text-center">سعر الوحدة</th>
              <th className="py-3 px-4 font-bold rounded-l-xl">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, index) => (
              <tr
                key={item?.id || index}
                className="border-b border-slate-800 last:border-0"
              >
                <td className="py-4 px-4 font-bold text-gray-400">
                  {index + 1}
                </td>
                <td className="py-4 px-4 font-bold text-white">
                  {item?.product?.name || "منتج غير معروف"}
                </td>
                <td className="py-4 px-4 text-center font-black text-blue-600">
                  {item?.quantity || 0}{" "}
                  <span className="text-xs text-gray-400 font-normal">
                    {item?.product?.unit || ""}
                  </span>
                </td>
                <td className="py-4 px-4 text-center font-semibold text-slate-400">
                  {item?.price
                    ? parseFloat(item.price).toLocaleString()
                    : "0"}{" "}
                  ج.م
                </td>
                <td className="py-4 px-4 font-black text-white">
                  {item?.total_price
                    ? parseFloat(item.total_price).toLocaleString()
                    : "0"}{" "}
                  ج.م
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
