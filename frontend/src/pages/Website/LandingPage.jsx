import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useSettings } from "@/context/SettingsContext";
import CategoriesSection from "@/components/Website/CategoriesSection/CategoriesSection";
import SpecialDiscountBanner from "@/components/Website/SpecialDiscountBanner/SpecialDiscountBanner";
import Footer from "@/components/Website/layout/Footer/Footer";
import Header from "@/components/Website/layout/Header/Header";
import FeaturedProducts from "@/components/Website/FeaturedProducts/FeaturedProducts";
import TrustBadges from "@/components/Website/TrustBadges/TrustBadges";
import HeroSection from "@/components/Website/HeroSection/HeroSection";
import FlashSaleSection from "@/components/Website/FlashSaleSection/FlashSaleSection";
import SmartFormulaCalculator from "@/components/Website/SmartFormulaCalculator/SmartFormulaCalculator";

export default function LandingPage() {
  const { settings } = useSettings();
  return (
    <div
      className="min-h-screen bg-slate-50 text-gray-900 dark:bg-slate-950 dark:text-gray-100"
      dir="rtl"
    >
      <Helmet>
        <title>الرئيسية</title>
      </Helmet>
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Flash Sale Slider */}
      {settings?.feature_flash_sales === "true" && <FlashSaleSection />}

      {/* Special Discount Banner */}
      <SpecialDiscountBanner />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {settings?.feature_formulas === "true" && <SmartFormulaCalculator />}
      {/* Trust Badges */}
      <TrustBadges />

      {/* Footer */}
      <Footer />
    </div>
  );
}

