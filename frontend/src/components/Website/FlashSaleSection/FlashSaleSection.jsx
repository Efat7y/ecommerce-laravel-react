import React, { useState, useEffect } from "react";
import { useFlashSale } from "./useFlashSale";
import CountdownTimer from "./CountdownTimer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { baseUrl } from "../../../Api/Api";
import { Link } from "react-router-dom";
import { ShoppingCart, Flame, Lock, Clock } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { flyToCart } from "../../../utils/animations";

export default function FlashSaleSection() {
  const { flashSale, isLoading } = useFlashSale();
  const { addToCart } = useCart();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second to trigger state changes automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (
    isLoading ||
    !flashSale ||
    !flashSale.products ||
    flashSale.products.length === 0
  )
    return null;

  const endTimeMs = +new Date(flashSale.end_time);
  const startTimeMs = flashSale.start_time
    ? +new Date(flashSale.start_time)
    : 0;

  // 24 hours grace period for FOMO state
  const gracePeriodMs = 24 * 60 * 60 * 1000;

  const isUpcoming = startTimeMs > 0 && startTimeMs - currentTime > 0;
  const isEnded = endTimeMs - currentTime <= 0;
  const isFullyExpired = isEnded && currentTime - endTimeMs > gracePeriodMs;

  // If time completely passed the grace period, hide the section
  if (isFullyExpired) return null;

  const handleAddToCart = (e, product, flashPrice) => {
    e.preventDefault();
    if (isEnded) return; // Prevent adding if ended
    addToCart({ ...product, price: flashPrice });
    flyToCart(e, product.image);
  };

  // -------------------------------------------------------------
  // STATE 1: TEASER (Upcoming Sale) - Hides products
  // -------------------------------------------------------------
  if (isUpcoming) {
    return (
      <section className="py-16 bg-slate-900 overflow-hidden relative border-y-4 border-red-600">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 inline-block p-4 rounded-full mb-6 shadow-xl shadow-red-600/20">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            ترقبوا العرض القادم ⏳
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {flashSale.teaser_description ||
              "تبدأ الخصومات الكبرى قريباً، استعدوا لمفاجأة لن تتكرر!"}
          </p>
          <div className="flex justify-center bg-white/5 p-6 rounded-2xl max-w-xl mx-auto backdrop-blur-sm border border-white/10">
            <CountdownTimer endTime={flashSale.start_time} />
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-600 rounded-full blur-3xl"></div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // STATE 2 & 3: ACTIVE SALE or FOMO (Ended but visible)
  // -------------------------------------------------------------
  return (
    <section
      className={`py-12 overflow-hidden relative transition-colors duration-1000 ${isEnded ? "bg-gray-100 dark:bg-gray-900/40" : "bg-red-50 dark:bg-red-900/10"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-full ${isEnded ? "bg-gray-200 dark:bg-gray-800" : "bg-red-100 dark:bg-red-900/50"}`}
            >
              {isEnded ? (
                <Clock className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              ) : (
                <Flame className="w-8 h-8 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <h2
                className={`text-3xl font-bold mb-2 ${isEnded ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}
              >
                {isEnded
                  ? "انتهى العرض 😔"
                  : flashSale.title || "عروض فلاش سيل 🔥"}
              </h2>
              <p
                className={
                  isEnded ? "text-gray-500" : "text-gray-600 dark:text-gray-400"
                }
              >
                {isEnded
                  ? "لقد فاتتك هذه الخصومات، تابعنا لتلحق بالعروض القادمة!"
                  : "سارع قبل نفاذ الكمية أو انتهاء الوقت!"}
              </p>
            </div>
          </div>
          <CountdownTimer endTime={flashSale.end_time} />
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 5 },
            }}
            className="py-4 px-2"
            dir="rtl"
          >
            {flashSale.products.map((product) => {
              const flashPrice = product.pivot.discount_price;
              const discountPercentage = Math.round(
                ((product.price - flashPrice) / product.price) * 100,
              );

              return (
                <SwiperSlide key={product.id}>
                  <div
                    className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col relative ${isEnded ? "border-gray-200 dark:border-gray-700 opacity-80 grayscale-[50%]" : "border-red-100 dark:border-red-900/30"}`}
                  >
                    <div
                      className={`absolute top-3 right-3 text-white text-xs font-bold px-2 py-1 rounded-lg z-10 ${isEnded ? "bg-gray-500" : "bg-red-600"}`}
                    >
                      {isEnded ? "فاتك الخصم" : `خصم ${discountPercentage}%`}
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      className="block relative overflow-hidden aspect-square p-4"
                    >
                      <img
                        src={
                          product.image?.startsWith("http")
                            ? product.image
                            : `${baseUrl.replace("/api", "")}/storage/${product.image}`
                        }
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>

                    <div className="p-4 flex flex-col flex-grow">
                      <Link to={`/products/${product.id}`}>
                        <h3
                          className={`font-semibold mb-2 line-clamp-2 transition-colors ${isEnded ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white group-hover:text-red-600"}`}
                        >
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className={`text-xl font-bold ${isEnded ? "text-gray-500 line-through" : "text-red-600 dark:text-red-400"}`}
                          >
                            {flashPrice} ج.م
                          </span>
                          {!isEnded && (
                            <span className="text-sm text-gray-400 line-through">
                              {product.price} ج.م
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) =>
                            handleAddToCart(e, product, flashPrice)
                          }
                          disabled={isEnded}
                          className={`w-full text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isEnded ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                        >
                          {isEnded ? (
                            <>
                              <Clock className="w-5 h-5" /> انتهى العرض
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" /> أضف للسلة
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
            {/* Custom Navigation Buttons to swap logic while keeping styles */}
            <div className="swiper-button-next custom-prev"></div>
            <div className="swiper-button-prev custom-next"></div>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
