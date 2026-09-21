import re

with open('frontend/src/components/Dashboard/CustomerLedgerModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Printer icon to imports
if 'Printer' not in content:
    content = content.replace('FileText,', 'FileText, Printer,')

# Add handlePrint function
handle_print = """
  const handlePrint = () => {
    // Basic print trick: hide other elements via CSS, or just rely on standard print window
    window.print();
  };
"""
content = content.replace('const handleRecordPayment', handle_print + '\n  const handleRecordPayment')

# Add Print Button in header
print_btn = """
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition print:hidden"
            >
              <Printer className="w-4 h-4" />
              طباعة كشف الحساب
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 bg-gray-50 rounded-full hover:bg-gray-100 hover:text-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
"""
content = re.sub(
    r'<button\s*onClick=\{onClose\}\s*className="p-2 text-gray-400.*?<X className="w-5 h-5" />\s*</button>',
    print_btn,
    content,
    flags=re.DOTALL
)

# Add Table for Payments and Orders History
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

# We need access to `customerData` which is essentially `user` from the API response.
# Currently `fetchLedger` does:
# `setLedger(res.data.ledger);`
# `setCustomerData(res.data.user);` -> wait, does it? Let's check state.
if 'setCustomerData' not in content:
    content = content.replace('const [ledger, setLedger] = useState(null);', 'const [ledger, setLedger] = useState(null);\n  const [customerData, setCustomerData] = useState(null);')
    content = content.replace('setLedger(res.data.ledger);', 'setLedger(res.data.ledger);\n        setCustomerData(res.data.user);')

# Add the tables UI before the end of the `ledger ?` true block.
# We will inject it right after the `</form></div>` which is the `Record Payment Form`.
content = re.sub(r'(OO3OUSU, O U,O_U?O1Oc\s*</button>\s*</div>\s*</form>\s*</div>)', r'\1' + '\n' + tables_ui, content)

# Also fix the styling for Printing by adding a CSS block or rely on Tailwind print: classes.
# The print_btn has `print:hidden`
# Record Payment form should also have `print:hidden`
content = content.replace('className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl', 'className="print:hidden bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl')

with open('frontend/src/components/Dashboard/CustomerLedgerModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated CustomerLedgerModal.jsx with tables and print functionality")
