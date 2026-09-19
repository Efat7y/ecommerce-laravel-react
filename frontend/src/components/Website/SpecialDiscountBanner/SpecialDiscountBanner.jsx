import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SpecialDiscountBanner = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-blue-700 via-indigo-700 to-blue-800 px-6 py-10 shadow-2xl shadow-blue-900/20 sm:px-12 sm:py-14 text-white border border-blue-600/30"
      >
        <div className="relative z-10 max-w-3xl">
          <motion.h2 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-extrabold sm:text-4xl tracking-tight leading-tight"
          >
            خصومات ضخمة على طلبات الجملة!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4 text-blue-100/90 max-w-xl text-lg leading-relaxed font-medium"
          >
            احصل على خصم <span className="text-amber-300 font-bold text-xl">5%</span> تلقائياً عند تجاوز فاتورتك 5,000 ج.م،
            وخصم مذهل <span className="text-amber-300 font-bold text-xl">10%</span> عند تجاوزك 10,000 ج.م!
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex gap-4"
          >
            <Link
              to="/products"
              className="inline-flex items-center rounded-xl bg-white px-6 py-3.5 text-base font-bold text-blue-800 hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
            >
              اطلب الخامات الآن
            </Link>
          </motion.div>
        </div>
        
        {/* Animated Decorative shapes */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 translate-x-12 -translate-y-12 h-80 w-80 rounded-full bg-blue-500/40 blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-0 -translate-x-12 translate-y-12 h-64 w-64 rounded-full bg-purple-500/40 blur-3xl pointer-events-none" 
        />
      </motion.div>
    </section>
  );
};

export default SpecialDiscountBanner;
