import { Link } from "react-router-dom";
import { Search, Plus, Minus, X, ArrowRight, UserCheck, Loader2, Save } from "lucide-react";
import Header from "@/components/Website/layout/Header/Header";
import Footer from "@/components/Website/layout/Footer/Footer";
import { Helmet } from "react-helmet-async";
import useCustomerEditOrder from "./hooks/useCustomerEditOrder";

export default function CustomerEditOrder() {
  const {
    id,
    loading,
    submitting,
    cart,
    paymentMethod, setPaymentMethod,
    shippingAddress, setShippingAddress,
    phone, setPhone,
    notes, setNotes,
    searchQuery, setSearchQuery,
    filteredProducts,
    addToCart,
    updateQuantity,
    removeFromCart,
    calculateTotal,
    handleSubmit
  } = useCustomerEditOrder();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-cairo selection:bg-blue-200" dir="rtl">
        <Helmet><title>تعديل الفاتورة</title></Helmet>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-cairo selection:bg-blue-200" dir="rtl">
      <Helmet><title>تعديل الفاتورة #{id}</title></Helmet>
      <Header />
      <main className="flex-1">
        <div className="p-6 max-w-7xl mx-auto space-y-6 md:py-12">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">تعديل الفاتورة #{id}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">يمكنك إضافة أو إزالة منتجات لأن الفاتورة لا تزال قيد المراجعة.</p>
            </div>
            <Link to="/profile" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition font-bold text-sm">
              <ArrowRight className="w-4 h-4" />
              العودة لطلباتي
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200/80 dark:border-gray-800 p-6 md:p-8 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">الخامات المتاحة (المنتجات)</h2>
                
                <div className="relative">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن خامة أو منتج..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl pr-10 pl-4 py-2 text-sm focus:border-blue-500 outline-none dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-blue-200 dark:hover:border-blue-800 bg-gray-50/50 dark:bg-slate-800/50 transition">
                      <div>
                        <div className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{product.name}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{parseFloat(product.price).toLocaleString()} ج.م</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="p-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200/80 dark:border-gray-800 p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">المنتجات المطلوبة ({cart.length})</h2>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                    لا يوجد أي خامات في هذه الفاتورة حالياً
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex-1">
                          <div className="font-bold text-sm text-gray-900 dark:text-gray-100">{item.product.name}</div>
                          <div className="text-xs text-gray-500">{parseFloat(item.product.price).toLocaleString()} ج.م / للوحدة</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                            <button type="button" onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded">
                              <Plus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                            </button>
                            <span className="text-sm font-bold w-6 text-center dark:text-white">{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded">
                              <Minus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                            </button>
                          </div>
                          <div className="font-black text-blue-700 dark:text-blue-400 w-20 text-left">
                            {(item.quantity * parseFloat(item.product.price)).toLocaleString()} ج
                          </div>
                          <button type="button" onClick={() => removeFromCart(item.product.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">
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
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200/80 dark:border-gray-800 p-6 md:p-8 space-y-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  بيانات الدفع والتوصيل
                </h2>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">طريقة الدفع</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm focus:border-blue-500 outline-none dark:text-white"
                  >
                    <option value="credit">آجل (يضاف لحسابي)</option>
                    <option value="cash">كاش (دفع نقدي)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">رقم الهاتف</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm focus:border-blue-500 outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">العنوان / مكان التسليم</label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm focus:border-blue-500 outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">ملاحظات (اختياري)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm focus:border-blue-500 outline-none dark:text-white"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-600 dark:text-gray-400">إجمالي الفاتورة:</span>
                    <span className="text-xl font-black text-blue-700 dark:text-blue-400">{calculateTotal().toLocaleString()} ج.م</span>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-blue-500/20"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    حفظ التعديلات
                  </button>
                </div>

              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
