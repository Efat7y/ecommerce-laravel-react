import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Info,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Website/layout/Header/Header";
import ReactionBar from "@/components/Website/ReactionBar/ReactionBar";
import WishlistButton from "@/components/Website/WishlistButton/WishlistButton";
import useProductCatalog from "./hooks/useProductCatalog";

export default function ProductCatalog() {
  const {
    categories,
    loading,
    search, setSearch,
    categoryId, handleCategorySelect,
    maxPrice, setMaxPrice,
    filteredProducts,
    getCategoryName,
    getCartQuantity,
    addToCart,
    updateQuantity
  } = useProductCatalog();

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <Helmet>
        <title>الخامات والمنتجات</title>
      </Helmet>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-20 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-6">
                <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                <span>خيارات التصفية</span>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="ابحث عن خامة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-4 text-sm outline-none focus:border-blue-500  transition dark:border-gray-800 dark:bg-slate-950"
                />
                <Search className="absolute top-3 right-3 h-4 w-4 text-gray-400" />
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  الأقسام
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleCategorySelect("all")}
                    className={`text-right px-3 py-2 text-sm rounded-lg transition ${
                      categoryId === "all"
                        ? "bg-blue-50 text-blue-600 font-bold dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    الكل
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id.toString())}
                      className={`text-right px-3 py-2 text-sm rounded-lg transition ${
                        categoryId === cat.id.toString()
                          ? "bg-blue-50 text-blue-600 font-bold dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  السعر الأقصى (ج.م)
                </h3>
                <input
                  type="number"
                  placeholder="مثال: 2000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white transition dark:border-gray-800 dark:bg-slate-950"
                />
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {getCategoryName()}
                <span className="mr-2 text-sm font-normal text-gray-500">
                  ({filteredProducts.length} صنف )
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="flex h-60 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-slate-900">
                <p className="text-gray-500">
                  لا توجد خامات تطابق خيارات التصفية الحالية.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((p) => {
                  const qtyInCart = getCartQuantity(p.id);

                  return (
                    <div
                      key={p.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition dark:border-gray-800 dark:bg-slate-900"
                    >
                      {/* Image Area */}
                      <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <ImageIcon className="text-slate-300 h-16 w-16" />
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span className="rounded-full bg-white/90 backdrop-blur px-2.5 py-0.5 text-xs font-semibold text-blue-600 shadow-sm">
                            {p.category?.name}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                          {p.stock <= 5 && p.stock > 0 && (
                            <span className="text-xs font-semibold text-red-600 dark:text-red-400 animate-pulse bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">
                              مخزون منخفض!
                            </span>
                          )}
                          {p.stock === 0 && (
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              غير متوفر حالياً
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition dark:text-white dark:group-hover:text-blue-400 line-clamp-1">
                          <Link to={`/products/${p.id}`}>{p.name}</Link>
                        </h3>

                        <p className="mt-1 text-xs text-gray-500 line-clamp-2 dark:text-gray-400 flex-1">
                          {p.description}
                        </p>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                            وحدة التعبئة:{" "}
                            <span className="font-semibold text-gray-600 dark:text-gray-300">
                              {p.unit}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                              {parseFloat(p.price).toLocaleString()}{" "}
                              <span className="text-xs font-normal text-gray-500">
                                ج.م
                              </span>
                            </span>

                            <div className="flex items-center gap-2">
                              <WishlistButton productId={p.id} productImage={p.image} className="mx-2" />
                              <Link
                                to={`/products/${p.id}`}
                                className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700"
                                title="التفاصيل والمواصفات"
                              >
                                <Info className="h-4 w-4" />
                              </Link>

                              {qtyInCart > 0 ? (
                                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-slate-800">
                                  <button
                                    onClick={() =>
                                      updateQuantity(p.id, qtyInCart - 1)
                                    }
                                    className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 rounded-r-lg transition dark:text-gray-300 dark:hover:bg-slate-700"
                                  >
                                    -
                                  </button>
                                  <span className="px-2.5 text-sm font-bold text-gray-800 dark:text-white">
                                    {qtyInCart}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(p.id, qtyInCart + 1)
                                    }
                                    className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 rounded-l-lg transition dark:text-gray-300 dark:hover:bg-slate-700"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(p, 1)}
                                  disabled={p.stock === 0}
                                  className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white shadow-sm transition ${
                                    p.stock === 0
                                      ? "bg-gray-300 cursor-not-allowed"
                                      : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                                >
                                  <ShoppingCart className="h-3.5 w-3.5" />
                                  أضف للسلة
                                </button>
                              )}
                            </div>
                          </div>

                          <ReactionBar productId={p.id} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

