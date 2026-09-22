import React, { useState } from "react";
import { Beaker, Calculator, ShoppingCart, Info, Droplet } from "lucide-react";

export default function SmartFormulaCalculator() {
  const [selectedProduct, setSelectedProduct] = useState("pril_yellow");
  const [selectedVolume, setSelectedVolume] = useState("1000");
  const [isCalculated, setIsCalculated] = useState(false);

  const products = [
    { id: "pril_yellow", name: "بريل أصفر (ليمون)" },
    { id: "pril_white", name: "بريل أبيض" },
    { id: "pril_green", name: "بريل أخضر (تفاح)" },
    { id: "pril_blue", name: "بريل أزرق" },
    { id: "persil_gel", name: "برسيل جيل" },
  ];

  const volumes = [
    { id: "1000", name: "تانك 1000 كيلو" },
    { id: "220", name: "برميل 220 كيلو" },
    { id: "170", name: "برميل 170 كيلو" },
  ];

  // Dummy ratios (percentages). The user will provide the exact ones later.
  const baseRatios = {
    pril_yellow: [
      { name: "سلفونيك (حمض السلفونيك)", percentage: 10, unit: "كيلو" },
      { name: "تكسابون (صوديوم لوريل إيثر سلفات)", percentage: 2.5, unit: "كيلو" },
      { name: "صودا كاوية (قشور)", percentage: 1.5, unit: "كيلو" },
      { name: "تايلوز", percentage: 0.2, unit: "كيلو" },
      { name: "لون أصفر", percentage: 0.01, unit: "كيلو" },
      { name: "ريحة ليمون زيتية", percentage: 0.15, unit: "كيلو" },
      { name: "مادة حافظة", percentage: 0.1, unit: "كيلو" },
      { name: "مياه مقطرة/مفلترة", percentage: 85.54, unit: "لتر" },
    ],
    pril_white: [
      { name: "سلفونيك", percentage: 10, unit: "كيلو" },
      { name: "تكسابون", percentage: 2.5, unit: "كيلو" },
      { name: "صودا كاوية", percentage: 1.5, unit: "كيلو" },
      { name: "تايلوز", percentage: 0.2, unit: "كيلو" },
      { name: "مادة حافظة", percentage: 0.1, unit: "كيلو" },
      { name: "مياه", percentage: 85.7, unit: "لتر" },
    ],
    pril_green: [
      { name: "سلفونيك", percentage: 10, unit: "كيلو" },
      { name: "تكسابون", percentage: 2.5, unit: "كيلو" },
      { name: "صودا كاوية", percentage: 1.5, unit: "كيلو" },
      { name: "تايلوز", percentage: 0.2, unit: "كيلو" },
      { name: "لون أخضر", percentage: 0.01, unit: "كيلو" },
      { name: "ريحة تفاح", percentage: 0.15, unit: "كيلو" },
      { name: "مادة حافظة", percentage: 0.1, unit: "كيلو" },
      { name: "مياه", percentage: 85.54, unit: "لتر" },
    ],
    pril_blue: [
      { name: "سلفونيك", percentage: 10, unit: "كيلو" },
      { name: "تكسابون", percentage: 2.5, unit: "كيلو" },
      { name: "صودا كاوية", percentage: 1.5, unit: "كيلو" },
      { name: "تايلوز", percentage: 0.2, unit: "كيلو" },
      { name: "لون أزرق", percentage: 0.01, unit: "كيلو" },
      { name: "ريحة", percentage: 0.15, unit: "كيلو" },
      { name: "مادة حافظة", percentage: 0.1, unit: "كيلو" },
      { name: "مياه", percentage: 85.54, unit: "لتر" },
    ],
    persil_gel: [
      { name: "سلفونيك", percentage: 12, unit: "كيلو" },
      { name: "تكسابون", percentage: 3, unit: "كيلو" },
      { name: "صودا كاوية", percentage: 1.8, unit: "كيلو" },
      { name: "فات كحول", percentage: 1, unit: "كيلو" },
      { name: "مانع رغوة", percentage: 0.1, unit: "كيلو" },
      { name: "إنزيمات نظافة", percentage: 0.5, unit: "كيلو" },
      { name: "عطر برسيل", percentage: 0.3, unit: "كيلو" },
      { name: "لون أزرق", percentage: 0.01, unit: "كيلو" },
      { name: "مادة حافظة", percentage: 0.1, unit: "كيلو" },
      { name: "مياه", percentage: 81.19, unit: "لتر" },
    ]
  };

  const handleCalculate = () => {
    setIsCalculated(true);
  };

  const currentRecipe = baseRatios[selectedProduct] || [];
  const targetVolume = parseFloat(selectedVolume);

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 text-blue-600 dark:text-blue-400">
            <Beaker className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
            حاسبة التصنيع الذكية
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            حدد المنتج والكمية التي ترغب في تصنيعها، وسيقوم النظام بحساب النسب الدقيقة المطلوبة من كل خامة كيميائية لضمان أعلى جودة.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 shadow-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Product Selector */}
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
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white font-medium shadow-sm"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Volume Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                الكمية المطلوبة (حجم التشغيلة)
              </label>
              <select
                value={selectedVolume}
                onChange={(e) => {
                  setSelectedVolume(e.target.value);
                  setIsCalculated(false);
                }}
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white font-medium shadow-sm"
              >
                {volumes.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <Calculator className="w-5 h-5" />
              عرض التركيبة والنسب
            </button>
          </div>

          {/* Results Table */}
          {isCalculated && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="bg-gray-100 dark:bg-slate-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    النسب الدقيقة المطلوبة
                  </h3>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    تشغيلة {targetVolume} كيلو
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                        <th className="py-4 px-6 font-semibold">اسم الخامة</th>
                        <th className="py-4 px-6 font-semibold w-1/4">النسبة (%)</th>
                        <th className="py-4 px-6 font-bold text-gray-900 dark:text-white w-1/3 text-left">الكمية المطلوبة للتشغيلة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {currentRecipe.map((item, idx) => {
                        // Calculate weight
                        let weight = (item.percentage / 100) * targetVolume;
                        // Format for readability
                        let displayWeight = weight;
                        let displayUnit = item.unit;
                        
                        if (weight < 1 && item.unit === "كيلو") {
                          displayWeight = weight * 1000;
                          displayUnit = "جرام";
                        } else {
                          displayWeight = parseFloat(weight.toFixed(3)); // max 3 decimals
                        }

                        return (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 px-6 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                              <Droplet className={`w-4 h-4 ${item.name.includes("مياه") ? "text-blue-400" : "text-emerald-500"}`} />
                              {item.name}
                            </td>
                            <td className="py-4 px-6 text-gray-500 dark:text-gray-400 dir-ltr text-right">
                              {item.percentage}%
                            </td>
                            <td className="py-4 px-6 font-bold text-blue-600 dark:text-blue-400 text-left text-lg">
                              {displayWeight} <span className="text-sm font-medium text-gray-500">{displayUnit}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  شراء الخامات الآن
                </button>
                <div className="flex items-center gap-2 text-gray-500 text-sm justify-center sm:justify-start px-4">
                  <Info className="w-4 h-4" />
                  النسب مسجلة بناءً على أحدث المواصفات القياسية
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
