import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../Api/Api";
import { getToken } from "../../../utils/auth";
import Swal from "sweetalert2";

export function useFormulaManager() {
  const [formulas, setFormulas] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFormulas = async () => {
    try {
      const res = await axios.get(`${baseUrl}/admin/formulas?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setFormulas(res.data);
    } catch (error) {
      console.error("Error fetching formulas", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchFormulas(), fetchProducts()]).finally(() =>
      setIsLoading(false),
    );
  }, []);

  const createFormula = async (data) => {
    try {
      await axios.post(`${baseUrl}/admin/formulas`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      Swal.fire("نجاح", "تم إضافة التركيبة بنجاح", "success");
      fetchFormulas();
    } catch (error) {
      Swal.fire("خطأ", "لم يتم إضافة التركيبة", "error");
    }
  };

  const updateFormula = async (id, data) => {
    try {
      await axios.put(`${baseUrl}/admin/formulas/${id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      Swal.fire("نجاح", "تم تحديث التركيبة بنجاح", "success");
      fetchFormulas();
    } catch (error) {
      Swal.fire("خطأ", "لم يتم التحديث", "error");
    }
  };

  const deleteFormula = async (id) => {
    try {
      await axios.delete(`${baseUrl}/admin/formulas/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      Swal.fire("نجاح", "تم حذف التركيبة", "success");
      fetchFormulas();
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء الحذف", "error");
    }
  };

  const syncProducts = async (id, productData) => {
    try {
      await axios.post(
        `${baseUrl}/admin/formulas/${id}/products`,
        { products: productData },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      Swal.fire("نجاح", "تم تحديث خامات التركيبة", "success");
      fetchFormulas();
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء التحديث", "error");
    }
  };

  return {
    formulas,
    products,
    isLoading,
    createFormula,
    updateFormula,
    deleteFormula,
    syncProducts,
  };
}
