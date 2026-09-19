import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../../Api/Api";
import { getToken } from "../../../../utils/auth";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

export default function useEditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getToken();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [selectedUserId, setSelectedUserId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [cart, setCart] = useState([]); 

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, prodsRes, orderRes] = await Promise.all([
          axios.get(`${baseUrl}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${baseUrl}/products`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${baseUrl}/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setUsers(usersRes.data.users || usersRes.data);
        setProducts(prodsRes.data.data || prodsRes.data);

        const order = orderRes.data;
        setSelectedUserId(order.user_id?.toString() || "");
        setPaymentMethod(order.payment_method || "credit");
        setShippingAddress(order.shipping_address || "");
        setPhone(order.phone || "");
        setNotes(order.notes || "");

        if (order.items && Array.isArray(order.items)) {
          const loadedCart = order.items.map(item => ({
            product: item.product || { id: item.product_id, name: "منتج محذوف", price: item.price, stock: 100 },
            quantity: item.quantity
          }));
          setCart(loadedCart);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("حدث خطأ أثناء جلب تفاصيل الفاتورة");
        navigate("/dashboard/orders");
      }
    };
    fetchData();
  }, [id, token, navigate]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error("الكمية المطلوبة تتجاوز المخزون المتاح!");
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQ = item.quantity + delta;
        if (newQ > item.product.stock && delta > 0) {
          toast.error("الكمية المطلوبة تتجاوز المخزون!");
          return item;
        }
        if (newQ < 1) return item; 
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("الفاتورة فارغة، يرجى إضافة منتجات.");
      return;
    }
    if (!selectedUserId) {
      toast.error("يجب اختيار عميل.");
      return;
    }

    const payload = {
      user_id: selectedUserId,
      payment_method: paymentMethod,
      shipping_address: shippingAddress,
      phone: phone,
      notes: notes,
      items: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))
    };

    setSubmitting(true);
    try {
      await axios.put(`${baseUrl}/admin/orders/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("تم تعديل الفاتورة بنجاح!");
      navigate("/dashboard/orders");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ الفاتورة");
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return {
    id,
    loading,
    submitting,
    users,
    selectedUserId, setSelectedUserId,
    paymentMethod, setPaymentMethod,
    shippingAddress, setShippingAddress,
    phone, setPhone,
    notes, setNotes,
    cart,
    searchQuery, setSearchQuery,
    filteredProducts,
    
    addToCart,
    updateQuantity,
    removeFromCart,
    calculateTotal,
    handleSubmit
  };
}
