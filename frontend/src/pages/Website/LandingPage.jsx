
import { CheckCircle2, ShieldCheck, Zap, ShoppingCart, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import CategoriesSection from "@/components/Website/CategoriesSection/CategoriesSection";
import SpecialDiscountBanner from "@/components/Website/SpecialDiscountBanner/SpecialDiscountBanner";
import Footer from "@/components/Website/layout/Footer/Footer";
import Header from "@/components/Website/layout/Header/Header";
import FeaturedProducts from "@/components/Website/FeaturedProducts/FeaturedProducts";
import TrustBadges from "@/components/Website/TrustBadges/TrustBadges";
import HeroSection from "@/components/Website/HeroSection/HeroSection";

export default function LandingPage() {
  


  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 dark:bg-slate-950 dark:text-gray-100" dir="rtl">
      <Helmet>
        <title>الرئيسيه</title>
      </Helmet>
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Special Discount Banner */}
      <SpecialDiscountBanner />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Footer */}
      <Footer />
    </div>
  );
}
