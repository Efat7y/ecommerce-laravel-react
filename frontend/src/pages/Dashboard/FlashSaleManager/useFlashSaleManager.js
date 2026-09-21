import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../Api/Api";
import { getToken } from "../../../utils/auth";
import Swal from "sweetalert2";

export function useFlashSaleManager() {
  const [flashSales, setFlashSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlashSales = async () => {
    try {
      const res = await axios.get(`${baseUrl}/admin/flash-sales`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setFlashSales(res.data);
    } catch (error) {
      console.error("Error fetching flash sales", error);
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
    Promise.all([fetchFlashSales(), fetchProducts()]).finally(() =>
      setIsLoading(false),
    );
  }, []);

  const createFlashSale = async (data) => {
    try {
      await axios.post(`${baseUrl}/admin/flash-sales`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      Swal.fire("Success", "Flash sale created successfully", "success");
      fetchFlashSales();
    } catch (error) {
      Swal.fire("Error", "Could not create flash sale", "error");
    }
  };

  const updateFlashSale = async (id, data) => {
    try {
      await axios.put(`${baseUrl}/admin/flash-sales/${id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      Swal.fire("Success", "Flash sale updated successfully", "success");
      fetchFlashSales();
    } catch (error) {
      Swal.fire("Error", "Could not update flash sale", "error");
    }
  };

  const deleteFlashSale = async (id) => {
    try {
      await axios.delete(`${baseUrl}/admin/flash-sales/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      Swal.fire("Deleted!", "Flash sale deleted", "success");
      fetchFlashSales();
    } catch (error) {
      Swal.fire("Error", "Could not delete flash sale", "error");
    }
  };

  const syncProducts = async (id, productData) => {
    try {
      await axios.post(
        `${baseUrl}/admin/flash-sales/${id}/products`,
        { products: productData },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      Swal.fire("Success", "Products updated successfully", "success");
      fetchFlashSales();
    } catch (error) {
      Swal.fire("Error", "Could not update products", "error");
    }
  };

  return {
    flashSales,
    products,
    isLoading,
    createFlashSale,
    updateFlashSale,
    deleteFlashSale,
    syncProducts,
  };
}
