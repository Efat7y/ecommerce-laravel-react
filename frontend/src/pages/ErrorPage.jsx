import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, Home, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function ErrorPage({ type = '404' }) {
  const is403 = type === '403';
  
  const title = is403 ? "غير مصرح لك بالدخول" : "الصفحة غير موجودة";
  const errorCode = is403 ? "403" : "404";
  const message = is403 
    ? "عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة."
    : "عذراً، الرابط الذي تحاول الوصول إليه غير صحيح أو تم نقله.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4" dir="rtl">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      
      <div className="text-center max-w-md w-full relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full blur-xl scale-150 animate-pulse"></div>
            <AlertOctagon className="w-24 h-24 text-red-500 relative z-10" />
          </div>
        </div>
        
        <h1 className="text-8xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter drop-shadow-sm">
          {errorCode}
        </h1>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all shadow-sm"
          >
            <ArrowRight className="w-5 h-5" />
            الرجوع للخلف
          </button>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed top-1/4 -right-20 w-64 h-64 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-1/4 -left-20 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
