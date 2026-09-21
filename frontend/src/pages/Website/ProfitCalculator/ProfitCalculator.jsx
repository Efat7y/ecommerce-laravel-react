import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../Api/Api";
import Header from "../../../components/Website/layout/Header/Header";
import Footer from "../../../components/Website/layout/Footer/Footer";
import { Calculator, TrendingUp, DollarSign, Droplet, Percent, Package } from "lucide-react";
import PageTransition from "../../../components/PageTransition";

export default function ProfitCalculator() {
  const [formulas, setFormulas] = useState([]);
  const [selectedFormulaId, setSelectedFormulaId] = useState("");
  const [batchVolume, setBatchVolume] = useState(220); // Liters
  const [sellingPrice, setSellingPrice] = useState(5); // EGP per Liter

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const fetchFormulas = async () => {
      try {
        const res = await axios.get(`${baseUrl}/formulas?t=${Date.now()}`);
        setFormulas(res.data);
        if (res.data.length > 0) {
          setSelectedFormulaId(res.data[0].id.toString());
        }
      } catch (error) {
        console.error("Error fetching formulas", error);
      }
    };
    fetchFormulas();
  }, []);

  const selectedFormula = formulas.find((f) => f.id === parseInt(selectedFormulaId));

  // Auto-update batch volume when formula changes
  useEffect(() => {
    if (selectedFormula && selectedFormula.batch_size) {
      setBatchVolume(selectedFormula.batch_size);
    }
  }, [selectedFormulaId, formulas]);


  // Calculate Base Cost for 220L
  let formulaTotalCost = 0;
  if (selectedFormula && selectedFormula.products) {
    selectedFormula.products.forEach((product) => {
      let qtyInKg = parseFloat(product.pivot.quantity) || 0;
      if (product.pivot.unit === "gm" || product.pivot.unit === "ml") {
        qtyInKg /= 1000;
      }
      const pricePerUnit = parseFloat(product.pivot.price_per_unit) || 0;
      formulaTotalCost += qtyInKg * pricePerUnit;
    });
  }

  // Get the standard batch size defined for this formula (default to 220 if missing)
  const standardBatchSize = selectedFormula?.batch_size || 220;
  
  // Cost per 1 liter based on the formula's specific batch size
  const costPerLiter = formulaTotalCost / standardBatchSize;

  // Real-time calculations based on user input
  const totalCost = costPerLiter * (Number(batchVolume) || 0);
  const expectedRevenue = (Number(sellingPrice) || 0) * (Number(batchVolume) || 0);
  const netProfit = expectedRevenue - totalCost;
  const profitMargin = expectedRevenue > 0 ? (netProfit / expectedRevenue) * 100 : 0;
  const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  return (
    <PageTransition>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 pt-32">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4">
              <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              حاسبة التكلفة والأرباح
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              ادرس مشروعك قبل ما تبدأ! اختر التركيبة، حدد الكمية التي تريد تصنيعها وسعر البيع المتوقع، وسيقوم النظام بحساب تكاليفك وأرباحك بدقة.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form Column */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                مدخلات الإنتاج
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اختر التركيبة / المنتج
                  </label>
                  <select
                    value={selectedFormulaId}
                    onChange={(e) => setSelectedFormulaId(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                  >
                    {formulas.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الكمية المستهدف تصنيعها (لتر/كيلو)
                  </label>
                  <div className="relative">
                    <Droplet className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      value={batchVolume}
                      onChange={(e) => setBatchVolume(e.target.value)}
                      className="w-full p-3 pr-10 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    سعر بيع اللتر الواحد المتوقع (ج.م)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      className="w-full p-3 pr-10 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Dashboard Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Top Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-10">
                    <Package className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-blue-100 font-medium mb-1">إجمالي التكلفة المتوقعة</p>
                    <h3 className="text-3xl font-bold">{totalCost.toFixed(2)} <span className="text-xl font-normal">ج.م</span></h3>
                    <p className="text-sm mt-3 bg-white/20 inline-block px-3 py-1 rounded-full">
                      تكلفة اللتر تقريباً: {costPerLiter.toFixed(2)} ج.م
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-10">
                    <TrendingUp className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-green-100 font-medium mb-1">صافي الربح المتوقع</p>
                    <h3 className="text-3xl font-bold">{netProfit.toFixed(2)} <span className="text-xl font-normal">ج.م</span></h3>
                    <p className="text-sm mt-3 bg-white/20 inline-block px-3 py-1 rounded-full">
                      إيرادات المبيعات: {expectedRevenue.toFixed(2)} ج.م
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Metrics */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
                  مؤشرات الأداء المالي (KPIs)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profit Margin */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-700/50">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Percent className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">هامش الربح (Profit Margin)</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {profitMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* ROI */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-700/50">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">العائد على الاستثمار (ROI)</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {roi.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analysis Message */}
                <div className={`mt-6 p-4 rounded-xl border ${netProfit > 0 ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                  <p className={`text-sm font-medium ${netProfit > 0 ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                    {netProfit > 0 
                      ? "نتيجة ممتازة! هذه التركيبة بالسعر المحدد تحقق أرباحاً جيدة وتعتبر فرصة استثمارية ناجحة بناءً على أسعار الخامات الحالية."
                      : "تحذير: هذا التسعير يحقق خسارة أو لا يغطي تكاليف الخامات. يرجى مراجعة سعر البيع أو اختيار تركيبة اقتصادية أكثر."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
