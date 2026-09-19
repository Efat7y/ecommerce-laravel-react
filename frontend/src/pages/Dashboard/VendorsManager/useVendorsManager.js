import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../Api/Api";
import { getToken } from "../../../utils/auth";

export default function useVendorsManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDebts, setFilterDebts] = useState(false);
  const [sortBy, setSortBy] = useState("orders");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [ledgerCustomer, setLedgerCustomer] = useState(null);
  const [viewOrderId, setViewOrderId] = useState(null);
  const token = getToken();

  const fetchVendors = () => {
    axios
      .get(`${baseUrl}/admin/users?role=vendor`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data.users);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVendors();
  }, [token]);

  // Map users to customers format
  let customers = users.map((u) => {
    let uOrders = u.orders || [];
    let uPayments = u.payments || [];
    
    let totalSpent = uOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    let creditOrdersTotal = uOrders
      .filter((o) => o.payment_method === "credit")
      .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
      
    let paymentsTotal = uPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    let outstandingBalance = creditOrdersTotal - paymentsTotal;

    return {
      id: u.id,
      name: u.name || "مجهول",
      email: u.email,
      tier: u.tier || "standard",
      status: u.status || "unverified",
      phone: u.phone || (uOrders.length > 0 ? uOrders[uOrders.length - 1].phone : "لا يوجد"),
      orders: uOrders,
      totalSpent: totalSpent,
      firstOrder: uOrders.length > 0 ? uOrders[0].created_at : u.created_at,
      lastOrder: uOrders.length > 0 ? uOrders[uOrders.length - 1].created_at : u.created_at,
      outstandingBalance: outstandingBalance,
    };
  });

  // Search
  if (searchTerm) {
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.phone && c.phone.includes(searchTerm))
    );
  }

  if (filterDebts) {
    customers = customers.filter((c) => c.outstandingBalance > 0);
  }

  // Sort
  customers.sort((a, b) => {
    let valA, valB;
    if (sortBy === "orders") {
      valA = a.orders.length;
      valB = b.orders.length;
    } else if (sortBy === "total") {
      valA = a.totalSpent;
      valB = b.totalSpent;
    } else if (sortBy === "debt") {
      valA = a.outstandingBalance;
      valB = b.outstandingBalance;
    } else {
      valA = a.name;
      valB = b.name;
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const handleUpdateTier = (id, newTier) => {
    axios.put(`${baseUrl}/admin/users/${id}/tier`, { tier: newTier }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      fetchVendors();
    })
    .catch(err => {
      console.error(err);
    });
  };

  const handleUpdateStatus = (id, newStatus) => {
    axios.put(`${baseUrl}/admin/users/${id}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      fetchVendors();
    })
    .catch(err => {
      console.error(err);
    });
  };

  const handleAddVendor = async (formData) => {
    try {
      await axios.post(`${baseUrl}/admin/users`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchVendors();
      return true;
    } catch (err) {
      throw err;
    }
  };

  return {
    loading,
    customers,
    searchTerm,
    setSearchTerm,
    filterDebts,
    setFilterDebts,
    sortBy,
    sortDir,
    handleSort,
    handleUpdateTier,
    handleUpdateStatus,
    handleAddVendor,
    
    // UI state
    selectedCustomer, setSelectedCustomer,
    ledgerCustomer, setLedgerCustomer,
    viewOrderId, setViewOrderId
  };
}


