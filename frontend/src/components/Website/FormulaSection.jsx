import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../Api/Api";
import { Beaker, FileText, Download, Printer } from "lucide-react";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";

export default function FormulaSection() {
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormula, setSelectedFormula] = useState(null);

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const res = await axios.get(`${baseUrl}/formulas?t=${Date.now()}`);
        setFormulas(res.data);
      } catch (error) {
        console.error("Error fetching formulas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFormulas();
  }, []);

  const handlePrintPDF = () => {
    const element = document.getElementById("formula-print-area");
    const noPrintElements = element.querySelectorAll(".no-print");

    // Hide buttons during capture
    noPrintElements.forEach((el) => (el.style.display = "none"));

    // Use dom-to-image to avoid html2canvas CSS parsing errors (like oklch)
    domtoimage
      .toJpeg(element, {
        quality: 1,
        bgcolor: "#ffffff",
        filter: (node) => node.tagName !== "IMG", // Ignore images to prevent CORS
      })
      .then((dataUrl) => {
        // Create PDF with exactly the dimensions of the element
        const pdf = new jsPDF({
          orientation:
            element.offsetWidth > element.offsetHeight
              ? "landscape"
              : "portrait",
          unit: "px",
          format: [element.offsetWidth, element.offsetHeight],
        });
        pdf.addImage(
          dataUrl,
          "JPEG",
          0,
          0,
          element.offsetWidth,
          element.offsetHeight,
        );
        pdf.save(`${selectedFormula.title || "formula"}.pdf`);
      })
      .catch((err) => {
        console.error("Error generating PDF", err);
      })
      .finally(() => {
        // Restore buttons whether success or fail
        noPrintElements.forEach((el) => (el.style.display = ""));
      });
  };

  if (loading || formulas.length === 0) return null;

  // Calculate totals if a formula is selected
  let totalCost = 0;
  const totalWeightKg = selectedFormula?.batch_size || 220; // Dynamic batch size

  if (selectedFormula && selectedFormula.products) {
    selectedFormula.products.forEach((product) => {
      const requiredQty = parseFloat(product.pivot.quantity);
      const unit = product.pivot.unit;
      const pricePerUnit = parseFloat(product.pivot.price_per_unit) || 0;

      let qtyInKg = requiredQty;
      if (unit === "gm" || unit === "ml") qtyInKg = requiredQty / 1000;

      // Calculate cost
      totalCost += qtyInKg * pricePerUnit;
    });
  }

  const finalCostPerKilo = totalCost / totalWeightKg;

  return (
    <section className="py-16 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      {/* Print Styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #formula-print-area, #formula-print-area * {
              visibility: visible;
            }
            #formula-print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              color: black !important;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
            /* Hide modal background */
            .modal-backdrop {
              background: transparent !important;
              backdrop-filter: none !important;
            }
          }
        `}
      </style>

      <div className="container mx-auto px-4 no-print">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="bg-blue-100 dark:bg-blue-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Beaker className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            المراجع والتركيبات التعليمية
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            أدلة وتركيبات احترافية للمبتدئين بالنسب الدقيقة. حمل التركيبة الآن
            كمرجع لك وابدأ التصنيع بدون أخطاء!
          </p>
        </div>

        {/* Formulas Grid */}
        <div className="mx-auto max-w-7xl items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formulas.map((formula) => (
            <div
              key={formula.id}
              className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-full -z-0 group-hover:scale-110 transition-transform"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {formula.title}
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 h-12 line-clamp-2">
                  {formula.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    {formula.products?.length || 0} خامات
                  </span>

                  <button
                    onClick={() => setSelectedFormula(formula)}
                    className="flex items-center gap-2 text-white bg-gray-900 dark:bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    عرض وتحميل الـ PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formula Details Modal (Printable) */}
      {selectedFormula && (
        <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity overflow-y-auto pt-20 pb-10">
          <div
            id="formula-print-area"
            className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative my-auto"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="bg-blue-50 dark:bg-slate-700/50 p-6 border-b border-blue-100 dark:border-gray-700 text-center">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-2">
                دليل التصنيع: {selectedFormula.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedFormula.description}
              </p>
            </div>

            {/* Modal Body: Products List */}
            <div className="p-6">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-lg border-b pb-2">
                الخامات والمقادير المطلوبة:
              </h4>
              <div className="space-y-3">
                {selectedFormula.products?.map((product, index) => {
                  const requiredQty = parseFloat(product.pivot.quantity);
                  const unit = product.pivot.unit;
                  const pricePerUnit =
                    parseFloat(product.pivot.price_per_unit) || 0;

                  let qtyInKg = requiredQty;
                  if (unit === "gm" || unit === "ml")
                    qtyInKg = requiredQty / 1000;

                  const itemTotal = (qtyInKg * pricePerUnit).toFixed(2);

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-700/30 border border-gray-100 dark:border-gray-700 print:border-gray-300 print:bg-white"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-slate-600 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 print:hidden">
                          <img
                            src={
                              product.image?.startsWith("http")
                                ? product.image
                                : `${baseUrl.replace("/api", "")}/storage/${
                                    product.image
                                  }`
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white print:text-black">
                            {index + 1}- {product.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            سعر الكيلو: {pricePerUnit} ج.م
                          </p>
                        </div>
                      </div>

                      <div className="text-left flex-shrink-0 min-w-[120px]">
                        <div className="font-bold text-lg text-blue-600 dark:text-blue-400 print:text-black">
                          {requiredQty}{" "}
                          <span className="text-sm font-normal">{unit}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
                          التكلفة: {itemTotal} ج.م
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Box */}
              <div className="mt-8 bg-blue-600 text-white p-6 rounded-2xl shadow-lg print:bg-gray-100 print:text-black print:border print:border-gray-800">
                <h4 className="font-bold text-xl mb-4 border-b border-blue-400/30 print:border-gray-300 pb-2">
                  ملخص الحسابات (دراسة الجدوى)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white/10 print:bg-white p-3 rounded-xl print:border">
                    <p className="text-blue-100 print:text-gray-600 text-sm mb-1">
                      الكمية الإجمالية (الطبخة)
                    </p>
                    <p className="text-2xl font-bold">
                      {totalWeightKg.toFixed(2)} كيلو
                    </p>
                  </div>
                  <div className="bg-white/10 print:bg-white p-3 rounded-xl print:border">
                    <p className="text-blue-100 print:text-gray-600 text-sm mb-1">
                      إجمالي تكلفة التركيبة
                    </p>
                    <p className="text-2xl font-bold">
                      {totalCost.toFixed(2)} ج.م
                    </p>
                  </div>
                  <div className="bg-white/20 print:bg-gray-200 p-3 rounded-xl print:border print:border-black">
                    <p className="text-blue-50 print:text-gray-800 text-sm mb-1 font-medium">
                      تكلفة الكيلو النهائي للمنتج
                    </p>
                    <p className="text-2xl font-bold text-yellow-300 print:text-black">
                      {finalCostPerKilo.toFixed(2)} ج.م
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer (Hidden in Print) */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-700/50 flex items-center justify-between gap-4 no-print rounded-b-3xl">
              <button
                onClick={() => setSelectedFormula(null)}
                className="px-6 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                إغلاق
              </button>

              <button
                onClick={handlePrintPDF}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-600/20 text-lg"
              >
                <Download className="w-6 h-6" />
                تحميل المرجع كـ PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
