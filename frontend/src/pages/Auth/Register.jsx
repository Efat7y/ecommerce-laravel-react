import axios from "axios";
import { useState } from "react";
import { baseUrl, REGISTER } from "../../Api/Api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserPlus, LogIn } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/${REGISTER}`, form);
      // Immediately log them in so they can access the verify-otp route
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Clear the cart for new users
      localStorage.removeItem("cart");

      toast.success(res.data.message || "تم إنشاء الحساب بنجاح، يرجى تفعيل حسابك");
      if (res.data.dev_otp) {
        console.log("OTP (For Dev):", res.data.dev_otp);
        localStorage.setItem("dev_otp", res.data.dev_otp);
        toast.info(`للتطوير: كود التفعيل هو ${res.data.dev_otp}`);
      }
      
      // Need to reload window to update auth context easily
      window.location.href = "/verify-otp";
    } catch (err) {
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus size={28} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            انضم إلينا الآن للوصول إلى كافة المنتجات
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الاسم الكامل
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleFormChange}
                required
                className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 transition-colors"
                placeholder="الاسم الكامل"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                البريد الإلكتروني
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                required
                className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 transition-colors"
                placeholder="example@domain.com"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                رقم الهاتف (الواتساب)
              </label>
              <input
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleFormChange}
                required
                className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 transition-colors"
                placeholder="01xxxxxxxxx"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                كلمة المرور
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleFormChange}
                required
                className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white transition-colors"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors dark:ring-offset-slate-900"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">لديك حساب بالفعل؟ </span>
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
          >
            <LogIn size={16} />
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
