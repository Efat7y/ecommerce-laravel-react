import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../Api/Api";
import { getToken } from "../../../../utils/auth";
import { toast } from "sonner";

export default function useSettingsManager() {
  const [settings, setSettings] = useState({
    site_name: "",
    site_description: "",
    shipping_fee: "",
    whatsapp_number: "",
    facebook_url: "",
    vendor_name: "",
    commercial_record: "",
    vendor_address: "",
    support_phone: "",
    contact_phone: "",
    contact_email: "",
    contact_address: "",
  });
  
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = getToken();

  useEffect(() => {
    axios.get(`${baseUrl}/settings`)
      .then((res) => {
        setSettings(prev => ({
          ...prev,
          ...res.data
        }));
        if (res.data.logo) {
          setLogoPreview(`http://127.0.0.1:8000${res.data.logo}`);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    Object.keys(settings).forEach(key => {
      formData.append(key, settings[key]);
    });
    if (logo) {
      formData.append("logo", logo);
    }

    axios.post(`${baseUrl}/admin/settings`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        toast.success("تم حفظ الإعدادات بنجاح");
        setTimeout(() => window.location.reload(), 1000);
        toast.success("تم حفظ الإعدادات بنجاح");
        setSaving(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("حدث خطأ أثناء حفظ الإعدادات");
        setSaving(false);
      });
  };

  return {
    settings,
    setSettings,
    logoPreview,
    handleLogoChange,
    loading,
    saving,
    handleSubmit
  };
}
