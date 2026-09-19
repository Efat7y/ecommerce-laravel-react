import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import OtpVerification from "./pages/Auth/OtpVerification";
import Dashboard from "./pages/Admin/Dashboard";
import LandingPage from "./pages/Website/LandingPage";
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

function App() {
  const location = useLocation();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
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
      <Route path="/dashboard" element={<ProtectedRoute adminOnly><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="orders" element={<OrdersManager />} />
        <Route path="orders/add" element={<AddOrder />} />
        <Route path="orders/edit/:id" element={<EditOrder />} />
        <Route path="customers" element={<CustomersManager />} />
        <Route path="coupons" element={<CouponManager />} />
        <Route path="messages" element={<MessagesManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>
    </Routes>
  );
}

export default App;
