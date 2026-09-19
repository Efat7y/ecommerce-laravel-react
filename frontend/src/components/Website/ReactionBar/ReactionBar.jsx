import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseUrl } from "@/Api/Api";
import { getToken } from "@/utils/auth";
import { ThumbsUp, Heart, Laugh, Frown, Angry } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const reactions = [
  { type: "like", icon: "👍", color: "text-blue-500", label: "أعجبني" },
  { type: "love", icon: "❤️", color: "text-red-500", label: "أحببته" },
  { type: "wow", icon: "😮", color: "text-yellow-500", label: "واو" },
  { type: "haha", icon: "😂", color: "text-yellow-500", label: "هاها" },
  { type: "sad", icon: "😢", color: "text-yellow-500", label: "حزين" },
  { type: "angry", icon: "😡", color: "text-orange-500", label: "غاضب" },
];

export default function ReactionBar({ productId }) {
  const [counts, setCounts] = useState([]);
  const [userReaction, setUserReaction] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const hideTimeoutRef = useRef(null);
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
        },
      );
      setCounts(res.data.counts);
      setUserReaction(res.data.user_reaction);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReact = async (type) => {
    if (!token) {
      // Need login, maybe toast or just ignore
      return;
    }

    // Optimistic UI update
    const previousReaction = userReaction;
    setUserReaction(type === userReaction ? null : type);

    try {
      await axios.post(
        `${baseUrl}/products/${productId}/react`,
        { type },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchReactions(); // Refresh true counts
    } catch (err) {
      setUserReaction(previousReaction);
    }
    setShowPopup(false);
  };

  const totalReactions =
    counts.reduce((sum, item) => sum + item.count, 0) +
    (userReaction && !counts.find((c) => c.type === userReaction) ? 1 : 0);

  // Find top 3 emojis
  const topReactions = [...counts]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((c) => reactions.find((r) => r.type === c.type)?.icon)
    .filter(Boolean);

  const activeReactionObj = reactions.find((r) => r.type === userReaction);

  return (
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center text-xs text-gray-500 gap-1">
        <div className="flex -space-x-1 space-x-reverse">
          {topReactions.length > 0 ? (
            topReactions.map((emoji, i) => (
              <span
                key={i}
                className="text-sm bg-white dark:bg-slate-800 rounded-full shadow-sm"
              >
                {emoji}
              </span>
            ))
          ) : (
            <span className="text-gray-400">👍</span>
          )}
        </div>
        <span className="mr-1">{totalReactions > 0 ? totalReactions : 0}</span>
      </div>

      <div
        className="relative flex items-center"
        onMouseEnter={() => {
          clearTimeout(hideTimeoutRef.current);
          setShowPopup(true);
        }}
        onMouseLeave={() => {
          hideTimeoutRef.current = setTimeout(() => setShowPopup(false), 300);
        }}
      >
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full left-31 z-100 -translate-x-1/2 mb-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 p-1 flex gap-1 z-50"
            >
              {reactions.map((r) => (
                <button
                  key={r.type}
                  onClick={(e) => {
                    e.preventDefault();
                    handleReact(r.type);
                  }}
                  className="hover:scale-125 hover:-translate-y-1 transition-all duration-200 text-2xl p-1"
                  title={r.label}
                >
                  {r.icon}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={(e) => {
            e.preventDefault();
            handleReact(userReaction ? userReaction : "like");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${activeReactionObj ? activeReactionObj.color + " bg-gray-50 dark:bg-slate-800" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800"}`}
        >
          {activeReactionObj ? (
            <span>
              {activeReactionObj.icon} {activeReactionObj.label}
            </span>
          ) : (
            <>
              <ThumbsUp size={16} />
              أعجبني
            </>
          )}
        </button>
      </div>
    </div>
  );
}
