import React, { useState, useEffect } from "react";
import { Beaker, Calculator, ShoppingCart, Info, Droplet } from "lucide-react";
import axios from "axios";
import { baseUrl } from "../../../Api/Api";

export default function SmartFormulaCalculator() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("1000");
  const [targetCostPerKg, setTargetCostPerKg] = useState("");
  
  const [isCalculated, setIsCalculated] = useState(false);
  const [calculatedRecipe, setCalculatedRecipe] = useState(null);
  const [costSummary, setCostSummary] = useState(null);

  const volumes = [
    { id: "1000", name: "تانك 1000 كيلو" },
    { id: "220", name: "برميل 220 كيلو" },
    { id: "170", name: "برميل 170 كيلو" },
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(`${baseUrl}/smart-calculator/recipes`);
        setRecipes(res.data);
        if (res.data.length > 0) {
          setSelectedProduct(res.data[0].identifier);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes", error);
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleCalculate = () => {
    const recipe = recipes.find(r => r.identifier === selectedProduct);
    if (!recipe) return;

    const targetVolume = parseFloat(selectedVolume);
    
    // Total standard percentage should be 100
    // Separate active and filler/neutral
    let activeIngredients = [];
    let fillerIngredients = [];
    let neutralIngredients = []; // Scents, colors (usually we don't scale these down to save cost, they are fixed, but let's treat them as active if needed, or fixed).
    
    recipe.ingredients.forEach(ing => {
      if (ing.material.type === 'filler') {
        fillerIngredients.push(ing);
      } else if (ing.material.type === 'neutral') {
        neutralIngredients.push(ing); // Keep fixed
      } else {
        activeIngredients.push(ing);
      }
    });

    // We will calculate everything on a 1 KG basis first, then multiply by volume
    let Wa = 0; // weight of actives in 1 kg
    let Ca = 0; // cost of actives in 1 kg
    
    let Wn = 0; // weight of neutral in 1 kg
    let Cn = 0; // cost of neutral in 1 kg
    
    let Wf = 0; // weight of fillers in 1 kg
    let Cf = 0; // cost of fillers in 1 kg

    // Calculate base weights and costs per 1 kg of final product
    activeIngredients.forEach(ing => {
      const weightIn1Kg = ing.percentage / 100;
      Wa += weightIn1Kg;
      Ca += weightIn1Kg * parseFloat(ing.material.price_per_kg);
    });

    neutralIngredients.forEach(ing => {
      const weightIn1Kg = ing.percentage / 100;
      Wn += weightIn1Kg;
      Cn += weightIn1Kg * parseFloat(ing.material.price_per_kg);
    });

    fillerIngredients.forEach(ing => {
      const weightIn1Kg = ing.percentage / 100;
      Wf += weightIn1Kg;
      Cf += weightIn1Kg * parseFloat(ing.material.price_per_kg);
    });

    const standardTotalCostPerKg = Ca + Cn + Cf;

    let targetCost = parseFloat(targetCostPerKg);
    let scaleActives = 1.0;
    
    // If user provided a target cost and it's lower than standard cost
    if (targetCost && targetCost > 0) {
      if (targetCost < standardTotalCostPerKg) {
        // We need to scale down actives and increase filler
        // Total weight must remain 1 kg. Neutrals remain fixed.
        // new_Wa + new_Wf = 1 - Wn
        // new_Wa * Ua + new_Wf * Uf = targetCost - Cn
        
        const Ua = Wa > 0 ? Ca / Wa : 0; // Average cost of active mix per kg
        const Uf = Wf > 0 ? Cf / Wf : 0; // Average cost of filler mix per kg
        
        const T_adjusted = targetCost - Cn;
        const W_adjusted = 1 - Wn;

        // new_Wa * Ua + (W_adjusted - new_Wa) * Uf = T_adjusted
        // new_Wa * (Ua - Uf) = T_adjusted - W_adjusted * Uf
        
        if (Ua > Uf) {
          let new_Wa = (T_adjusted - W_adjusted * Uf) / (Ua - Uf);
          
          if (new_Wa < 0) {
            new_Wa = 0; // Can't be cheaper than filler + neutral
          }
          if (new_Wa > W_adjusted) {
            new_Wa = W_adjusted;
          }
          
          scaleActives = Wa > 0 ? new_Wa / Wa : 1;
        }
      }
    }

    // Now generate final recipe list scaled to target volume
    let finalRecipe = [];
    let finalTotalCost = 0;
    
    // 1. Add Neutrals (Unchanged ratio)
    let actualWn = 0;
    neutralIngredients.forEach(ing => {
      const w = (ing.percentage / 100) * targetVolume;
      actualWn += w;
      finalTotalCost += w * parseFloat(ing.material.price_per_kg);
      finalRecipe.push({
        name: ing.material.name,
        type: 'neutral',
        percentage: ing.percentage, // original percentage display
        weight: w,
        unit: w < 1 && ing.material.name !== 'مياه' ? 'جرام' : 'كيلو',
        displayWeight: w < 1 && ing.material.name !== 'مياه' ? w * 1000 : w,
      });
    });

    // 2. Add Actives (Scaled)
    let actualWa = 0;
    activeIngredients.forEach(ing => {
      const originalW = (ing.percentage / 100) * targetVolume;
      const w = originalW * scaleActives;
      actualWa += w;
      finalTotalCost += w * parseFloat(ing.material.price_per_kg);
      finalRecipe.push({
        name: ing.material.name,
        type: 'active',
        percentage: parseFloat((ing.percentage * scaleActives).toFixed(2)),
        weight: w,
        unit: w < 1 ? 'جرام' : 'كيلو',
        displayWeight: w < 1 ? w * 1000 : w,
      });
    });

    // 3. Add Fillers (Compensating for missing volume)
    const targetWf = targetVolume - actualWn - actualWa;
    
    // We distribute targetWf among fillers based on their original proportions
    let originalWfTotal = fillerIngredients.reduce((acc, ing) => acc + (ing.percentage / 100), 0);
    if (originalWfTotal === 0 && targetWf > 0) {
      // Fallback if no filler specified but we need one, usually there is water
    }
    
    fillerIngredients.forEach(ing => {
      const proportion = (ing.percentage / 100) / originalWfTotal;
      const w = targetWf * proportion;
      finalTotalCost += w * parseFloat(ing.material.price_per_kg);
      
      const newPercentage = (w / targetVolume) * 100;
      
      finalRecipe.push({
        name: ing.material.name,
        type: 'filler',
        percentage: parseFloat(newPercentage.toFixed(2)),
        weight: w,
        unit: ing.material.name.includes('مياه') ? 'لتر' : (w < 1 ? 'جرام' : 'كيلو'),
        displayWeight: (w < 1 && !ing.material.name.includes('مياه')) ? w * 1000 : w,
      });
    });

    setCalculatedRecipe(finalRecipe);
    setCostSummary({
      standardCostPerKg: parseFloat(standardTotalCostPerKg.toFixed(2)),
      actualCostPerKg: parseFloat((finalTotalCost / targetVolume).toFixed(2)),
      totalCost: parseFloat(finalTotalCost.toFixed(2)),
    });
    setIsCalculated(true);
  };

  if (loading) return null;

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 text-blue-600 dark:text-blue-400">
            <Beaker className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
            حاسبة التكلفة والتصنيع الذكية
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            حدد المنتج والكمية وتكلفتك المستهدفة، وسيقوم الذكاء الاصطناعي بإعادة هندسة التركيبة وضبط الخامات لتناسب ميزانيتك.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-slate-50 dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 shadow-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                ماذا تريد أن تصنع؟
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  setIsCalculated(false);
                }}
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white font-medium"
              >
                {recipes.map(p => (
                  <option key={p.identifier} value={p.identifier}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                الكمية المطلوبة (الوزن)
              </label>
              <select
                value={selectedVolume}
                onChange={(e) => {
                  setSelectedVolume(e.target.value);
                  setIsCalculated(false);
                }}
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white font-medium"
              >
                {volumes.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                التكلفة المستهدفة للكيلو (اختياري)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="مثال: 5 جنيه"
                value={targetCostPerKg}
                onChange={(e) => {
                  setTargetCostPerKg(e.target.value);
                  setIsCalculated(false);
                }}
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <Calculator className="w-5 h-5" />
              أعد حساب التركيبة والتكلفة
            </button>
          </div>

          {isCalculated && calculatedRecipe && costSummary && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Cost Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
                  <div className="text-gray-500 text-sm mb-1">التكلفة القياسية للمنتج</div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{costSummary.standardCostPerKg} ج.م / ك</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800 text-center">
                  <div className="text-blue-600 dark:text-blue-400 text-sm mb-1">التكلفة بعد الضبط الذكي</div>
                  <div className="text-2xl font-black text-blue-700 dark:text-blue-300">{costSummary.actualCostPerKg} ج.م / ك</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm mb-1">إجمالي تكلفة التشغيلة</div>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{costSummary.totalCost.toLocaleString()} ج.م</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="bg-gray-100 dark:bg-slate-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    النسب الدقيقة المطلوبة
                  </h3>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    تشغيلة {selectedVolume} كيلو
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                        <th className="py-4 px-6 font-semibold">اسم الخامة</th>
                        <th className="py-4 px-6 font-semibold w-1/4">النسبة بعد التعديل (%)</th>
                        <th className="py-4 px-6 font-bold text-gray-900 dark:text-white w-1/3 text-left">الكمية للتشغيلة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {calculatedRecipe.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-4 px-6 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <Droplet className={`w-4 h-4 ${item.type === 'filler' ? "text-blue-400" : (item.type === 'active' ? "text-emerald-500" : "text-purple-400")}`} />
                            {item.name}
                          </td>
                          <td className="py-4 px-6 text-gray-500 dark:text-gray-400 dir-ltr text-right">
                            {item.percentage}%
                          </td>
                          <td className="py-4 px-6 font-bold text-blue-600 dark:text-blue-400 text-left text-lg">
                            {parseFloat(item.displayWeight.toFixed(3))} <span className="text-sm font-medium text-gray-500">{item.unit}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  أضف الخامات للسلة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
