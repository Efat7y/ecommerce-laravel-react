import re

with open('frontend/src/components/Dashboard/CustomerLedgerModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

tables_ui = """
              {/* Detailed Ledger Tables */}
              <div className="mt-8 space-y-6">
                
                {/* Payments History */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-white">سجل الدفعات المسددة</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">التاريخ والوقت</th>
                          <th className="px-4 py-3 font-semibold">المبلغ المسدد</th>
                          <th className="px-4 py-3 font-semibold">طريقة الدفع</th>
                          <th className="px-4 py-3 font-semibold">الملاحظات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {customerData?.payments?.length > 0 ? (
                          customerData.payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {new Date(payment.created_at).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                              </td>
                              <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                                {parseFloat(payment.amount).toLocaleString()} ج.م
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {payment.payment_method === 'cash' ? 'كاش' : payment.payment_method === 'transfer' ? 'تحويل بنكي' : 'شيك'}
                              </td>
                              <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate" title={payment.notes}>
                                {payment.notes || '-'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                              لا توجد دفعات مسجلة حتى الآن.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Orders History (Invoices) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-white">سجل الفواتير (الطلبيات)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">رقم الطلب</th>
                          <th className="px-4 py-3 font-semibold">التاريخ</th>
                          <th className="px-4 py-3 font-semibold">الإجمالي</th>
                          <th className="px-4 py-3 font-semibold">نوع السداد</th>
                          <th className="px-4 py-3 font-semibold">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {customerData?.orders?.length > 0 ? (
                          customerData.orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">
                                #{order.id}
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {new Date(order.created_at).toLocaleDateString('ar-EG')}
                              </td>
                              <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                                {parseFloat(order.total).toLocaleString()} ج.م
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${order.payment_method === 'credit' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {order.payment_method === 'credit' ? 'آجل (مديونية)' : 'كاش'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                  order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {order.status === 'completed' ? 'مكتمل' : 
                                   order.status === 'cancelled' ? 'ملغي' : 
                                   order.status === 'processing' ? 'قيد التجهيز' : 'قيد الانتظار'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                              لا توجد طلبات مسجلة حتى الآن.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
"""

# Find `</form>\n              </div>` and inject tables_ui right after it
pattern = r'(</form>\s*</div>)'
content = re.sub(pattern, r'\1\n' + tables_ui, content, count=1)

with open('frontend/src/components/Dashboard/CustomerLedgerModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected Tables!")
