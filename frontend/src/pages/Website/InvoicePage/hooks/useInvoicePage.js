import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../../Api/Api";
import { getToken } from "../../../../utils/auth";
import { useSettings } from "../../../../context/SettingsContext";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";

export default function useInvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const componentRef = useRef();
  const handlePrintSilent = useReactToPrint({ contentRef: componentRef, documentTitle: `invoice_id` });

  useEffect(() => {
    const token = getToken();
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
        setError("تعذر تحميل بيانات الفاتورة، قد لا تملك صلاحية الوصول.");
        setLoading(false);
      });
  }, [id, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('download') === '1' && order && !loading) {
      setTimeout(() => {
        const element = document.getElementById('pdf-invoice-template');
        if (!element) return;
        const opt = {
          margin: 0,
          filename: `invoice_${id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
      }, 500);
    }
  }, [order, loading, id]);

  const handleShareWhatsapp = () => {
    const text = `مرحباً، تفاصيل فاتورتك رقم ${order?.id} جاهزة.\n\nلرؤية الفاتورة بالكامل، تفضل بزيارة الرابط التالي:\n${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-invoice-template');
    if (!element) return;
    const opt = {
      margin: 0,
      filename: `invoice_${id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return {
    id,
    navigate,
    settings,
    order,
    loading,
    error,
    componentRef,
    handlePrintSilent,
    handleShareWhatsapp,
    handleDownloadPDF
  };
}
