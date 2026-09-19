import { useEffect, useState } from "react";
import { ArrowRight, ShoppingCart, Loader2, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../Api/Api";
import { useCart } from "../../../context/CartContext";
import { motion } from "framer-motion";
import { flyToCart } from "../../../utils/animations";
import ReactionBar from "../ReactionBar/ReactionBar";
import WishlistButton from "../WishlistButton/WishlistButton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get(`${baseUrl}/products`)
      .then((res) => {
        // Take first 4 products for the featured section
        setProducts(res.data.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20 relative bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-50 to-transparent dark:from-blue-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              الخامات الأكثر طلباً
            </h2>
            <p className="mt-4 max-w-2xl text-gray-500 dark:text-gray-400 text-lg">
              مجموعة من أفضل المواد الخام التي يعتمد عليها كبرى مصانع المنظفات
              في السوق.
            </p>
          </div>
          <Link
            to="/products"
            className="group mt-6 sm:mt-0 inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
          >
            جميع الخامات
            <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {products.map((p) => (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8 }}
                key={p.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 dark:border-gray-800 dark:bg-slate-900"
              >
                <div className="h-56 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden relative">
                  {p.image ? (
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="text-slate-300 dark:text-slate-600 h-16 w-16" />
                  )}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <span className="rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700">
                      {p.category?.name}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400 line-clamp-1">
                    <Link to={`/products/${p.id}`}>{p.name}</Link>
                  </h3>

                  <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2 dark:text-gray-400 flex-1">
                    {p.description || "خامة تصنيع عالية الجودة."}
                  </p>

                  <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                    <div className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5 flex items-center gap-1">
                      وحدة التعبئة:{" "}
                      <span className="font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                        {p.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        {parseFloat(p.price).toLocaleString()}{" "}
                        <span className="text-sm font-bold text-gray-400">
                          ج.م
                        </span>
                      </span>

                      <div className="flex gap-2 items-center">
                        <WishlistButton productId={p.id} productImage={p.image} />
                        <motion.button
                          whileHover={p.stock > 0 ? { scale: 1.05 } : {}}
                          whileTap={p.stock > 0 ? { scale: 0.95 } : {}}
                          onClick={(e) => {
                            addToCart(p, 1);
                            flyToCart(e, p.image);
                          }}
                          disabled={p.stock === 0}
                          className={`p-3 rounded-xl transition-colors shadow-sm ${
                            p.stock === 0
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800"
                              : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:hover:bg-blue-500 dark:hover:text-white"
                          }`}
                          title={p.stock === 0 ? "غير متوفر" : "أضف للسلة"}
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <ReactionBar productId={p.id} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
