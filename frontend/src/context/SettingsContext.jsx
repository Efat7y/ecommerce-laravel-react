import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../Api/Api";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    site_name: "شركة الفتح للمنظفات",
    site_description: "الشركة الرائدة في مجال المنظفات والخامات الكيميائية",
    shipping_fee: 50,
    whatsapp_number: "",
    facebook_url: "",
    contact_phone: "+20 123 456 7890",
    contact_email: "support@example.com",
    contact_address: "القاهرة، مصر",
    logo: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      // Fetch settings but also wait at least 1.5 seconds so the splash screen has time to shine
      const [res] = await Promise.all([
        axios.get(`${baseUrl}/settings`),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      setSettings(res.data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
