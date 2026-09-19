import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../Api/Api";
import { motion } from "framer-motion";

const defaultIcons = ["🧪", "🌿", "🎨", "💧", "📦", "🌟"];
const defaultColors = [
  "from-blue-500/10 to-cyan-500/10 hover:border-blue-500",
  "from-purple-500/10 to-pink-500/10 hover:border-purple-500",
  "from-amber-500/10 to-orange-500/10 hover:border-amber-500",
  "from-emerald-500/10 to-teal-500/10 hover:border-emerald-500",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${baseUrl}/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="categories" className="py-20 relative overflow-hidden bg-white dark:bg-slate-900">
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            تصفح حسب فئات المواد الخام
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
            قمنا بتنظيم الخامات في أقسام متخصصة لمساعدتك في العثور على ما تحتاجه لتركيباتك الكيميائية بكل سهولة.
          </p>
        </motion.div>

        {loading ? (
          <div className="mt-16 flex justify-center text-blue-600">
            <Loader2 className="animate-spin h-10 w-10" />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {categories.map((cat, index) => {
              const bg = defaultColors[index % defaultColors.length];
              const icon = defaultIcons[index % defaultIcons.length];

              return (
                <motion.div
                  key={cat.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br p-6 shadow-sm hover:shadow-xl transition-all duration-300 dark:border-gray-800 ${bg}`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 dark:bg-white/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
                  
                  {cat.image ? (
                    <motion.img
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      src={cat.image}
                      alt={cat.name}
                      className="w-16 h-16 object-cover rounded-full mb-5 shadow-md border-2 border-white dark:border-gray-800"
                    />
                  ) : (
                    <motion.span 
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="text-5xl block mb-5 drop-shadow-sm"
                    >
                      {icon}
                    </motion.span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {cat.description || "لا يوجد وصف متاح لهذا القسم."}
                  </p>
                  
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all"
                  >
                    عرض الخامات
                    <ArrowRight className="h-4 w-4 rotate-180" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
