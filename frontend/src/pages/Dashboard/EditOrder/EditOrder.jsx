import { Search, Plus, Minus, X, ArrowRight, UserCheck, Loader2, Save } from "lucide-react";
import { Link } from "react-router-dom";
import useEditOrder from "./hooks/useEditOrder";

export default function EditOrder() {
  const {
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
  } = useEditOrder();

  if (loading) {
    return (
      <>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">تعديل الفاتورة #{id}</h1>
            <p className="text-sm text-slate-400 mt-1">تعديل المنتجات، الكميات، أو بيانات العميل الخاصة بالفاتورة.</p>
          </div>
          <Link to="/dashboard/orders" className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800/50 transition font-bold text-sm">
            <ArrowRight className="w-4 h-4" />
            عودة للفواتير
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">الخامات المتاحة (المنتجات)</h2>
              
              <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن خامة أو منتج..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pr-10 pl-4 py-2 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 border border-slate-800 rounded-xl hover:border-blue-200 bg-slate-800/50/50 transition">
                    <div>
                      <div className="font-bold text-sm text-slate-300 truncate max-w-[150px]">{product.name}</div>
                      <div className="text-xs text-blue-600 font-semibold">{parseFloat(product.price).toLocaleString()} ج.م</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h2 className="text-lg font-bold text-white mb-4">المنتجات المطلوبة ({cart.length})</h2>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                  لا يوجد أي خامات في هذه الفاتورة حالياً
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                      <div className="flex-1">
                        <div className="font-bold text-sm text-white">{item.product.name}</div>
                        <div className="text-xs text-slate-400">{parseFloat(item.product.price).toLocaleString()} ج.م / للوحدة</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
                          <button type="button" onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-gray-100 rounded">
                            <Plus className="w-3 h-3 text-slate-400" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-gray-100 rounded">
                            <Minus className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                        <div className="font-black text-blue-700 w-20 text-left">
                          {(item.quantity * parseFloat(item.product.price)).toLocaleString()} ج
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.product.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                بيانات العميل والدفع
              </h2>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">العميل <span className="text-red-500">*</span></label>
                <select
                  required
                  value={selectedUserId}
                  onChange={e => {
                    setSelectedUserId(e.target.value);
                    const usr = users.find(u => u.id == e.target.value);
                    if (usr) {
                      setPhone(usr.phone || "");
                      setShippingAddress(usr.address || "");
                    }
                  }}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
                >
                  <option value="">-- اختر العميل --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">طريقة الدفع</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
                >
                  <option value="credit">آجل (تسجل مديونية على حساب العميل)</option>
                  <option value="cash">كاش (دفع نقدي)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">رقم الهاتف</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">العنوان / مكان التسليم</label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">ملاحظات (اختياري)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-400">إجمالي الفاتورة:</span>
                  <span className="text-xl font-black text-blue-700">{calculateTotal().toLocaleString()} ج.م</span>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  حفظ التعديلات
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </>
  );
}
