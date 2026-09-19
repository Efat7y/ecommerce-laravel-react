import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../Api/Api";
import { getToken } from "../utils/auth";
import { toast } from "sonner";

const InteractionContext = createContext();

export function InteractionProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([]);
  const token = getToken();

  const fetchWishlistIds = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${baseUrl}/wishlists/ids`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistIds(res.data);
    } catch (error) {
      console.error("Failed to load wishlist ids:", error);
    }
  };

  useEffect(() => {
    fetchWishlistIds();
  }, [token]);

  const toggleWishlist = async (productId) => {
    if (!token) {
      toast.error("يجب تسجيل الدخول لإضافة المنتج للمفضلة");
      return;
    }
    
    // Optimistic update
    const inWishlist = wishlistIds.includes(productId);
    if (inWishlist) {
      setWishlistIds(wishlistIds.filter(id => id !== productId));
    } else {
      setWishlistIds([...wishlistIds, productId]);
    }

    try {
      const res = await axios.post(`${baseUrl}/products/${productId}/wishlist`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.in_wishlist) {
        toast.success("تم الإضافة للمفضلة");
      } else {
        toast.info("تمت الإزالة من المفضلة");
      }
    } catch (error) {
      // Revert on failure
      fetchWishlistIds();
      toast.error("حدث خطأ");
    }
  };

  return (
    <InteractionContext.Provider value={{ wishlistIds, toggleWishlist }}>
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteraction() {
  return useContext(InteractionContext);
}
