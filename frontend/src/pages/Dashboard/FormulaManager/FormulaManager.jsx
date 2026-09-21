import React, { useState } from "react";
import { useFormulaManager } from "./useFormulaManager";
import { Plus, Trash, Edit, Check, List, Beaker } from "lucide-react";
import Swal from "sweetalert2";
import { baseUrl } from "../../../Api/Api";

export default function FormulaManager() {
  const {
    formulas,
    products,
    isLoading,
    createFormula,
    updateFormula,
    deleteFormula,
    syncProducts,
  } = useFormulaManager();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [batchSize, setBatchSize] = useState(220);

  const [editingFormulaId, setEditingFormulaId] = useState(null);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [formulaProducts, setFormulaProducts] = useState([]);

  const handleEditFormula = (formula) => {
    setEditingFormulaId(formula.id);
    setTitle(formula.title || "");
    setDescription(formula.description || "");
    setIsActive(formula.is_active ?? true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingFormulaId(null);
    setTitle("");
    setDescription("");
    setIsActive(true);
    setBatchSize(220);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title) return Swal.fire("خطأ", "يجب إدخال اسم التركيبة", "error");

    const payload = {
      title,
      description,
      is_active: isActive,
      batch_size: parseInt(batchSize),
    };

    if (editingFormulaId) {
      updateFormula(editingFormulaId, payload);
      handleCancelEdit();
    } else {
      createFormula(payload);
      setTitle("");
      setDescription("");
    }
  };

  const handleManageProducts = (formula) => {
    if (!formula) return;
    setSelectedFormula(formula);
    setFormulaProducts(
      (formula.products || []).map((p) => ({
        product_id: p.id,
        quantity: p.pivot?.quantity || 1,
        unit: p.pivot?.unit || "kg",
        price_per_unit: p.pivot?.price_per_unit ?? 0,
      }))
    );
  };

  const addProductToFormula = (productId) => {
    if (formulaProducts.find((p) => p.product_id === productId)) return;
    setFormulaProducts([
      ...formulaProducts,
      { product_id: productId, quantity: 1, unit: "kg", price_per_unit: 0 },
    ]);
  };

  const updateFormulaProduct = (productId, key, value) => {
    setFormulaProducts(
      formulaProducts.map((p) =>
        p.product_id === productId ? { ...p, [key]: value } : p
      )
    );
  };

  const removeProductFromFormula = (productId) => {
    setFormulaProducts(formulaProducts.filter((p) => p.product_id !== productId));
  };

  const handleSaveProducts = () => {
    if (selectedFormula) {
      syncProducts(selectedFormula.id, formulaProducts);
      setSelectedFormula(null);
    }
  };

  if (isLoading) return <div className="p-4 text-center">جاري التحميل...</div>;

  const validFormulas = Array.isArray(formulas) ? formulas : [];
  const validProducts = Array.isArray(products) ? products : [];

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Beaker className="w-8 h-8 text-blue-600" />
        إدارة التركيبات
      </h1>

      {/* Create / Edit Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {editingFormulaId ? "تعديل التركيبة" : "إضافة تركيبة جديدة"}
        </h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                اسم التركيبة
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="مثال: تركيبة صابون سايل شعبي 100 لتر"
                required
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  تركيبة مفعلة (مرئية للعملاء)
                </span>
              </label>
            </div>
          </div>
          
          <div className="w-full">
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
              وصف سريع للتركيبة (يظهر للعميل)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-20"
              placeholder="وصف مكونات أو فوائد هذه التركيبة..."
            />
          </div>

          
            <div className="w-full mt-4 mb-4">
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                حجم التشغيلة (Batch Size)
              </label>
              <select
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="1000">تانك 1000 كيلو</option>
                <option value="220">برميل 220 كيلو</option>
                <option value="170">برميل 170 كيلو</option>
              </select>
            </div>
<div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" /> {editingFormulaId ? "حفظ التعديلات" : "إضافة التركيبة"}
            </button>
            {editingFormulaId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Formulas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validFormulas.map((formula) => (
          <div
            key={formula.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {formula.title}
                </h3>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    formula.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {formula.is_active ? "نشط" : "غير نشط"}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
              {formula.description || "لا يوجد وصف."}
            </p>

            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
              <div className="flex flex-col"><span className="text-sm font-medium text-gray-500">{(formula.products || []).length} خامات</span><span className="text-xs text-blue-600 mt-1 font-semibold bg-blue-50 px-2 py-0.5 rounded-md inline-block w-max">تشغيلة: {formula.batch_size || 220} كيلو</span></div>

          <div className="flex gap-2">
                <button
                  title="تعديل التركيبة"
                  onClick={() => handleEditFormula(formula)}
                  className="text-orange-600 bg-orange-50 p-2 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  title="إدارة خامات التركيبة"
                  onClick={() => handleManageProducts(formula)}
                  className="text-blue-600 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  title="حذف"
                  onClick={() => {
                    Swal.fire({
                      title: 'تأكيد الحذف؟',
                      text: "لا يمكن التراجع عن هذا الإجراء!",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#3085d6',
                      confirmButtonText: 'نعم، احذف!'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        deleteFormula(formula.id);
                      }
                    })
                  }}
                  className="text-red-600 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Manager Modal */}
      {selectedFormula && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="mb-4 pb-4 border-b dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                خامات تركيبة: {selectedFormula.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto pr-2 pb-4 flex-grow">
              {/* All Products */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-300 sticky top-0 bg-gray-50 dark:bg-gray-900/50 pb-2">
                  كل الخامات في المتجر
                </h3>
                <div className="space-y-3">
                  {validProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border rounded-xl dark:border-gray-700 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            p.image?.startsWith("http")
                              ? p.image
                              : `${baseUrl.replace("/api", "")}/storage/${p.image}`
                          }
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1 w-40">
                            {p.name}
                          </p>
                          <p className="text-sm text-gray-500">{p.price} ج.م</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addProductToFormula(p.id)}
                        className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-100 font-medium transition-colors"
                      >
                        إضافة
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Products */}
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <h3 className="font-semibold text-lg mb-4 text-blue-800 dark:text-blue-300 sticky top-0 bg-blue-50/50 dark:bg-gray-900 pb-2">
                  الخامات المضافة للتركيبة
                </h3>
                <div className="space-y-3">
                  {formulaProducts.map((sp) => {
                    const prod = validProducts.find((p) => p.id === sp.product_id);
                    if (!prod) return null;
                    return (
                      <div
                        key={sp.product_id}
                        className="p-4 bg-white dark:bg-gray-800 border rounded-xl border-blue-200 dark:border-gray-700 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {prod.name}
                          </span>
                          <button
                            onClick={() => removeProductFromFormula(sp.product_id)}
                            className="text-red-500 bg-red-50 p-1.5 rounded hover:bg-red-100"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">الكمية المطلوبة</label>
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={sp.quantity}
                              onChange={(e) => updateFormulaProduct(sp.product_id, 'quantity', e.target.value)}
                              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">وحدة القياس</label>
                            <select
                              value={sp.unit}
                              onChange={(e) => updateFormulaProduct(sp.product_id, 'unit', e.target.value)}
                              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                              <option value="kg">كيلو (kg)</option>
                              <option value="gm">جرام (gm)</option>
                              <option value="liter">لتر (L)</option>
                              <option value="piece">قطعة (pcs)</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">سعر الوحدة للتركيبة</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={sp.price_per_unit}
                              onChange={(e) => updateFormulaProduct(sp.product_id, 'price_per_unit', e.target.value)}
                              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                              title="قم بتعديل السعر ليتناسب مع الكيلو إذا كان السعر الأصلي للبرميل"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {formulaProducts.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      <Beaker className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>لم يتم إضافة أي خامات بعد.</p>
                      <p className="text-sm mt-1">اختر من القائمة المجاورة لإضافة الخامات</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedFormula(null)}
                className="px-6 py-2.5 border rounded-xl dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveProducts}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-colors font-medium shadow-lg shadow-blue-600/20"
              >
                <Check className="w-5 h-5" /> حفظ التركيبة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




