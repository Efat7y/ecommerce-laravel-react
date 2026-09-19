import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../Api/Api";
import { getToken } from "../../../../utils/auth";
import { toast } from "sonner";

export default function useOrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [viewOrderId, setViewOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = getToken();

  const fetchOrders = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setUpdatingId(id);
    axios
      .put(
        `${baseUrl}/admin/orders/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
        setUpdatingId(null);
        toast.success("تم تحديث حالة الطلب");
      })
      .catch((err) => {
        console.error(err);
        setUpdatingId(null);
        toast.error("حدث خطأ أثناء تعديل حالة الطلب.");
      });
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toString().includes(searchTerm) ||
      o.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm)
  );

  return {
    orders,
    loading,
    updatingId,
    viewOrderId, setViewOrderId,
    searchTerm, setSearchTerm,
    filteredOrders,
    handleStatusChange,
  };
}
