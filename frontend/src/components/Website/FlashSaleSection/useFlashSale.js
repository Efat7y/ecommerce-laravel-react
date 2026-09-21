import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../Api/Api";

export function useFlashSale() {
  const [flashSale, setFlashSale] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveSale = async () => {
      try {
        const res = await axios.get(`${baseUrl}/flash-sale/active`);
        if (res.data && res.data.id) {
          setFlashSale(res.data);
        } else {
          setFlashSale(null);
        }
      } catch (error) {
        console.error("Error fetching flash sale", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActiveSale();
  }, []);

  return { flashSale, isLoading };
}
