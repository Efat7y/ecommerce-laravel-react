import { useState } from "react";
import { Loader2, Search, Users, DollarSign, ChevronDown, ChevronUp, UserPlus } from "lucide-react";
import CustomerLedgerModal from "@/components/Dashboard/CustomerLedgerModal";
import AdminOrderModal from "@/components/Dashboard/AdminOrderModal/AdminOrderModal";
import CustomerStats from "./components/CustomerStats";
import CustomerTable from "./components/CustomerTable";
import CustomerDetailModal from "./components/CustomerDetailModal";
import AddCustomerModal from "./components/AddCustomerModal";
import useCustomersManager from "./hooks/useCustomersManager";

const statusColor = {
  completed: "bg-emerald-900/30 text-emerald-400 border-emerald-200",
  cancelled: "bg-red-900/30 text-red-400 border-red-200",
  shipped: "bg-indigo-900/30 text-indigo-400 border-indigo-200",
  processing: "bg-blue-900/30 text-blue-400 border-blue-200",
  pending: "bg-amber-900/30 text-amber-400 border-amber-200",
};

const statusLabel = {
  pending: "قيد المراجعة",
  processing: "جاري التجهيز",
  shipped: "تم الشحن",
  completed: "تم التسليم",
  cancelled: "ملغي",
};

export default function CustomersManager() {
  const {
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
    handleAddCustomer,
    selectedCustomer,
    setSelectedCustomer,
    ledgerCustomer,
    setLedgerCustomer,
    viewOrderId,
    setViewOrderId,
  } = useCustomersManager();

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const SortIcon = ({ col }) =>
    sortBy === col ? (
      sortDir === "asc" ? (
        <ChevronUp className="h-3.5 w-3.5 inline ml-1" />
      ) : (
        <ChevronDown className="h-3.5 w-3.5 inline ml-1" />
      )
    ) : null;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-blue-500" />
            إدارة العملاء
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            تابع تفاصيل عملائك، تصنيفاتهم، وحالات الحساب
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowAddCustomerModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 font-medium"
          >
            <UserPlus size={18} />
            إضافة عميل
          </button>
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="ابحث بالاسم، البريد، أو الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pr-10 pl-4 text-sm outline-none focus:border-blue-500 transition"
              dir="rtl"
            />
            <Search className="absolute top-3 right-3 h-4 w-4 text-gray-400" />
          </div>
          
          <button
            onClick={() => setFilterDebts(!filterDebts)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm whitespace-nowrap transition-all ${
              filterDebts 
                ? 'bg-red-900/30 text-red-400 border-red-200' 
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            العملاء المديونين فقط
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-6" dir="rtl">
          <CustomerStats customers={customers} />
          
          <CustomerTable 
            customers={customers} 
            handleSort={handleSort}
            SortIcon={SortIcon}
            setSelectedCustomer={setSelectedCustomer}
            setLedgerCustomer={setLedgerCustomer}
            handleUpdateTier={handleUpdateTier}
            handleUpdateStatus={handleUpdateStatus}
          />
        </div>
      )}

      <CustomerDetailModal 
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        setViewOrderId={setViewOrderId}
        statusColor={statusColor}
        statusLabel={statusLabel}
      />

      {/* Ledger Modal */}
      {ledgerCustomer && (
        <CustomerLedgerModal
          customer={ledgerCustomer}
          onClose={() => setLedgerCustomer(null)}
        />
      )}

      {/* Admin Order Modal */}
      {viewOrderId && (
        <AdminOrderModal
          orderId={viewOrderId}
          onClose={() => setViewOrderId(null)}
        />
      )}

      {/* Add Customer Modal */}
      <AddCustomerModal 
        isOpen={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onAdd={handleAddCustomer}
      />
    </div>
  );
}
