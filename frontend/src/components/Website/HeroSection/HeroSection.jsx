import { ArrowRight, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Glow Effects */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap className="h-3.5 w-3.5" /> 
            </motion.div>
            أفضل جودة خامات في مصر
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-indigo-200"
          >
            اصنع منتجك بأعلى كفاءة <br />
            <motion.span 
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400"
            >
              باستخدام خامات الفتح النقية
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400"
          >
            نوفر لكم أجود أنواع المواد الخام كالتكسابون والسلفونيك والكمبرلان وغيرها من الزيوت العطرية الفرنسية الفاخرة والألوان الجذابة. أسعار خاصة للكميات والمصانع.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              تصفح المنتجات والأسعار
              <motion.div
                whileHover={{ x: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center rounded-xl bg-white border border-gray-200 px-6 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition dark:bg-slate-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-slate-800 hover:scale-105 transform duration-200"
            >
              استكشف الأقسام
            </a>
          </motion.div>
        </div>
      </section>
  )
}

export default HeroSection
