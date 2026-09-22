import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { X, Send, User, Minus } from 'lucide-react';
import { baseUrl } from '@/Api/Api';
import { getToken } from '@/utils/auth';
import axios from 'axios';

// Individual Chat Window / Bubble
function ChatInstance({ chat, index, totalExpanded }) {
  const { closeChat, toggleMinimize } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isMinimizedRef = useRef(chat.isMinimized);

  useEffect(() => {
    isMinimizedRef.current = chat.isMinimized;
  }, [chat.isMinimized]);

  const fetchMessages = async () => {
    if (!chat.conversation) return;
    const token = getToken();
    if (!token) {
        closeChat(chat.user.id);
        return;
    }
    try {
      const res = await axios.get(`${baseUrl}/chat/conversations/${chat.conversation.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages || []);
      setIsTyping(res.data.is_typing || false);
      if (!isMinimizedRef.current) {
        await axios.post(`${baseUrl}/chat/conversations/${chat.conversation.id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
          closeChat(chat.user.id);
      }
    }
  };

  useEffect(() => {
    if (chat.conversation) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [chat.conversation]);

  useEffect(() => {
    if (!chat.isMinimized && chat.conversation) {
      axios.post(`${baseUrl}/chat/conversations/${chat.conversation.id}/read`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMessages(prev => prev.map(m => m.sender_id === chat.user.id ? { ...m, is_read: true } : m));
    }
  }, [chat.isMinimized]);

  useEffect(() => {
    if (messagesEndRef.current && !chat.isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chat.isMinimized]);

  
  const handleTyping = () => {
    if (typingTimeoutRef.current) return;
    axios.post(`${baseUrl}/chat/conversations/${chat.conversation.id}/typing`, {}, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat.conversation) return;

    const token = getToken();
    const messageText = newMessage;
    setNewMessage('');

    const tempMsg = {
      id: Date.now(),
      sender_id: -1, 
      message: messageText,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await axios.post(`${baseUrl}/chat/conversations/${chat.conversation.id}/messages`, {
        message: messageText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const userAvatar = chat.user.avatar;
  
  // If minimized, render a Chat Head (Bubble)
  if (chat.isMinimized) {
    return (
      <div 
        className="w-14 h-14 rounded-full shadow-2xl bg-white border border-gray-200 cursor-pointer flex items-center justify-center relative hover:scale-105 transition-transform"
        onClick={() => toggleMinimize(chat.user.id)}
      >
        {messages.filter(m => m.sender_id === chat.user.id && !m.is_read).length > 0 && (
          <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center z-20 shadow-lg">
            {messages.filter(m => m.sender_id === chat.user.id && !m.is_read).length}
          </span>
        )}
        <button 
          className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5 z-10 hover:bg-red-500"
          onClick={(e) => { e.stopPropagation(); closeChat(chat.user.id); }}
        >
          <X className="w-3 h-3" />
        </button>
        {userAvatar ? (
          <img 
            src={userAvatar.startsWith('http') ? userAvatar : `http://127.0.0.1:8000${userAvatar}`} 
            alt={chat.user.name} 
            className="w-full h-full rounded-full object-cover"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"; }}
          />
        ) : (
          <User className="w-6 h-6 text-gray-500" />
        )}
      </div>
    );
  }

  // Expanded Window
  return (
    <div className="w-[300px] shadow-2xl rounded-t-xl bg-white dark:bg-[#242526] border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[400px]" dir="rtl">
      {/* Header */}
      <div 
        className="bg-blue-600 text-white p-3 flex items-center justify-between cursor-pointer"
        onClick={() => toggleMinimize(chat.user.id)}
      >
        <div className="flex items-center gap-2">
          {userAvatar ? (
            <img 
              src={userAvatar.startsWith('http') ? userAvatar : `http://127.0.0.1:8000${userAvatar}`} 
              alt={chat.user.name} 
              className="w-8 h-8 rounded-full object-cover border border-white/20"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"; }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <span className="font-semibold text-sm truncate w-32">{chat.user.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            className="p-1 hover:bg-white/20 rounded transition"
            onClick={(e) => { e.stopPropagation(); toggleMinimize(chat.user.id); }}
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            className="p-1 hover:bg-white/20 rounded transition"
            onClick={(e) => { e.stopPropagation(); closeChat(chat.user.id); }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-[#18191a] flex flex-col gap-2">
        {!chat.conversation ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 text-xs mt-4">
            ابدأ المحادثة مع {chat.user.name}...
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id !== chat.user.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-bl-none' 
                    : 'bg-white dark:bg-[#3a3b3c] text-gray-800 dark:text-gray-200 rounded-br-none border border-gray-100 dark:border-gray-700'
                }`}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
                {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#3a3b3c] border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-2 flex gap-1.5 items-center rounded-br-none w-fit">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSend} className="p-2 bg-white dark:bg-[#242526] border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
          placeholder="اكتب رسالة..."
          className="flex-1 bg-gray-100 dark:bg-[#3a3b3c] text-gray-900 dark:text-white rounded-full px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <Send className="w-4 h-4 rtl:-scale-x-100" />
        </button>
      </form>
    </div>
  );
}

export default function FloatingChat() {
  const { activeChats } = useChat();

  if (!activeChats || activeChats.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-16 z-[999999] flex items-end gap-3 pointer-events-none p-4">
      {activeChats.map((chat, index) => (
        <div key={chat.user.id} className="pointer-events-auto">
          <ChatInstance 
            chat={chat} 
            index={index} 
            totalExpanded={activeChats.filter(c => !c.isMinimized).length} 
          />
        </div>
      ))}
    </div>
  );
}


