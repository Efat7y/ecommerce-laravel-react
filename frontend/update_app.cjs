const fs = require('fs');

let c = `import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Admin/Dashboard";
import LandingPage from "./pages/Website/LandingPage";
import ProductCatalog from "./pages/Website/ProductCatalog";
import ProductDetail from "./pages/Website/ProductDetail";
import CartPage from "./pages/Website/CartPage";
import ProfilePage from "./pages/Website/ProfilePage";
import OrderDetailPage from "./pages/Website/OrderDetailPage";
import CustomerEditOrder from "./pages/Website/CustomerEditOrder";
import ProductManager from "./pages/Dashboard/ProductManager";
import OrdersManager from "./pages/Dashboard/OrdersManager";
import AddOrder from "./pages/Dashboard/AddOrder";
import EditOrder from "./pages/Dashboard/EditOrder";
import CustomersManager from "./pages/Dashboard/CustomersManager";
import CategoryManager from "./pages/Dashboard/CategoryManager";
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

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected User Pages */}
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
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
      </Route>
    </Routes>
  );
}

export default App;
`;

fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log("App.jsx rewritten");
