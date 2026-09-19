import { CheckCircle2, ShieldCheck, Zap } from "lucide-react"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
}

const TrustBadges = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 relative overflow-hidden">
        
        {/* Subtle animated background */}
        <motion.div 
          animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-10 sm:grid-cols-3 text-center"
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-6 shadow-sm group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900/20 transition-all duration-300"
              >
                <ShieldCheck className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">نقاء كيميائي مضمون</h3>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                نضمن تطابق خاماتنا مع المواصفات القياسية وخلوها من الشوائب لضمان جودة تصنيع منتجاتك.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mb-6 shadow-sm group-hover:shadow-indigo-200 dark:group-hover:shadow-indigo-900/20 transition-all duration-300"
              >
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">أسعار جملة تنافسية</h3>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                نوفر أفضل تسعير لبراميل الخامات والمواد الفعالة في السوق مع حوافز وخصومات للفواتير الكبيرة.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mb-6 shadow-sm group-hover:shadow-purple-200 dark:group-hover:shadow-purple-900/20 transition-all duration-300"
              >
                <Zap className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">توصيل سريع لكافة المحافظات</h3>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                شحن سريع وآمن للمواد السائلة والصلبة بأسطول شحن مناسب مباشرة لمصنعك أو محلك.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
  )
}

export default TrustBadges
