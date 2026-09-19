import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Heart, Loader2, ShoppingCart, Info, ImageIcon } from "lucide-react";
import Header from "@/components/Website/layout/Header/Header";
import { baseUrl } from "@/Api/Api";
import { getToken } from "@/utils/auth";
import { useCart } from "@/context/CartContext";
import { useInteraction } from "@/context/InteractionContext";
import WishlistButton from "@/components/Website/WishlistButton/WishlistButton";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const { addToCart } = useCart();
  const { wishlistIds } = useInteraction(); // Listen to global changes

  const fetchWishlist = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${baseUrl}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  // Filter out items that were removed globally
  const displayItems = wishlistItems.filter((item) =>
    wishlistIds.includes(item.product_id),
  );

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col"
      dir="rtl"
    >
      <Helmet>
        <title>المفضلة | قائمة الرغبات</title>
      </Helmet>
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-red-500 h-8 w-8" fill="currentColor" />
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            قائمة المفضلة
          </h1>
        </div>

        {!token ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <Heart className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">يرجى تسجيل الدخول</h2>
            <p className="text-gray-500 mb-6">
              يجب عليك تسجيل الدخول لعرض قائمة المفضلة الخاصة بك.
            </p>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 font-bold transition"
            >
              تسجيل الدخول
            </Link>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <Heart className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">قائمتك فارغة</h2>
            <p className="text-gray-500 mb-6">
              لم تقم بإضافة أي منتجات إلى المفضلة حتى الآن.
            </p>
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 font-bold transition"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayItems.map((item) => {
              const p = item.product;
              if (!p) return null;

              return (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition dark:border-gray-800 dark:bg-slate-900"
                >
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
                    <div className="absolute top-3 right-3 w-65 flex  gap-2 justify-between items-center">
                      <span className="rounded-full bg-white/90 backdrop-blur px-2.5 py-0.5 text-xs font-semibold text-blue-600 shadow-sm">
                        {p.category?.name}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition">
                      <Link to={`/products/${p.id}`}>{p.name}</Link>
                    </h3>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                      <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                        {parseFloat(p.price).toLocaleString()}{" "}
                        <span className="text-xs font-bold text-gray-500">
                          ج.م
                        </span>
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/products/${p.id}`}
                          className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700"
                        >
                          <Info className="h-4 w-4" />
                        </Link>
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
                          إضافة للسلة
                        </button>
                        <WishlistButton productId={p.id} productImage={p.image} className="mx-2" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

