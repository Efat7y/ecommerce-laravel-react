import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "../../../../Api/Api";
import { getToken, setUser } from "../../../../utils/auth";

export default function useProfilePage() {
  const navigate = useNavigate();
  const token = getToken();

  const [activeTab, setActiveTab] = useState("info");
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${baseUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setPhone(res.data.phone || "");
        setAddress(res.data.address || "");
        setBio(res.data.bio || "");
        if (res.data.avatar) {
          setAvatarPreview(`http://127.0.0.1:8000${res.data.avatar}`);
        }
        setLoadingProfile(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingProfile(false);
      });
  }, [token, navigate]);

  useEffect(() => {
    if (activeTab === "orders" && token) {
      setLoadingOrders(true);
      axios
        .get(`${baseUrl}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setOrders(res.data);
          setLoadingOrders(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingOrders(false);
        });
    }
  }, [activeTab, token]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("bio", bio);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    axios
      .post(`${baseUrl}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setSaving(false);
        setProfile(res.data.user);
        setUser(res.data.user);
        setSuccessMsg("تم تحديث بيانات الملف الشخصي بنجاح!");
        toast.success("تم تحديث بيانات الملف الشخصى بنجاح");
      })
      .catch((err) => {
        setSaving(false);
        setErrorMsg(
          err.response?.data?.message || "حدث خطأ أثناء حفظ التعديلات."
        );
      });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("كلمة المرور وتأكيدها غير متطابقين.");
      return;
    }

    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    axios
      .post(`${baseUrl}/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSaving(false);
        setPassword("");
        setConfirmPassword("");
        setSuccessMsg("تم تحديث كلمة المرور بنجاح!");
      })
      .catch((err) => {
        setSaving(false);
        setErrorMsg(
          err.response?.data?.message || "حدث خطأ أثناء تحديث كلمة المرور."
        );
      });
  };

  return {
    loadingProfile,
    loadingOrders,
    profile,
    orders,
    activeTab, setActiveTab,
    
    // Form variables
    name, setName,
    email, setEmail,
    phone, setPhone,
    address, setAddress,
    bio, setBio,
    avatarPreview,
    handleAvatarChange,
    
    password, setPassword,
    confirmPassword, setConfirmPassword,
    
    // Message states
    saving,
    successMsg, setSuccessMsg,
    errorMsg, setErrorMsg,
    
    // Actions
    handleUpdateInfo,
    handleUpdatePassword
  };
}
