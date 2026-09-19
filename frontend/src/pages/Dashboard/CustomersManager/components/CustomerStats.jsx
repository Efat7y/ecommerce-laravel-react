import { Users, DollarSign, TrendingUp, UserCheck } from "lucide-react";

export default function CustomerStats({ customers }) {
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalOrdersCount = customers.reduce((sum, c) => sum + c.orders.length, 0);
  const avgOrdersPerCustomer = totalCustomers
    ? (totalOrdersCount / totalCustomers).toFixed(1)
    : 0;
  const topCustomer = [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0];

  const stats = [
    {
      title: "إجمالي العملاء",
      value: totalCustomers,
      icon: Users,
      color: "text-blue-400 bg-blue-900/30",
    },
    {
      title: "إجمالي الإيرادات",
      value: `${totalRevenue.toLocaleString()} ج.م`,
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-900/30",
    },
    {
      title: "متوسط طلبات/عميل",
      value: avgOrdersPerCustomer,
      icon: TrendingUp,
      color: "text-indigo-400 bg-indigo-900/30",
    },
    {
      title: "أعلى عميل إنفاقاً",
      value: topCustomer?.name || "—",
      icon: UserCheck,
      color: "text-purple-400 bg-purple-900/30",
      small: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className="bg-slate-900 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-sm flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-gray-400 block mb-1 truncate">
                {s.title}
              </span>
              <span
                className={`font-black text-white block truncate ${s.small ? "text-sm" : "text-xl md:text-2xl"}`}
              >
                {s.value}
              </span>
            </div>
            <div className={`p-3 rounded-xl flex-shrink-0 ${s.color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
