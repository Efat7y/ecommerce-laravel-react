import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../../Api/Api";
import { useCart } from "../../../../context/CartContext";

export default function useProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { addToCart, cartItems, updateQuantity } = useCart();

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("category") || "all",
  );
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${baseUrl}/products`),
      axios.get(`${baseUrl}/categories`),
    ])
      .then(([productsRes, catsRes]) => {
        setProducts(productsRes.data);
        setCategories(catsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const queryCat = searchParams.get("category");
    if (queryCat) {
      setCategoryId(queryCat);
    } else {
      setCategoryId("all");
    }
  }, [searchParams]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryId === "all" || p.category_id.toString() === categoryId;
    const matchesPrice =
      !maxPrice || parseFloat(p.price) <= parseFloat(maxPrice);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const getCartQuantity = (productId) => {
    const item = cartItems.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getCategoryName = () => {
    if (categoryId === "all") return "كل الخامات المتاحة";
    const cat = categories.find((c) => c.id.toString() === categoryId);
    return cat ? cat.name : "قسم غير معروف ";
  };

  const handleCategorySelect = (id) => {
    setCategoryId(id);
    if (id === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", id);
    }
    setSearchParams(searchParams);
  };

  return {
    categories,
    loading,
    search, setSearch,
    categoryId, handleCategorySelect,
    maxPrice, setMaxPrice,
    filteredProducts,
    getCategoryName,
    getCartQuantity,
    addToCart,
    updateQuantity
  };
}
