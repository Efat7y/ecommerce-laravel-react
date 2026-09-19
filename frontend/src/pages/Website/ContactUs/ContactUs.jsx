import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Header from "@/components/Website/layout/Header/Header";
import { baseUrl } from "@/Api/Api";
import { useSettings } from "@/context/SettingsContext";

export default function ContactUs() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/contact`, form);
      toast.success(res.data.message);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error("حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col" dir="rtl">
      <Helmet>
        <title>تواصل معنا</title>
      </Helmet>
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">تواصل معنا</h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            نحن هنا لمساعدتك والإجابة على كافة استفساراتك. لا تتردد في مراسلتنا في أي وقت.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                <Phone />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">اتصل بنا</h3>
                <p className="text-sm text-gray-500 mt-1">متواجدون للرد على اتصالاتكم</p>
                <div className="mt-2 font-semibold text-gray-800 dark:text-gray-200" dir="ltr">{settings.contact_phone || "+20 123 456 7890"}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0">
                <Mail />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">راسلنا</h3>
                <p className="text-sm text-gray-500 mt-1">للاستفسارات والشكاوى</p>
                <div className="mt-2 font-semibold text-gray-800 dark:text-gray-200">{settings.contact_email || "support@example.com"}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">العنوان</h3>
                <p className="text-sm text-gray-500 mt-1">المقر الرئيسي للشركة</p>
                <div className="mt-2 font-semibold text-gray-800 dark:text-gray-200">{settings.contact_address || "القاهرة، مصر"}</div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">أرسل رسالة</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الاسم بالكامل <span className="text-red-500">*</span></label>
                  <input required name="name" value={form.name} onChange={handleChange} type="text" className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">رقم الهاتف <span className="text-red-500">*</span></label>
                  <input required name="phone" value={form.phone} onChange={handleChange} type="text" className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني (اختياري)</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الموضوع (اختياري)</label>
                  <input name="subject" value={form.subject} onChange={handleChange} type="text" className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الرسالة <span className="text-red-500">*</span></label>
                <textarea required name="message" value={form.message} onChange={handleChange} rows="5" className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white resize-none"></textarea>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-70">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

