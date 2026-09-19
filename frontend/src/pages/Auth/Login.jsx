import axios from "axios";
import { LOGIN, baseUrl } from "../../Api/Api";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setToken, setUser } from "../../utils/auth";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/${LOGIN}`, form);
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success("تم تسجيل الدخول بنجاح");
      
      if (res.data.user?.status === "unverified") {
        navigate("/verify-otp");
        return;
      }

      const searchParams = new URLSearchParams(location.search);
      const redirect = searchParams.get("redirect");
      
      if (redirect) {
        navigate("/" + redirect);
      } else {
        navigate(res.data.user?.role === "admin" ? "/dashboard" : "/");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى."
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
            <LogIn size={28} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            مرحباً بك مجدداً، يرجى إدخال بيانات حسابك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  البريد الإلكتروني أو رقم الهاتف
                </label>
                <input
                  name="identifier"
                  type="text"
                  value={form.identifier}
                  onChange={handleFormChange}
                  required
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 transition-colors"
                  placeholder="user@example.com أو 01xxxxxxxxx"
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
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">ليس لديك حساب؟ </span>
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
          >
            <UserPlus size={16} />
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
