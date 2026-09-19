import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, Loader2, Sparkles, HelpCircle, ImageIcon, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Website/layout/Header/Header";
import ReviewsSection from "./components/ReviewsSection";
import ReactionBar from "@/components/Website/ReactionBar/ReactionBar";
import WishlistButton from "@/components/Website/WishlistButton/WishlistButton";
import useProductDetail from "./hooks/useProductDetail";

export default function ProductDetail() {
  const {
    navigate,
    product,
    isImageFullscreen, setIsImageFullscreen,
    loading,
    qty, setQty,
    related,
    qtyInCart,
    specs,
    addToCart,
    updateQuantity
  } = useProductDetail();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col" dir="rtl">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col" dir="rtl">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">عذراً، لم يتم العثور على المنتج المطلوب.</h2>
          <Link to="/products" className="mt-4 text-blue-600 hover:underline">العودة لصفحة المنتجات</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100" dir="rtl">
      <Helmet>
        <title>تفاصيل المنتج - {product.name}</title>
      </Helmet>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-blue-600 mb-6 transition"
        >
          <ArrowRight className="h-4 w-4" />
          رجوع
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          
          <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-gray-800/80 aspect-square overflow-hidden relative group">
              {product.image ? (
                 <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition" 
                  onClick={() => setIsImageFullscreen(true)}
                  title="تكبير الصورة"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-slate-300">
                   <ImageIcon className="h-32 w-32" />
                   <span className="mt-4 text-sm font-semibold">صورة تمثيلية</span>
                </div>
              )}

              <div className="absolute bottom-4 right-0 left-0 flex justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-800">
                <Sparkles className="h-3 w-3" /> خامة نقية ومعتمدة
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {product.category?.name || "بدون قسم"}
              </span>

              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-3">
                {product.name}
              </h1>

              <div className="mt-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                <ReactionBar productId={product.id} />
              </div>

              <div className="mt-4 flex items-center gap-2">
                {product.stock > 0 ? (
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    ✓ متوفر بالمخزن (متاح {product.stock} {product.unit.split(" ")[0]})
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    ✕ غير متوفر حالياً
                  </span>
                )}
              </div>

              <div className="mt-4 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/30">
                <span className="text-sm text-gray-500 dark:text-gray-400 block">السعر للوحدة ({product.unit})</span>
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {parseFloat(product.price).toLocaleString()} <span className="text-base font-normal text-gray-500">ج.م</span>
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">الوصف الكيميائي والاستخدام:</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  المواصفات الفنية للخامة:
                </h3>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 dark:bg-slate-950 p-2.5 rounded-lg">
                    <span className="font-bold block text-gray-400 mb-0.5">درجة النقاوة / التركيز</span>
                    <span className="text-gray-700 dark:text-gray-300">{specs.concentration}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-950 p-2.5 rounded-lg">
                    <span className="font-bold block text-gray-400 mb-0.5">الذوبان والامتزاج</span>
                    <span className="text-gray-700 dark:text-gray-300">{specs.solubility}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-950 p-2.5 rounded-lg">
                    <span className="font-bold block text-gray-400 mb-0.5">درجة التعادل pH</span>
                    <span className="text-gray-700 dark:text-gray-300">{specs.ph}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-950 p-2.5 rounded-lg">
                    <span className="font-bold block text-gray-400 mb-0.5">إرشادات الأمان</span>
                    <span className="text-gray-700 dark:text-gray-300">{specs.safety}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4">
              {qtyInCart > 0 ? (
                <div className="w-full">
                  <div className="text-xs text-gray-500 mb-2">مضاف بالفعل في السلة:</div>
                  <div className="flex items-center justify-between w-full p-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(product.id, qtyInCart - 1)}
                        className="h-8 w-8 rounded-lg bg-white border border-gray-200 text-gray-700 flex items-center justify-center font-bold hover:bg-gray-100 dark:bg-slate-900 dark:border-gray-800 dark:text-gray-300"
                      >
                        -
                      </button>
                      <span className="text-lg font-black text-gray-800 dark:text-white px-2">
                        {qtyInCart}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, qtyInCart + 1)}
                        className="h-8 w-8 rounded-lg bg-white border border-gray-200 text-gray-700 flex items-center justify-center font-bold hover:bg-gray-100 dark:bg-slate-900 dark:border-gray-800 dark:text-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-500">
                      الإجمالي: {parseFloat(product.price * qtyInCart).toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 dark:border-gray-800 dark:bg-slate-950">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-2.5 text-gray-600 hover:bg-gray-200 rounded-r-xl transition dark:text-gray-400 dark:hover:bg-slate-800"
                    >
                      -
                    </button>
                    <span className="px-4 text-base font-bold text-gray-800 dark:text-white">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="px-3.5 py-2.5 text-gray-600 hover:bg-gray-200 rounded-l-xl transition dark:text-gray-400 dark:hover:bg-slate-800"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex-1 flex gap-3">
                    <button
                      onClick={() => addToCart(product, qty)}
                      disabled={product.stock === 0}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white shadow-lg transition ${
                        product.stock === 0
                          ? "bg-gray-300 cursor-not-allowed shadow-none"
                          : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                      }`}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      إضافة إلى سلة المشتريات
                    </button>
                    <WishlistButton 
                      productId={product.id} 
                      productImage={product.image} 
                      className="" 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection productId={product.id} />

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">خامات مشابهة قد تحتاجها</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition dark:border-gray-800 dark:bg-slate-900"
                >
                  <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ImageIcon className="text-slate-300 h-12 w-12" />
                    )}
                    <span className="absolute top-2 right-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                      {p.category?.name}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition dark:text-white dark:group-hover:text-blue-400">
                      <Link to={`/products/${p.id}`}>{p.name}</Link>
                    </h3>
                    <p className="mt-2 text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
                      {p.description}
                    </p>
                  </div>
                  <div className="mt-4 p-4 pt-0">
                    <div className="text-xs text-gray-400 mb-1">الوحدة: {p.unit}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {parseFloat(p.price).toLocaleString()} ج.م
                      </span>
                      <Link
                        to={`/products/${p.id}`}
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700"
                      >
                        عرض التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Fullscreen Image Modal */}
      {isImageFullscreen && product?.image && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setIsImageFullscreen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition bg-white/10 hover:bg-white/20 p-2 rounded-full"
            onClick={() => setIsImageFullscreen(false)}
          >
            <X size={32} />
          </button>
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

    </div>
  );
}

