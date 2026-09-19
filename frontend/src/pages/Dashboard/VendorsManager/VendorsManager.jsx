import { useState } from "react";
import { Loader2, Search, Store, UserPlus } from "lucide-react";
import useVendorsManager from "./useVendorsManager";
import AddVendorModal from "./AddVendorModal";

export default function VendorsManager() {
  const {
    loading,
    customers: vendors,
    searchTerm,
    setSearchTerm,
    handleAddVendor,
    handleUpdateStatus,
  } = useVendorsManager();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Store className="h-7 w-7 text-blue-600" />
          <h1 className="text-2xl font-black text-white">إدارة التجار</h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="ابحث عن تاجر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 transition"
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition whitespace-nowrap"
          >
            <UserPlus className="h-4 w-4" />
            <span>إضافة تاجر</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="p-4 text-sm font-semibold text-slate-300">التاجر</th>
                <th className="p-4 text-sm font-semibold text-slate-300">البريد الإلكتروني</th>
                <th className="p-4 text-sm font-semibold text-slate-300">رقم الهاتف</th>
                <th className="p-4 text-sm font-semibold text-slate-300">الحالة</th>
                <th className="p-4 text-sm font-semibold text-slate-300">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    لا يوجد تجار حالياً.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition">
                    <td className="p-4">
                      <div className="font-bold text-white">{vendor.name}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-300">{vendor.email}</td>
                    <td className="p-4 text-sm text-slate-300" dir="ltr">{vendor.phone || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        vendor.status === 'active' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' : 
                        vendor.status === 'banned' ? 'bg-red-900/30 text-red-400 border border-red-800/50' : 
                        'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {vendor.status === 'active' ? 'نشط' : vendor.status === 'banned' ? 'محظور' : 'غير موثق'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        value={vendor.status}
                        onChange={(e) => handleUpdateStatus(vendor.id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 outline-none"
                      >
                        <option value="active">نشط</option>
                        <option value="banned">حظر</option>
                        <option value="unverified">غير موثق</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <AddVendorModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddVendor} 
        />
      )}
    </div>
  );
}
