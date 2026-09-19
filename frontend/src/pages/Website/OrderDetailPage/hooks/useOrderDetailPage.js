import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../../Api/Api";
import { getToken } from "../../../../utils/auth";
import { useSettings } from "../../../../context/SettingsContext";

export default function useOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getToken();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { settings } = useSettings();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${baseUrl}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, token, navigate]);

  return {
    id,
    order,
    loading,
    settings
  };
}
