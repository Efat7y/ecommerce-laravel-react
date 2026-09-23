import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../Api/Api";
import { getToken } from "../../../utils/auth";
import Swal from "sweetalert2";
import { Plus, Edit, Trash, Beaker, Check, X } from "lucide-react";

export default function SmartCalculatorRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    identifier: "", 
    description: "",
    ingredients: [{ calc_material_id: "", percentage: "", unit: "kg" }]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recipesRes, materialsRes] = await Promise.all([
        axios.get(`${baseUrl}/smart-calculator/recipes`),
        axios.get(`${baseUrl}/smart-calculator/materials`)
      ]);
      setRecipes(recipesRes.data);
      setMaterials(materialsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ 
      name: "", 
      identifier: "", 
      description: "",
      ingredients: [{ calc_material_id: "", percentage: "", unit: "kg" }]
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payloadIngredients = formData.ingredients.map(ing => ({
        calc_material_id: ing.calc_material_id,
        percentage: ing.unit === 'g' ? (Number(ing.percentage) / 1000).toString() : ing.percentage
      }));
      const payload = { ...formData, ingredients: payloadIngredients };

      // Basic validation
      const totalQuantity = payloadIngredients.reduce((sum, ing) => sum + Number(ing.percentage), 0);
      if (totalQuantity <= 0) {
        Swal.fire("خطأ", "يجب إدخال كميات صحيحة", "error");
        return;
      }

      if (!formData.identifier) {
         formData.identifier = 'recipe-' + Date.now();
      }

      if (editingId) {
        // Not implemented on backend yet, so let's just delete and recreate for now if they edit
        await axios.delete(`${baseUrl}/smart-calculator/recipes/${editingId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      }
      
      await axios.post(`${baseUrl}/smart-calculator/recipes`, payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      Swal.fire("نجاح", "تم حفظ التركيبة بنجاح", "success");
      
      resetForm();
      fetchData();
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء الحفظ. تأكد من صحة البيانات.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه التركيبة؟")) return;
    try {
      await axios.delete(`${baseUrl}/smart-calculator/recipes/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchData();
    } catch (error) {
      Swal.fire("خطأ", "لم يتم الحذف", "error");
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { calc_material_id: "", percentage: "", unit: "kg" }]
    });
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const removeIngredient = (index) => {
    const newIngredients = [...formData.ingredients];
    newIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  if (loading) return <div className="p-8 text-white">جاري التحميل...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-100" dir="rtl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600/20 rounded-xl">
          <Beaker className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">إدارة التركيبات (الحاسبة الذكية)</h1>
          <p className="text-slate-400 mt-1">قم بإنشاء وتعديل التركيبات التي تظهر في الحاسبة الذكية للعملاء.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="lg:col-span-1 bg-slate-800 rounded-2xl p-6 border border-slate-700 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            إضافة تركيبة جديدة
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">اسم التركيبة (مثال: صابون سائل)</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="border-t border-slate-700 pt-4 mt-4">
              <label className="block text-sm text-slate-400 mb-2">المقادير (أدخل الكمية بالكيلو أو الجرام كما في وصفتك الأساسية)</label>
              
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <select
                    required
                    value={ing.calc_material_id}
                    onChange={e => updateIngredient(idx, 'calc_material_id', e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm text-white outline-none"
                  >
                    <option value="">اختر الخامة</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.001"
                    required
                    placeholder="الكمية"
                    value={ing.percentage}
                    onChange={e => updateIngredient(idx, 'percentage', e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm text-white outline-none text-center"
                  />
                  <select
                    value={ing.unit || 'kg'}
                    onChange={e => updateIngredient(idx, 'unit', e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm text-white outline-none"
                  >
                    <option value="kg">كيلو</option>
                    <option value="g">جرام</option>
                  </select>
                  <button type="button" onClick={() => removeIngredient(idx)} className="text-red-400 hover:text-red-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button type="button" onClick={addIngredient} className="text-sm text-blue-400 mt-2 flex items-center gap-1 hover:text-blue-300">
                <Plus className="w-4 h-4" /> إضافة خامة للتركيبة
              </button>
            </div>

            <div className="pt-4 flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                حفظ التركيبة
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
                  <th className="py-4 px-6 font-semibold">اسم التركيبة</th>
                  <th className="py-4 px-6 font-semibold">عدد الخامات</th>
                  <th className="py-4 px-6 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {recipes.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-slate-500">لا توجد تركيبات مضافة حتى الآن</td>
                  </tr>
                ) : (
                  recipes.map(recipe => (
                    <tr key={recipe.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">{recipe.name}</td>
                      <td className="py-4 px-6 text-sm text-slate-400">
                        {recipe.ingredients?.length || 0} خامات
                      </td>
                      <td className="py-4 px-6 flex gap-2">
                        <button onClick={() => handleDelete(recipe.id)} className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition">
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
