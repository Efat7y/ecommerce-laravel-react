import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "../../../../Api/Api";
import { getToken } from "../../../../utils/auth";

export default function useProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const token = getToken();

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("كيلو جرام");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${baseUrl}/products`),
        axios.get(`${baseUrl}/categories`),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      if (categoriesRes.data.length > 0) {
        setCategoryId(categoriesRes.data[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error("فشل جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setCategoryId(categories.length > 0 ? categories[0].id : "");
    setPrice("");
    setUnit("كيلو جرام");
    setStock("");
    setDescription("");
    setImageFile(null);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.category_id);
    setPrice(p.price);
    setUnit(p.unit);
    setStock(p.stock);
    setDescription(p.description);
    setImageFile(null);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category_id", categoryId);
    formData.append("price", parseFloat(price));
    formData.append("unit", unit);
    formData.append("stock", parseInt(stock));
    if (description) formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    if (editingProduct) {
      formData.append("_method", "PUT");
      axios
        .post(`${baseUrl}/products/${editingProduct.id}`, formData, config)
        .then(() => {
          toast.success("تم تحديث المنتج");
          closeModal();
          fetchData();
        })
        .catch((err) => {
          setErrorMsg(err.response?.data?.message || "حدث خطأ أثناء الحفظ");
        })
        .finally(() => setSubmitting(false));
    } else {
      axios
        .post(`${baseUrl}/products`, formData, config)
        .then(() => {
          toast.success("تم إضافة المنتج");
          closeModal();
          fetchData();
        })
        .catch((err) => {
          setErrorMsg(err.response?.data?.message || "حدث خطأ أثناء الحفظ");
        })
        .finally(() => setSubmitting(false));
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    axios
      .delete(`${baseUrl}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("تم حذف المنتج");
      })
      .catch(() => toast.error("فشل حذف المنتج"));
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    products,
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    filteredProducts,
    
    // Form state
    isModalOpen,
    editingProduct,
    name, setName,
    categoryId, setCategoryId,
    price, setPrice,
    unit, setUnit,
    stock, setStock,
    description, setDescription,
    imageFile, setImageFile,
    submitting,
    errorMsg,
    
    // Actions
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
  };
}
