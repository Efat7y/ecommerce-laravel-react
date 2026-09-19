import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../../Api/Api";
import { useCart } from "../../../../context/CartContext";

export default function useProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  
  const { addToCart, cartItems, updateQuantity } = useCart();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);

        axios.get(`${baseUrl}/products`).then((allRes) => {
          const list = allRes.data.filter(
            (p) => p.category_id === res.data.category_id && p.id !== res.data.id
          );
          setRelated(list.slice(0, 4));
        });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const qtyInCart = product ? cartItems.find((i) => i.product.id === product.id)?.quantity || 0 : 0;

  const getTechnicalSpecs = () => {
    return {
      concentration: "نقاوة صناعية قياسية معتمدة",
      solubility: "ذوبان كامل ومثالي",
      ph: "منظم ومطابق للمواصفات الفنية",
      safety: "تجنب الاستنشاق المباشر، يحفظ في مكان جاف ومغلق جيداً."
    };
  };

  const specs = getTechnicalSpecs();

  return {
    id,
    navigate,
    product,
    error,
    isImageFullscreen, setIsImageFullscreen,
    loading,
    qty, setQty,
    related,
    qtyInCart,
    specs,
    
    // Actions
    addToCart,
    updateQuantity
  };
}
