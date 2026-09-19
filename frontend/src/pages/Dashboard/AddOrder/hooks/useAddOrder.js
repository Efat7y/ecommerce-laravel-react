import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../../Api/Api";
import { getToken } from "../../../../utils/auth";
import { toast } from "sonner";

export default function useAddOrder() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedUserId, setSelectedUserId] = useState("");
  const [cart, setCart] = useState([]);
  
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    Promise.all([
      axios.get(`${baseUrl}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${baseUrl}/products`)
    ]).then(([usersRes, productsRes]) => {
      setUsers(usersRes.data.users || []);
      setProducts(productsRes.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      toast.error("فشل في تحميل البيانات");
      setLoading(false);
    });
  }, [token]);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      toast.error("هذا المنتج غير متوفر في المخزون");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error("الكمية المطلوبة تتجاوز المخزون");
          return prev;
        }
        return prev.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product_id: product.id, quantity: 1, product }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product_id === id) {
          const newQ = item.quantity + delta;
          if (newQ > item.product.stock) {
            toast.error("الكمية المطلوبة تتجاوز المخزون");
            return item;
          }
          return { ...item, quantity: Math.max(1, newQ) };
        }
        return item;
      });
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.product_id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.quantity * parseFloat(item.product.price)), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserId) return toast.error("يرجى تحديد العميل");
    if (cart.length === 0) return toast.error("يرجى إضافة خامات للفاتورة");
    
    setSubmitting(true);
    axios.post(`${baseUrl}/admin/orders/create`, {
      user_id: selectedUserId,
      items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
      payment_method: paymentMethod,
      shipping_address: shippingAddress,
      phone: phone,
      notes: notes
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      toast.success("تم إنشاء الفاتورة بنجاح");
      navigate("/dashboard/customers");
    }).catch(err => {
      console.error(err);
      toast.error(err.response?.data?.message || "فشل إنشاء الفاتورة");
      setSubmitting(false);
    });
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase()));

  return {
    users,
    loading,
    selectedUserId, setSelectedUserId,
    cart,
    paymentMethod, setPaymentMethod,
    shippingAddress, setShippingAddress,
    phone, setPhone,
    notes, setNotes,
    searchProduct, setSearchProduct,
    submitting,
    filteredProducts,
    
    addToCart,
    updateQuantity,
    removeFromCart,
    calculateTotal,
    handleSubmit
  };
}
