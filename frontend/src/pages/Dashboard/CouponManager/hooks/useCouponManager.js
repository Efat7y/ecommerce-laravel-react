import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../Api/Api";
import { getToken } from "../../../../utils/auth";
import { toast } from "sonner";

export default function useCouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    type: "percent",
    value: "",
    min_order_value: "",
    max_discount: "",
    usage_limit: "",
    expires_at: "",
    is_active: true,
    is_public: false,
    allowed_tier: "all"
  });

  const token = getToken();

  const fetchCoupons = () => {
    setLoading(true);
    axios.get(`${baseUrl}/admin/coupons`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCoupons(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openAddModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      type: "percent",
      value: "",
      min_order_value: "",
      max_discount: "",
      usage_limit: "",
      expires_at: "",
      is_active: true,
      is_public: false,
      allowed_tier: "all"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      min_order_value: coupon.min_order_value || "",
      max_discount: coupon.max_discount || "",
      usage_limit: coupon.usage_limit || "",
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : "",
      is_active: coupon.is_active,
      is_public: coupon.is_public,
      allowed_tier: coupon.allowed_tier || "all"
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الكوبون؟")) return;
    axios.delete(`${baseUrl}/admin/coupons/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        toast.success("تم الحذف بنجاح");
        fetchCoupons();
      })
      .catch(err => {
        console.error(err);
        toast.error("حدث خطأ أثناء الحذف");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      toast.error("كود الخصم والقيمة مطلوبان");
      return;
    }

    setSubmitting(true);
    
    // Clean up empty strings to null for nullable fields
    const dataToSend = { ...formData };
    if (dataToSend.min_order_value === "") dataToSend.min_order_value = 0;
    if (dataToSend.max_discount === "") dataToSend.max_discount = null;
    if (dataToSend.usage_limit === "") dataToSend.usage_limit = null;
    if (dataToSend.expires_at === "") dataToSend.expires_at = null;

    const request = editingCoupon
      ? axios.put(`${baseUrl}/admin/coupons/${editingCoupon.id}`, dataToSend, { headers: { Authorization: `Bearer ${token}` } })
      : axios.post(`${baseUrl}/admin/coupons`, dataToSend, { headers: { Authorization: `Bearer ${token}` } });

    request
      .then(() => {
        toast.success(editingCoupon ? "تم تعديل الكوبون بنجاح" : "تمت إضافة الكوبون بنجاح");
        setIsModalOpen(false);
        fetchCoupons();
      })
      .catch((err) => {
        if (err.response?.status === 422) {
          toast.error("بيانات غير صالحة، أو الكود مستخدم مسبقاً");
        } else {
          toast.error("حدث خطأ أثناء حفظ الكوبون");
        }
      })
      .finally(() => setSubmitting(false));
  };

  const handleToggleActive = (coupon) => {
    axios.put(`${baseUrl}/admin/coupons/${coupon.id}`, {
      ...coupon,
      is_active: !coupon.is_active
    }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        toast.success("تم تغيير حالة الكوبون");
        fetchCoupons();
      })
      .catch(() => toast.error("فشل تغيير الحالة"));
  };

  return {
    coupons,
    loading,
    isModalOpen, setIsModalOpen,
    editingCoupon,
    formData, setFormData,
    submitting,
    openAddModal,
    openEditModal,
    handleDelete,
    handleSubmit,
    handleToggleActive
  };
}
