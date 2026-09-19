// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { Toaster } from "sonner";

import { InteractionProvider } from "./context/InteractionContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SettingsProvider>
      <InteractionProvider>
        <CartProvider>
          <HelmetProvider>
            <Toaster richColors position="top-center" />
            <App />
          </HelmetProvider>
        </CartProvider>
      </InteractionProvider>
    </SettingsProvider>
  </BrowserRouter>,
);
