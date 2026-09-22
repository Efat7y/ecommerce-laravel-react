import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { MessageCircle, User } from 'lucide-react';
import { baseUrl } from '@/Api/Api';
import { getToken } from '@/utils/auth';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessagesDropdown() {
  const { startChat } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchConversations = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get(`${baseUrl}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
      
      const totalUnread = res.data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
      setUnreadCount(totalUnread);
    } catch (err) {
      if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          window.location.reload();
      } else {
          console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Poll inbox every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
      >
        <MessageCircle className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-2 w-80 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[9999]"
            dir="rtl"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">الرسائل</h3>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                  لا توجد رسائل بعد.
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherUser = conv.other_user;
                  if (!otherUser) return null;
                  
                  return (
                    <div 
                      key={conv.id}
                      onClick={() => {
                        startChat(otherUser);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#3a3b3c] cursor-pointer transition border-b border-gray-50 dark:border-gray-800 last:border-0 relative"
                    >
                      {otherUser.avatar ? (
                        <img 
                          src={otherUser.avatar.startsWith('http') ? otherUser.avatar : `http://127.0.0.1:8000${otherUser.avatar}`} 
                          alt={otherUser.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                          {otherUser.name}
                        </h4>
                        <p className={`text-xs truncate mt-0.5 ${conv.unread_count > 0 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                          {conv.latest_message ? conv.latest_message.message : 'بدأت المحادثة'}
                        </p>
                      </div>

                      {conv.unread_count > 0 && (
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
