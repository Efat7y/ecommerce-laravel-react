import { useState, useEffect } from "react";
import { baseUrl } from "../../Api/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import axios from "axios";
import { getToken, getUser } from "../../utils/auth";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  useEffect(() => {
    // If they don't have a token, or their status is already active, redirect them
    if (!token) {
      navigate("/login");
    } else if (user && user.status !== "unverified") {
      navigate("/");
    }
  }, [token, user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("يرجى إدخال الكود المكون من 6 أرقام");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}/verify-otp`, 
        { otp }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local storage user status
      const updatedUser = { ...user, status: "active" };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success(res.data.message || "تم تأكيد الحساب بنجاح!");
      window.location.href = "/"; // Reload to refresh app state
    } catch (err) {
      toast.error(
        err.response?.data?.message || "الكود غير صحيح، يرجى المحاولة مرة أخرى."
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
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            تأكيد رقم الهاتف
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            لقد أرسلنا كود التفعيل المكون من 6 أرقام إلى رقم هاتفك/الواتساب. يرجى إدخاله أدناه.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              كود التفعيل (OTP)
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength="6"
              required
              className="block w-full text-center tracking-[1em] text-2xl font-bold rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 transition-colors"
              placeholder="••••••"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="group relative flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transition-all dark:focus:ring-offset-slate-800"
          >
            {loading ? "جاري التأكيد..." : "تأكيد الحساب"}
          </button>
        </form>
      </div>
    </div>
  );
}
