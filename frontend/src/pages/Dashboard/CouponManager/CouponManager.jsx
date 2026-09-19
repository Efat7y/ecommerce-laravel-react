import { Loader2, Plus, Edit2, Trash2, Ticket, X, Check, XCircle, MessageCircle } from "lucide-react";
import useCouponManager from "./hooks/useCouponManager";

export default function CouponManager() {
  const {
    coupons,
    loading,
    isModalOpen, setIsModalOpen,
    editingCoupon,
    formData, setFormData,
    submitting,
    openAddModal,
    openEditModal,
    handleDelete,
    handleSubmit,
    handleToggleActive
  } = useCouponManager();

  return (
    <>
      <div className="flex justify-between items-center mb-6" dir="rtl">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Ticket className="text-blue-600" />
            إدارة الكوبونات والخصومات
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            إنشاء أكواد الخصم، تحديد الشروط، وإدارتها.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">إضافة كوبون جديد</span>
        </button>
      </div>

      <div className="bg-slate-900 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden" dir="rtl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-800/50 text-slate-300 text-sm border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">كود الخصم</th>
                <th className="px-6 py-4 font-semibold">قيمة الخصم</th>
                <th className="px-6 py-4 font-semibold">الحد الأدنى للطلب</th>
                <th className="px-6 py-4 font-semibold">الاستخدام</th>
                <th className="px-6 py-4 font-semibold">الظهور بالسلة</th>
                <th className="px-6 py-4 font-semibold">الحالة</th>
                <th className="px-6 py-4 font-semibold w-24">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    جاري تحميل الكوبونات...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    لا توجد كوبونات مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-800 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold bg-slate-950 text-emerald-400 px-3 py-1 rounded-md border border-emerald-900/50">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {coupon.type === 'percent' ? `${coupon.value}%` : `${parseFloat(coupon.value).toLocaleString()} ج.م`}
                      {coupon.type === 'percent' && coupon.max_discount && (
                        <span className="block text-xs text-slate-400">بحد أقصى {coupon.max_discount} ج.م</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {coupon.min_order_value > 0 ? `${parseFloat(coupon.min_order_value).toLocaleString()} ج.م` : 'بدون حد'}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {coupon.used_count} / {coupon.usage_limit || '∞'}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.is_public ? (
                        <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded-md">عام (يظهر للكل)</span>
                      ) : (
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md">سري (بإدخال الكود)</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`px-3 py-1 text-xs rounded-full font-semibold transition ${
                          coupon.is_active ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50' : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                        }`}
                      >
                        {coupon.is_active ? 'نشط' : 'معطل'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`مرحباً! لدينا عرض خاص لك من الفتح للمنظفات 🎁\n\nاستخدم كود الخصم: *${coupon.code}*\nلتحصل على خصم ${coupon.type === 'percent' ? coupon.value + '%' : coupon.value + ' جنيه'}${coupon.min_order_value > 0 ? ` عند الشراء بقيمة ${coupon.min_order_value} جنيه أو أكثر` : ''}!\n\nتسوق الآن واستفد من العرض ✨`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-emerald-400 hover:bg-emerald-900/30 rounded-lg transition-colors"
                          title="إرسال الكوبون عبر واتساب"
                        >
                          <MessageCircle size={16} />
                        </a>
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="تعديل الكوبون"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                          title="حذف الكوبون"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm" dir="rtl">
          <div className="bg-slate-900 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">
                {editingCoupon ? "تعديل الكوبون" : "إضافة كوبون جديد"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <form id="couponForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">كود الخصم (إنجليزي/أرقام)</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono"
                      placeholder="e.g. SUMMER24"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">نوع الخصم</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="percent">نسبة مئوية (%)</option>
                      <option value="fixed">مبلغ ثابت (ج.م)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      قيمة الخصم {formData.type === 'percent' ? '(%)' : '(ج.م)'}
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  {formData.type === 'percent' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">الحد الأقصى للخصم (اختياري)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.max_discount}
                        onChange={(e) => setFormData({...formData, max_discount: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-blue-500"
                        placeholder="بدون حد أقصى"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">الحد الأدنى لقيمة الفاتورة (الرينج)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.min_order_value}
                      onChange={(e) => setFormData({...formData, min_order_value: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">عدد مرات الاستخدام الكلية (اختياري)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-blue-500"
                      placeholder="غير محدود"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">تاريخ الانتهاء (اختياري)</label>
                    <input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">مخصص لفئة (تصنيف العميل)</label>
                    <select
                      value={formData.allowed_tier}
                      onChange={(e) => setFormData({...formData, allowed_tier: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">متاح للجميع</option>
                      <option value="standard">للعملاء العاديين فقط</option>
                      <option value="vip">لعملاء VIP فقط</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id="is_public"
                      checked={formData.is_public}
                      onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <label htmlFor="is_public" className="text-sm text-slate-300 font-medium">
                      عرض الكوبون للعملاء تلقائياً في صفحة السلة (إذا تخطت مشترياتهم الحد الأدنى)
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <label htmlFor="is_active" className="text-sm text-slate-300 font-medium">
                      الكوبون مفعل ويمكن استخدامه
                    </label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                form="couponForm"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-70 flex items-center gap-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
                <span>حفظ الكوبون</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
