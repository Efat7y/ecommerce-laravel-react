import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../Api/Api";
import { getToken } from "../../../utils/auth";
import Swal from "sweetalert2";
import { Plus, Edit, Trash, Beaker, Check, X } from "lucide-react";

export default function SmartCalculatorManager() {
  const [materials, setMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", price_per_kg: "", type: "active" });

  useEffect(() => {
    fetchMaterials();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${baseUrl}/smart-calculator/materials`);
      setMaterials(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", price_per_kg: "", type: "active" });
  };

  const handleEdit = (mat) => {
    setEditingId(mat.id);
    setFormData({ name: mat.name, price_per_kg: mat.price_per_kg, type: mat.type });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${baseUrl}/smart-calculator/materials/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        Swal.fire("نجاح", "تم تحديث سعر الخامة بنجاح", "success");
      } else {
        await axios.post(`${baseUrl}/smart-calculator/materials`, formData, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        Swal.fire("نجاح", "تم إضافة الخامة بنجاح", "success");
      }
      resetForm();
      fetchMaterials();
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء الحفظ", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الخامة؟")) return;
    try {
      await axios.delete(`${baseUrl}/smart-calculator/materials/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchMaterials();
    } catch (error) {
      Swal.fire("خطأ", "لا يمكن الحذف", "error");
    }
  };

  const typeLabel = {
    active: "مادة فعالة (غالية)",
    filler: "مادة مالئة (رخيصة/ماء)",
    neutral: "مادة ثابتة (لون/عطر)",
  };

  if (loading) return <div className="p-8 text-white">جاري التحميل...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-100" dir="rtl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600/20 rounded-xl">
          <Beaker className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">إدارة أسعار الخامات (الحاسبة الذكية)</h1>
          <p className="text-slate-400 mt-1">تحديث أسعار الخامات سينعكس فوراً على الحاسبة الذكية للعملاء</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="lg:col-span-1 bg-slate-800 rounded-2xl p-6 border border-slate-700 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            {editingId ? <Edit className="w-5 h-5 text-blue-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
            {editingId ? "تعديل خامة" : "إضافة خامة جديدة"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">اسم الخامة</label>
              <input
                list="materials-list"
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
              <datalist id="materials-list">
                {products.map(p => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">سعر الكيلو (ج.م)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price_per_kg}
                onChange={e => setFormData({...formData, price_per_kg: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">نوع الخامة كيميائياً</label>
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500"
              >
                <option value="active">مادة فعالة (يتم تقليلها لخفض السعر)</option>
                <option value="filler">مادة مالئة / ماء (يتم زيادتها لتعويض الوزن)</option>
                <option value="neutral">مادة ثابتة / عطر (لا تتأثر بالمعادلة)</option>
              </select>
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                {editingId ? "حفظ التعديلات" : "إضافة الخامة"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-300">
                  <th className="py-4 px-6 font-semibold">اسم الخامة</th>
                  <th className="py-4 px-6 font-semibold">التصنيف</th>
                  <th className="py-4 px-6 font-semibold">سعر الكيلو</th>
                  <th className="py-4 px-6 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {materials.map(mat => (
                  <tr key={mat.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">{mat.name}</td>
                    <td className="py-4 px-6 text-sm text-slate-400">{typeLabel[mat.type]}</td>
                    <td className="py-4 px-6 font-black text-emerald-400">{parseFloat(mat.price_per_kg)} ج.م</td>
                    <td className="py-4 px-6 flex gap-2">
                      <button onClick={() => handleEdit(mat)} className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(mat.id)} className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition">
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
