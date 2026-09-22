import re

with open('frontend/src/components/Website/FloatingChat/FloatingChat.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix fetchMessages in FloatingChat
fetch_messages_old = """  const fetchMessages = async () => {
    if (!chat.conversation) return;
    const token = getToken();
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
      console.error(err);
    }
  };"""

fetch_messages_new = """  const fetchMessages = async () => {
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
  };"""

content = content.replace(fetch_messages_old, fetch_messages_new)

with open('frontend/src/components/Website/FloatingChat/FloatingChat.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('frontend/src/components/Website/FloatingChat/MessagesDropdown.jsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

# Fix fetchConversations in MessagesDropdown
fetch_convs_old = """  const fetchConversations = async () => {
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
      console.error(err);
    }
  };"""

fetch_convs_new = """  const fetchConversations = async () => {
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
      // Ignore 401 to prevent console spam when unauthenticated
      if (err.response && err.response.status !== 401) {
          console.error(err);
      }
    }
  };"""

content2 = content2.replace(fetch_convs_old, fetch_convs_new)

with open('frontend/src/components/Website/FloatingChat/MessagesDropdown.jsx', 'w', encoding='utf-8') as f:
    f.write(content2)

print("Fixed API calls in Chat components")
