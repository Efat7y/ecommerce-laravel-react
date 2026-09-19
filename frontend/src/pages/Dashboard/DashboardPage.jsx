import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../Api/Api";
import { getToken } from "../../utils/auth";
import { Loader2, Users, Package, DollarSign, AlertCircle, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    // Fetch products & admin orders
    const getProducts = axios.get(`${baseUrl}/products`);
    const getOrders = axios.get(`${baseUrl}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([getProducts, getOrders])
      .then(([productsRes, ordersRes]) => {
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  // Stats Calculations
  const totalProducts = products.length;
  const totalOrders = orders.length;

  const completedOrders = orders.filter((o) => o.status === "completed");
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing");

  const totalSales = completedOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
  
  // Unique customers
  const uniqueCustomerEmails = new Set(orders.map((o) => o.user?.email).filter(Boolean));
  const totalCustomers = uniqueCustomerEmails.size;

  // Low stock products alert
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const stats = [
    {
      title: "عدد العملاء النشطين",
      value: totalCustomers,
      icon: Users,
      color: "text-blue-400 bg-blue-900/30",
    },
    {
      title: "إجمالي الطلبات المستلمة",
      value: totalOrders,
      icon: ShoppingCart,
      color: "text-indigo-400 bg-indigo-900/30",
    },
    {
      title: "إجمالي المبيعات المكتملة",
      value: `${totalSales.toLocaleString()} ج.م`,
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-900/30",
    },
    {
      title: "الخامات في الكتالوج",
      value: totalProducts,
      icon: Package,
      color: "text-purple-400 bg-purple-900/30",
    },
  ];

  return (
    <>
      <div className="mb-6" dir="rtl">
        <h1 className="text-xl md:text-2xl font-black text-white">إحصائيات وتقارير المتجر</h1>
        <p className="text-xs text-slate-400 mt-1">متابعة المبيعات، الطلبات، ونواقص المخازن لخامات المنظفات.</p>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-8" dir="rtl">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-slate-900 rounded-2xl p-4 md:p-6 border border-slate-800 shadow-sm flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-gray-400 block mb-1 truncate">{stat.title}</span>
                    <span className="text-lg md:text-2xl font-black text-white block truncate">{stat.value}</span>
                  </div>
                  <div className={`p-3 md:p-4 rounded-xl flex-shrink-0 ${stat.color}`}>
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Low Stock Alerts */}
            <div className="lg:col-span-1 bg-slate-900 rounded-2xl p-4 md:p-6 border border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-1.5">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                تنبيهات نواقص المخازن
              </h2>
              <hr />

              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">كل الخامات في حالة مخزون آمنة ممتازة.</p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="flex justify-between items-center bg-amber-900/20 p-3 rounded-xl border border-amber-900/50 text-xs">
                      <div>
                        <span className="font-bold text-slate-300 block">{p.name}</span>
                        <span className="text-gray-400">وحدة: {p.unit}</span>
                      </div>
                      <span className="font-extrabold text-amber-600 bg-slate-900 border border-amber-200 px-2.5 py-1 rounded-lg whitespace-nowrap">
                        متاح {p.stock}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders List */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 md:p-6 border border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base md:text-lg font-bold text-white">آخر طلبات الشراء الواردة</h2>
                <Link to="/dashboard/orders" className="text-xs font-bold text-blue-600 hover:underline">
                  عرض كل الفواتير
                </Link>
              </div>
              <hr />

              {orders.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">لا توجد طلبات شراء مسجلة بعد.</p>
              ) : (
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-right min-w-[400px]">
                    <thead>
                      <tr className="text-gray-400 font-bold border-b border-slate-800">
                        <th className="pb-2">رقم الفاتورة</th>
                        <th className="pb-2">العميل</th>
                        <th className="pb-2 hidden sm:table-cell">تاريخ الطلب</th>
                        <th className="pb-2">القيمة الكلية</th>
                        <th className="pb-2">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-800/50 transition">
                          <td className="py-3 font-bold text-white">#{o.id}</td>
                          <td className="py-3 font-medium text-slate-300">{o.user?.name || "عميل عام"}</td>
                          <td className="py-3 text-slate-400 hidden sm:table-cell">{new Date(o.created_at).toLocaleDateString("ar-EG")}</td>
                          <td className="py-3 font-extrabold text-blue-600 whitespace-nowrap">{parseFloat(o.total).toLocaleString()} ج.م</td>
                          <td className="py-3">
                            <span className={`inline-block rounded-md px-2 py-0.5 font-semibold text-[10px] ${
                              o.status === "completed"
                                ? "bg-emerald-900/30 text-emerald-400"
                                : o.status === "cancelled"
                                ? "bg-red-900/30 text-red-400"
                                : o.status === "shipped"
                                ? "bg-indigo-900/30 text-indigo-400"
                                : "bg-amber-900/30 text-amber-400"
                            }`}>
                              {o.status === "pending" && "قيد المراجعة"}
                              {o.status === "processing" && "جاري التجهيز"}
                              {o.status === "shipped" && "تم الشحن"}
                              {o.status === "completed" && "تم التسليم"}
                              {o.status === "cancelled" && "ملغي"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
