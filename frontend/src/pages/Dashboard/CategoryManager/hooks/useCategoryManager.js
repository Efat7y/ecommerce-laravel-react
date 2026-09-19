import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../Api/Api";
import { getToken } from "../../../../utils/auth";
import { toast } from "sonner";

export default function useCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const token = getToken();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    axios.get(`${baseUrl}/categories`).then((res) => {
      setCategories(res.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    axios.delete(`${baseUrl}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      toast.success("تم الحذف بنجاح");
      fetchCategories();
    }).catch(err => {
      console.error(err);
      toast.error("فشل الحذف");
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("اسم القسم مطلوب");
      return;
    }
    
    setSubmitting(true);
    
    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    const config = {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data" 
      }
    };

    if (editingCategory) {
      formData.append("_method", "PUT");
      axios.post(`${baseUrl}/categories/${editingCategory.id}`, formData, config)
        .then(() => {
          toast.success("تم التعديل بنجاح");
          setIsModalOpen(false);
          fetchCategories();
        }).catch(() => toast.error("فشل التعديل"))
        .finally(() => setSubmitting(false));
    } else {
      axios.post(`${baseUrl}/categories`, formData, config)
        .then(() => {
          toast.success("تمت الإضافة بنجاح");
          setIsModalOpen(false);
          fetchCategories();
        }).catch(() => toast.error("فشل الإضافة"))
        .finally(() => setSubmitting(false));
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return {
    categories,
    loading,
    searchTerm, setSearchTerm,
    isModalOpen, setIsModalOpen,
    editingCategory,
    name, setName,
    description, setDescription,
    imageFile, setImageFile,
    submitting,
    filtered,
    openAddModal,
    openEditModal,
    handleDelete,
    handleSubmit
  };
}
