import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../../context/CartContext";
import { useSettings } from "../../../../context/SettingsContext";
import { getUser, clearAuth } from "../../../../utils/auth";
import MessagesDropdown from "../../FloatingChat/MessagesDropdown";
import { ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Calculator,
  Home,
  Heart,
  Menu,
  X
} from "lucide-react";

export default function Header() {
  const { cartItems } = useCart();
  const { settings } = useSettings();
  const user = getUser();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const totalCartQuantity = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );
  
  // Format to remove long decimals (e.g. 6.000000005 -> 6, 6.25 -> 6.25)
  const displayQuantity = Number(totalCartQuantity.toFixed(2));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-slate-900/80">
      <div
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        dir="rtl"
      >
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2">
          {settings?.logo ? (
            <img
              src={`http://127.0.0.1:8000${settings.logo}`}
              alt="Logo"
              className="h-8 object-contain"
            />
          ) : (
            <ShoppingBag className="h-7 w-7 text-blue-600" />
          )}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-sm sm:text-xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:to-indigo-400 leading-tight">
            {settings?.site_name || "المتجر الشامل للمنظفات"}
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <div className="flex gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition dark:text-gray-300 dark:hover:text-blue-400">
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-5 w-5" />
              الرئيسية
            </Link>
          </div>
          <div className="flex gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition dark:text-gray-300 dark:hover:text-blue-400">
            <Link to="/products" className="flex items-center gap-1">
              <ShoppingBag className="h-5 w-5" />
              الخامات والمنتجات
            </Link>
          </div>
          <div className="flex gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition dark:text-gray-300 dark:hover:text-blue-400">
            <Link to="/profit-calculator" className="flex items-center gap-1">
              <Calculator className="h-5 w-5" />
              حاسبة الأرباح
            </Link>
          </div>
          <div className="flex gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition dark:text-gray-300 dark:hover:text-blue-400">
            <Link to="/contact">تواصل معنا</Link>
          </div>
        </nav>

        {/* Right Side Options */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            to="/wishlist"
            id="wishlist-icon-header"
            className="p-2 text-gray-700 hover:text-red-500 transition dark:text-gray-300 dark:hover:text-red-400"
            title="المفضلة"
          >
            <Heart className="h-6 w-6" />
          </Link>
          <MessagesDropdown />
            <Link id="cart-icon-header"
            to="/cart"
            className="relative p-2 text-gray-700 hover:text-blue-600 transition-all duration-300 dark:text-gray-300 dark:hover:text-blue-400"
          >
            <ShoppingCart className="h-6 w-6 transition-transform duration-200" />
            {displayQuantity > 0 && (
              <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-sm shadow-blue-500/30 animate-pulse">
                {displayQuantity}
              </span>
            )}
          </Link>

          {/* User Auth Section */}
          {user ? (
            <div className="hidden lg:flex items-center gap-3">
              {(user.role === "admin" || user.role === "vendor") && (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition dark:text-gray-300 dark:hover:text-blue-400"
              >
                {user.avatar ? (
                  <img
                    src={`http://127.0.0.1:8000${user.avatar}`}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60";
                    }}
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border border-gray-200">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-medium">
                  {user.name.split(" ")[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition dark:text-gray-400 dark:hover:text-red-400"
                title="تسجيل خروج"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition dark:text-gray-300 dark:hover:bg-slate-800"
              >
                دخول
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
              >
                إنشاء حساب
              </Link>
            </div>
          )}
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition dark:text-gray-300 dark:hover:text-blue-400"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 inset-x-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 shadow-lg px-4 py-6 flex flex-col gap-4">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            <Home className="h-5 w-5" /> الرئيسية
          </Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            <ShoppingBag className="h-5 w-5" /> الخامات والمنتجات
          </Link>
          <Link to="/profit-calculator" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            <Calculator className="h-5 w-5" /> حاسبة الأرباح
          </Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            تواصل معنا
          </Link>
          
          <div className="h-px bg-gray-200 dark:bg-gray-800 my-2"></div>
          
          {user ? (
            <>
              {(user.role === "admin" || user.role === "vendor") && (
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-medium text-blue-600">
                  <LayoutDashboard className="h-5 w-5" /> لوحة التحكم
                </Link>
              )}
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                <User className="h-5 w-5" /> حسابي ({user.name.split(" ")[0]})
              </Link>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-base font-medium text-red-600 hover:text-red-700 w-full text-right">
                <LogOut className="h-5 w-5" /> تسجيل خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                دخول
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-medium text-blue-600">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}