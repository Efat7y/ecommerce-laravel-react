import { useState, useEffect } from "react";
import axios from "axios";
import { Star, MessageCircle, Send, Loader2 } from "lucide-react";
import { baseUrl } from "@/Api/Api";
import { getToken } from "@/utils/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const token = getToken();

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${baseUrl}/products/${productId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("يجب تسجيل الدخول لإضافة تقييم");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${baseUrl}/products/${productId}/reviews`, 
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء إضافة التقييم");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Calculate average rating
  const avgRating = reviews.length 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <section className="mt-12 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <MessageCircle className="text-blue-500" />
            آراء وتقييمات العملاء
          </h2>
          <p className="text-gray-500 mt-2">ماذا يقول عملاؤنا عن هذا المنتج؟</p>
        </div>
        
        {reviews.length > 0 && (
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-2xl">
            <div className="text-4xl font-black text-gray-900 dark:text-white">{avgRating}</div>
            <div className="flex flex-col gap-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(avgRating) ? "currentColor" : "none"} className={i < Math.round(avgRating) ? "" : "text-gray-300 dark:text-gray-600"} />
                ))}
              </div>
              <span className="text-xs text-gray-500">من {reviews.length} تقييم</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <Star className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">لا توجد تقييمات حتى الآن. كُن أول من يقيم هذا المنتج!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {reviews.map(review => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={review.id} 
                    className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {review.user?.name?.charAt(0) || '؟'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">{review.user?.name || 'مستخدم'}</div>
                          <div className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('ar-EG')}</div>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300 dark:text-gray-600"} />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 sticky top-24">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">أضف تقييمك</h3>
            {token ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تقييمك للمنتج</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          fill={star <= rating ? "currentColor" : "none"} 
                          className={star <= rating ? "text-amber-400" : "text-gray-300 dark:text-gray-600"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تعليقك (اختياري)</label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white resize-none"
                    placeholder="ما رأيك في هذا المنتج؟..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-70"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  نشر التقييم
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-4">يجب عليك تسجيل الدخول لتتمكن من إضافة تقييم.</p>
                <a href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 text-sm font-bold transition">
                  تسجيل الدخول
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
