import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { baseUrl } from "@/Api/Api";
import { getToken } from "@/utils/auth";
import { useChat } from "../../../context/ChatContext";
import { ThumbsUp, X, User, MessageCircle, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const reactions = [
  { type: "like", icon: "👍", color: "text-blue-500", label: "أعجبني" },
  { type: "love", icon: "❤️", color: "text-red-500", label: "أحببته" },
  { type: "wow", icon: "😲", color: "text-yellow-500", label: "واو" },
  { type: "haha", icon: "😂", color: "text-yellow-500", label: "هاها" },
  { type: "sad", icon: "😢", color: "text-yellow-500", label: "حزين" },
  { type: "angry", icon: "😡", color: "text-orange-500", label: "غاضب" },
];

export default function ReactionBar({ productId }) {
  const [counts, setCounts] = useState([]);
  const [userReaction, setUserReaction] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  
  // Tooltip state for individual summary icons
  const [hoveredSummaryIcon, setHoveredSummaryIcon] = useState(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const hidePopupRef = useRef(null);
  const hideSummaryIconRef = useRef(null);
  const { startChat } = useChat();
  const token = getToken();

  useEffect(() => {
    fetchReactions();
  }, [productId]);

  const fetchReactions = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/products/${productId}/reactions`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setCounts(res.data.counts || []);
      setUserReaction(res.data.user_reaction);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReact = async (type) => {
    if (!token) return;

    const previousReaction = userReaction;
    setUserReaction(type === userReaction ? null : type);

    try {
      await axios.post(
        `${baseUrl}/products/${productId}/react`,
        { type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchReactions();
    } catch (err) {
      setUserReaction(previousReaction);
    }
    setShowPopup(false);
  };

  const openReactionModal = async () => {
    setShowModal(true);
    setModalLoading(true);
    setActiveTab("all");
    try {
      const res = await axios.get(`${baseUrl}/products/${productId}/reactions/details`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setModalData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const totalReactions = counts.reduce((sum, item) => sum + item.count, 0);

  // Find top 3 reactions by count
  const topReactions = [...counts]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .filter((c) => c.count > 0);

  const activeReactionObj = reactions.find((r) => r.type === userReaction);

  // Filter modal data based on active tab
  const filteredModalData = activeTab === "all" 
    ? modalData 
    : modalData.filter(r => r.type === activeTab);

  return (
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 relative z-10">
      
      {/* Summary Section (Left visual, Right DOM in RTL) */}
      <div 
        className="flex items-center text-xs text-gray-500 gap-2 cursor-pointer hover:underline"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (totalReactions > 0) openReactionModal(); }}
      >
        <div className="flex -space-x-1 space-x-reverse relative">
          {topReactions.length > 0 ? (
            topReactions.map((c, i) => {
              const rObj = reactions.find(r => r.type === c.type);
              if (!rObj) return null;
              return (
                <div 
                  key={c.type}
                  className="relative z-10"
                  onMouseEnter={() => {
                    clearTimeout(hideSummaryIconRef.current);
                    setHoveredSummaryIcon(c.type);
                  }}
                  onMouseLeave={() => {
                    hideSummaryIconRef.current = setTimeout(() => setHoveredSummaryIcon(null), 200);
                  }}
                >
                  <span className="text-sm bg-white dark:bg-slate-800 rounded-full shadow-sm block relative">
                    {rObj.icon}
                  </span>

                  {/* Facebook-style Vertical Tooltip for specific icon */}
                  <AnimatePresence>
                    {hoveredSummaryIcon === c.type && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        // Keep tooltip strictly above this specific icon, absolutely positioned
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#f0f2f5] dark:bg-[#242526] text-gray-900 dark:text-gray-200 text-sm p-3 rounded-xl shadow-2xl z-[99999] min-w-[140px] text-center border border-gray-200 dark:border-gray-700 pointer-events-none"
                      >
                        <div className="font-bold text-gray-900 dark:text-white mb-2 text-base">
                          {rObj.label}
                        </div>
                        <div className="flex flex-col gap-1.5 text-[13px] font-medium opacity-90">
                          {c.users?.map((user, idx) => (
                            <span key={idx}>{user}</span>
                          ))}
                          {c.count > (c.users?.length || 0) && (
                            <span className="mt-1 font-bold text-gray-600 dark:text-gray-400">
                              و {c.count - c.users.length} شخص آخر...
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <span className="text-gray-400 text-sm">👍</span>
          )}
        </div>
        <span className="text-sm font-medium hover:underline text-gray-500 dark:text-gray-400">
          {totalReactions > 0 ? totalReactions : 0}
        </span>
      </div>

      {/* Facebook-like Modal for Reactions */}
      {typeof document !== "undefined" && createPortal(<AnimatePresence>{showModal && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#242526] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] text-gray-200 border border-gray-700" onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex-1"></div>
                <h3 className="text-xl font-bold text-gray-100 flex-1 text-center">عرض التفاعلات</h3>
                <div className="flex-1 flex justify-end">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-full bg-[#3a3b3c] hover:bg-[#4e4f50] text-gray-300 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 px-2 pt-2 border-b border-gray-700 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-[3px] transition-colors ${
                    activeTab === "all" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400 hover:bg-[#3a3b3c] rounded-t-lg"
                  }`}
                >
                  الكل
                </button>
                {counts.filter(c => c.count > 0).map((c) => {
                  const rObj = reactions.find(r => r.type === c.type);
                  if (!rObj) return null;
                  return (
                    <button
                      key={c.type}
                      onClick={() => setActiveTab(c.type)}
                      className={`px-4 py-3 text-sm font-bold whitespace-nowrap flex items-center gap-2 border-b-[3px] transition-colors ${
                        activeTab === c.type ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400 hover:bg-[#3a3b3c] rounded-t-lg"
                      }`}
                    >
                      <span className="text-gray-300">{c.count}</span>
                      <span className="text-xl">{rObj.icon}</span>
                    </button>
                  );
                })}
              </div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto p-2">
                {modalLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredModalData.length > 0 ? (
                  filteredModalData.map((reactionItem) => {
                    const rObj = reactions.find(r => r.type === reactionItem.type);
                    const userAvatar = reactionItem.user?.avatar;
                    return (
                      <div key={reactionItem.id} className="flex items-center justify-between p-2 hover:bg-[#3a3b3c] rounded-lg transition cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {userAvatar ? (
                              <img 
                                src={userAvatar.startsWith('http') ? userAvatar : `http://127.0.0.1:8000${userAvatar}`} 
                                alt={reactionItem.user?.name} 
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"; }}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                            <span className="absolute -bottom-1 -right-1 bg-[#242526] rounded-full p-[2px] text-sm shadow-sm flex items-center justify-center">
                              {rObj?.icon}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-100 text-[15px]">
                              {reactionItem.user?.name || "مستخدم غير معروف"}
                            </span>
                            <span className="text-xs text-gray-400">
                              تفاعل مع هذا المنتج
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { startChat(reactionItem.user); setShowModal(false); }} className="flex items-center gap-1.5 bg-[#3a3b3c] hover:bg-[#4e4f50] text-gray-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition">
                            <MessageCircle className="w-4 h-4" />
                            مراسلة
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-12 text-sm">
                    لا توجد تفاعلات.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Action Button Section (Right visual, Left DOM in RTL) */}
      <div
        className="relative flex items-center"
        onMouseEnter={() => {
          clearTimeout(hidePopupRef.current);
          setShowPopup(true);
        }}
        onMouseLeave={() => {
          hidePopupRef.current = setTimeout(() => setShowPopup(false), 300);
        }}
      >
        {/* Popup Menu (Appears ABOVE) */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full left-0 mb-2 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-gray-100 dark:border-gray-700 p-1 flex gap-1 z-[9999]"
            >
              {reactions.map((r) => (
                <div key={r.type} className="relative group/btn">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleReact(r.type);
                    }}
                    className="hover:scale-125 hover:-translate-y-1 transition-all duration-200 text-2xl p-1 relative z-10"
                  >
                    {r.icon}
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={(e) => {
            e.preventDefault();
            handleReact(userReaction ? userReaction : "like");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
            activeReactionObj 
              ? activeReactionObj.color + " bg-gray-50 dark:bg-slate-800" 
              : "text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800"
          }`}
        >
          {activeReactionObj ? (
            <span className="flex items-center gap-1">
              {activeReactionObj.icon} {activeReactionObj.label}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <ThumbsUp size={16} />
              أعجبني
            </span>
          )}
        </button>
      </div>
    </div>
  );
}





