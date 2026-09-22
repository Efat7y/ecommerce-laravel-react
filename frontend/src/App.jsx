import { useSettings } from "./context/SettingsContext";
import { ShoppingBag } from "lucide-react";
import FlashSaleManager from './pages/Dashboard/FlashSaleManager/FlashSaleManager';
import FormulaManager from './pages/Dashboard/FormulaManager/FormulaManager';
import SmartCalculatorManager from './pages/Dashboard/SmartCalculatorManager/SmartCalculatorManager';
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import OtpVerification from "./pages/Auth/OtpVerification";
import Dashboard from "./pages/Admin/Dashboard";
import LandingPage from "./pages/Website/LandingPage";
import ProfitCalculator from "./pages/Website/ProfitCalculator/ProfitCalculator";
import ProductCatalog from "./pages/Website/ProductCatalog/ProductCatalog";
import ProductDetail from "./pages/Website/ProductDetail/ProductDetail";
import CartPage from "./pages/Website/CartPage/CartPage";
import ContactUs from "./pages/Website/ContactUs/ContactUs";
import WishlistPage from "./pages/Website/Wishlist/WishlistPage";
import ProfilePage from "./pages/Website/ProfilePage/ProfilePage";
import OrderDetailPage from "./pages/Website/OrderDetailPage/OrderDetailPage";
import InvoicePage from "./pages/Website/InvoicePage/InvoicePage";
import CustomerEditOrder from "./pages/Website/CustomerEditOrder/CustomerEditOrder";
import ProductManager from "./pages/Dashboard/ProductManager/ProductManager";
import OrdersManager from "./pages/Dashboard/OrdersManager/OrdersManager";
import AddOrder from "./pages/Dashboard/AddOrder/AddOrder";
import EditOrder from "./pages/Dashboard/EditOrder/EditOrder";
import CustomersManager from "./pages/Dashboard/CustomersManager/CustomersManager";
import CategoryManager from "./pages/Dashboard/CategoryManager/CategoryManager";
import CouponManager from "./pages/Dashboard/CouponManager/CouponManager";
import MessagesManager from "./pages/Dashboard/MessagesManager/MessagesManager";
import SettingsManager from "./pages/Dashboard/SettingsManager/SettingsManager";
import VendorsManager from "./pages/Dashboard/VendorsManager/VendorsManager";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import FloatingChat from "./components/Website/FloatingChat/FloatingChat";
import PrintableLedger from "./pages/Printables/PrintableLedger";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const location = useLocation();
  const { loading, settings } = useSettings();

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden" dir="rtl">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }}></div>
        
        {/* Core Loader */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-32 h-32 flex items-center justify-center mb-8">
            {/* Spinning Rings */}
            <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-4 border-indigo-500 animate-[spin_1.5s_reverse_infinite]"></div>
            <div className="absolute inset-4 rounded-full border-b-4 border-cyan-400 animate-[spin_2s_linear_infinite]"></div>
            
            {/* Logo or Icon */}
            {settings?.logo ? (
              <img src={`http://127.0.0.1:8000${settings.logo}`} className="w-12 h-12 object-contain absolute animate-pulse" alt="Logo" />
            ) : (
              <ShoppingBag className="w-10 h-10 text-blue-600 absolute animate-pulse" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
            {settings?.site_name || "EAF لخامات المنظفات"}
          </h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm tracking-widest animate-pulse">
            جاري تهيئة المتجر...
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <>
      {settings?.feature_chat === "true" && <FloatingChat />}
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/profit-calculator" element={<ProfitCalculator />} />
      <Route path="/products" element={<ProductCatalog />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/wishlist" element={<WishlistPage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OtpVerification />} />

      {/* Protected User Pages */}
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
      <Route path="/invoice/:id" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />
      <Route path="/orders/edit/:id" element={<ProtectedRoute><CustomerEditOrder /></ProtectedRoute>} />

      {/* Protected Admin Pages */}
      <Route path="/print/ledger/:id" element={<ProtectedRoute adminOnly><PrintableLedger /></ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute adminOnly><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="orders" element={<OrdersManager />} />
        <Route path="orders/add" element={<AddOrder />} />
        <Route path="orders/edit/:id" element={<EditOrder />} />

        <Route path="customers" element={<CustomersManager />} />
        <Route path="flash-sales" element={<FlashSaleManager />} />
        <Route path="formulas" element={<FormulaManager />} />
          <Route path="smart-calculator" element={<SmartCalculatorManager />} />
        <Route path="coupons" element={<CouponManager />} />
        <Route path="messages" element={<MessagesManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>
      {/* 404 Not Found */}
      <Route path="*" element={<ErrorPage type="404" />} />
    </Routes>
  
    </>
  );
}

export default App;




