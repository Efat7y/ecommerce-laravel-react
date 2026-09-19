import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, MailOpen, Trash2, CheckCircle, Search, Loader2 } from "lucide-react";
import { baseUrl } from "@/Api/Api";
import { getToken } from "@/utils/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const token = getToken();

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${baseUrl}/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء جلب الرسائل");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${baseUrl}/admin/messages/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("تم تحديث حالة الرسالة");
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="text-blue-500" />
            صندوق الرسائل
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            إدارة رسائل واستفسارات العملاء
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="بحث بالاسم، الإيميل أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition"
            dir="rtl"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500 h-5 w-5" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
        {/* Messages List */}
        <div className="w-full lg:w-1/3 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50">
            <h2 className="font-bold text-white">الرسائل الواردة</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-10 text-gray-500">لا توجد رسائل</div>
            ) : (
              filteredMessages.map(msg => (
                <div 
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-xl cursor-pointer transition border ${
                    selectedMessage?.id === msg.id 
                      ? 'bg-blue-900/30 border-blue-800' 
                      : 'bg-slate-800/50 border-transparent hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold ${!msg.is_read ? 'text-white' : 'text-gray-400'}`}>
                      {msg.name}
                    </h3>
                    {!msg.is_read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mb-2">{msg.subject || 'بدون موضوع'}</p>
                  <div className="text-[10px] text-gray-500">
                    {new Date(msg.created_at).toLocaleDateString('ar-EG')} - {new Date(msg.created_at).toLocaleTimeString('ar-EG')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="w-full lg:w-2/3 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/20">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{selectedMessage.subject || 'بدون موضوع'}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="font-semibold text-gray-300">{selectedMessage.name}</span>
                    <span>{selectedMessage.phone}</span>
                    {selectedMessage.email && <span>{selectedMessage.email}</span>}
                  </div>
                </div>
                {!selectedMessage.is_read && (
                  <button 
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                    className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-900/30 px-3 py-1.5 rounded-lg transition"
                  >
                    <CheckCircle size={14} />
                    تحديد كمقروءة
                  </button>
                )}
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="p-4 border-t border-slate-800 text-xs text-gray-500 text-left" dir="ltr">
                {new Date(selectedMessage.created_at).toLocaleString('en-US')}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
              <MailOpen className="w-16 h-16 text-slate-700 mb-4" />
              <p>اختر رسالة من القائمة لعرض محتواها</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
