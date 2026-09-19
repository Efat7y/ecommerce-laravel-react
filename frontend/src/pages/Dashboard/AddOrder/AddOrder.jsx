import { Link } from "react-router-dom";
import { Loader2, Plus, Minus, Search, ArrowRight, UserCheck, ShoppingBag, X } from "lucide-react";
import useAddOrder from "./hooks/useAddOrder";

export default function AddOrder() {
  const {
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
  } = useAddOrder();

  if (loading) {
    return (
      <>
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <div dir="rtl" className="max-w-6xl mx-auto pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard/orders" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>
          <h1 className="text-2xl font-black text-white">إنشاء فاتورة جديدة</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content (Products & Cart) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Products Search & List */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                اختر الخامات (المنتجات)
              </h2>
              <div className="relative mb-4">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن منتج للإضافة..."
                  value={searchProduct}
                  onChange={e => setSearchProduct(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:border-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
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

            {/* Selected Items */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h2 className="text-lg font-bold text-white mb-4">الخامات المحددة ({cart.length})</h2>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                  لم يتم إضافة أي خامات للفاتورة بعد
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.product_id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                      <div className="flex-1">
                        <div className="font-bold text-sm text-white">{item.product.name}</div>
                        <div className="text-xs text-slate-400">{parseFloat(item.product.price).toLocaleString()} ج.م / للوحدة</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
                          <button type="button" onClick={() => updateQuantity(item.product_id, 1)} className="p-1 hover:bg-gray-100 rounded">
                            <Plus className="w-3 h-3 text-slate-400" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.product_id, -1)} className="p-1 hover:bg-gray-100 rounded">
                            <Minus className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                        <div className="font-black text-blue-700 w-20 text-left">
                          {(item.quantity * parseFloat(item.product.price)).toLocaleString()} ج
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.product_id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Customer & Payment Details) */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                بيانات الفاتورة
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
                  <option value="credit">آجل (تسجل كمديونية على العميل)</option>
                  <option value="cash">كاش (تم دفعها نقداً)</option>
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
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  حفظ وتسجيل الفاتورة
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </>
  );
}
