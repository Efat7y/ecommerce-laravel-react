import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Home,
  Users,
  X,
  Menu,
  FolderTree,
  Settings,
  Ticket,
  Mail,
  Timer,
  Store,
  Beaker,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUser } from "../../../../utils/auth";
import { useSettings } from "../../../../context/SettingsContext";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const user = getUser();
  const { settings } = useSettings();

  const allMenuItems = [
        { name: "الرئيسية للموقع", path: "/", icon: Home },
    { name: "إحصائيات النظام", path: "/dashboard", icon: LayoutDashboard },
    { name: "إدارة الخامات والمنتجات", path: "/dashboard/products", icon: ShoppingBag },
    { name: "إدارة الأقسام", path: "/dashboard/categories", icon: FolderTree },
    {
      name: "الطلبات والفواتير",
      path: "/dashboard/orders",
      icon: ClipboardList,
    },
    { name: "إدارة العملاء", path: "/dashboard/customers", icon: Users },
    {
      name: "عروض فلاش سيل",
      path: "/dashboard/flash-sales",
      icon: Timer,
      adminOnly: true,
    },
        {
      name: "إدارة التركيبات القديمة",
      path: "/dashboard/formulas",
      icon: Store,
      adminOnly: true,
    },
    {
      name: "أسعار خامات الحاسبة",
      path: "/dashboard/smart-calculator",
      icon: Beaker,
      adminOnly: true,
    },
    { name: "الكوبونات والخصومات", path: "/dashboard/coupons", icon: Ticket },
    { name: "صندوق الرسائل", path: "/dashboard/messages", icon: Mail },
    {
      name: "إعدادات الموقع",
      path: "/dashboard/settings",
      icon: Settings,
      adminOnly: true,
    },
  ];

  
    const menuItems = allMenuItems.filter((item) => {
    // Check if feature is locked
    if (item.path === '/dashboard/flash-sales' && settings?.feature_flash_sales !== 'true') return false;
        if (item.path === '/dashboard/formulas' && settings?.feature_formulas !== 'true') return false;
    if (item.path === '/dashboard/smart-calculator' && settings?.feature_formulas !== 'true') return false;
    if (item.path === '/dashboard/messages' && settings?.feature_chat !== 'true') return false;

    if (user?.role === "vendor") {
      return (
        !item.adminOnly &&
        ["/dashboard/products", "/dashboard/orders", "/"].includes(item.path)
      );
    }
    return true;
  });


  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed top-0 right-0 z-50 h-full w-64 bg-slate-900 text-slate-300 flex flex-col border-l border-slate-800
          lg:static lg:translate-x-0 lg:z-auto lg:h-screen lg:!transform-none
        `}
        dir="rtl"
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 flex-shrink-0">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-black text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
          >
            الفتح - لوحة المسؤول
          </motion.h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition relative overflow-hidden group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-600 rounded-xl"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <p className="text-xs text-slate-600 text-center">
            © 2025 الفتح للمنظفات
          </p>
        </div>
      </motion.aside>
    </>
  );
}
