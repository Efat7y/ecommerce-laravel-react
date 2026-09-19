import { Heart } from "lucide-react";
import { useInteraction } from "@/context/InteractionContext";
import { flyToWishlist } from "@/utils/animations";

export default function WishlistButton({ productId, productImage, className = "" }) {
  const { wishlistIds, toggleWishlist } = useInteraction();
  
  const inWishlist = wishlistIds.includes(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleWishlist(productId);
        if (!inWishlist) {
          flyToWishlist(e, productImage);
        }
      }}
      className={`transition-all duration-300 transform active:scale-90 ${inWishlist ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-400 hover:scale-110'} ${className}`}
      title={inWishlist ? "إزالة من المفضلة" : "إضافة للمفضلة"}
    >
      <Heart className="h-6 w-6" fill={inWishlist ? "currentColor" : "none"} />
    </button>
  );
}
