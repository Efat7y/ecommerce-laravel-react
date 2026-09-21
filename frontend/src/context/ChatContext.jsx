import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/Api/Api';
import { getToken } from '@/utils/auth';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  // Array of active chats. Each is an object: { user, conversation, isMinimized }
  const [activeChats, setActiveChats] = useState(() => {
    try {
      const saved = localStorage.getItem('activeChats');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('activeChats', JSON.stringify(activeChats));
  }, [activeChats]);

  const startChat = async (user) => {
    // Check if chat is already open
    if (activeChats.find(chat => chat.user.id === user.id)) {
      // Just ensure it's not minimized
      setActiveChats(prev => prev.map(chat => 
        chat.user.id === user.id ? { ...chat, isMinimized: false } : chat
      ));
      return;
    }

    // Add to active chats optimistically
    const newChat = { user, conversation: null, isMinimized: false };
    setActiveChats(prev => [...prev, newChat]);

    const token = getToken();
    if (!token) {
      import('sonner').then(module => module.toast.error('يرجى تسجيل الدخول أولاً للتمكن من المراسلة'));
      setActiveChats(prev => prev.filter(chat => chat.user.id !== user.id));
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/chat/start`, {
        user_id: user.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the chat with the real conversation object
      setActiveChats(prev => prev.map(chat => 
        chat.user.id === user.id ? { ...chat, conversation: res.data } : chat
      ));
    } catch (err) {
      console.error('Failed to start chat', err);
      // Remove it if it failed
      setActiveChats(prev => prev.filter(chat => chat.user.id !== user.id));
      import('sonner').then(module => module.toast.error(err.response?.data?.message || 'حدث خطأ في المحادثة'));
    }
  };

  const closeChat = (userId) => {
    setActiveChats(prev => prev.filter(chat => chat.user.id !== userId));
  };

  const toggleMinimize = (userId) => {
    setActiveChats(prev => prev.map(chat => 
      chat.user.id === userId ? { ...chat, isMinimized: !chat.isMinimized } : chat
    ));
  };

  return (
    <ChatContext.Provider value={{ activeChats, startChat, closeChat, toggleMinimize }}>
      {children}
    </ChatContext.Provider>
  );
};


