import { useState } from "react";
import { useFlashSaleManager } from "./useFlashSaleManager";
import { Plus, Trash, Edit, Check, List } from "lucide-react";
import Swal from "sweetalert2";
import moment from "moment";
import { baseUrl } from "../../../Api/Api";

export default function FlashSaleManager() {
  const {
    flashSales,
    products,
    isLoading,
    createFlashSale,
    updateFlashSale,
    deleteFlashSale,
    syncProducts,
  } = useFlashSaleManager();
  const [title, setTitle] = useState("");
  const [teaserDescription, setTeaserDescription] = useState("");
  const [productsRevealTime, setProductsRevealTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [editingSaleId, setEditingSaleId] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [saleProducts, setSaleProducts] = useState([]);

  const handleEditSale = (sale) => {
    setEditingSaleId(sale?.id);
    setTitle(sale?.title || "");
    setTeaserDescription(sale?.teaser_description || "");
    setProductsRevealTime(sale?.products_reveal_time ? moment(sale.products_reveal_time).format("YYYY-MM-DDTHH:mm") : "");
    setStartTime(
      sale?.start_time ? moment(sale.start_time).format("YYYY-MM-DDTHH:mm") : ""
    );
    setEndTime(
      sale?.end_time ? moment(sale.end_time).format("YYYY-MM-DDTHH:mm") : ""
    );
    setIsActive(sale?.is_active ?? true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingSaleId(null);
    setTitle("");
    setTeaserDescription("");
    setProductsRevealTime("");
    setStartTime("");
    setEndTime("");
    setIsActive(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!endTime) return Swal.fire("Error", "End time is required", "error");

    const payload = {
      title,
      teaser_description: teaserDescription,
      products_reveal_time: productsRevealTime || null,
      start_time: startTime || null,
      end_time: endTime,
      is_active: isActive,
    };

    if (editingSaleId) {
      updateFlashSale(editingSaleId, payload);
      handleCancelEdit();
    } else {
      createFlashSale(payload);
      setTitle("");
      setTeaserDescription("");
      setProductsRevealTime("");
      setStartTime("");
      setEndTime("");
    }
  };

  const handleManageProducts = (sale) => {
    if (!sale) return;
    setSelectedSale(sale);
    setSaleProducts(
      (sale.products || []).map((p) => ({
        product_id: p.id,
        discount_price: p.pivot?.discount_price || p.price,
        flash_quantity: p.pivot?.flash_quantity || "",
      }))
    );
  };

  const addProductToSale = (productId, originalPrice) => {
    if (saleProducts.find((p) => p.product_id === productId)) return;
    setSaleProducts([
      ...saleProducts,
      { product_id: productId, discount_price: originalPrice, flash_quantity: "" },
    ]);
  };

  const updateSaleProductPrice = (productId, price) => {
    setSaleProducts(
      saleProducts.map((p) =>
        p.product_id === productId ? { ...p, discount_price: price } : p
      )
    );
  };

  
  const updateSaleProductQuantity = (productId, qty) => {
    setSaleProducts(
      saleProducts.map((p) =>
        p.product_id === productId ? { ...p, flash_quantity: qty } : p
      )
    );
  };

  const removeProductFromSale = (productId) => {
    setSaleProducts(saleProducts.filter((p) => p.product_id !== productId));
  };

  const handleSaveProducts = () => {
    if (selectedSale) {
      syncProducts(selectedSale.id, saleProducts);
      setSelectedSale(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const validFlashSales = Array.isArray(flashSales) ? flashSales : [];
  const validProducts = Array.isArray(products) ? products : [];

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        إدارة الفلاش سيل
      </h1>

      {/* Create / Edit Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {editingSaleId ? "تعديل إعدادات العرض" : "إضافة عرض جديد"}
        </h2>
        <form
          onSubmit={handleCreate}
          className="flex flex-wrap gap-4 items-end"
        >
                      <div className="flex-1 min-w-[200px]">
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                وقت ظهور المنتجات (ترقب السعر) (اختياري)
              </label>
              <input
                type="datetime-local"
                value={productsRevealTime}
                onChange={(e) => setProductsRevealTime(e.target.value)}
                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
<div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
              عنوان العرض
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
              placeholder="مثال: خصم نهاية الأسبوع"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
              الوصف التشويقي (قبل البدء)
            </label>
            <input
              type="text"
              value={teaserDescription}
              onChange={(e) => setTeaserDescription(e.target.value)}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
              placeholder="مثال: تبدأ الخصومات الكبرى قريباً!"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
              وقت وتاريخ البدء (اختياري)
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
              وقت وتاريخ الانتهاء
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div className="flex items-center gap-2 mb-3 w-full md:w-auto">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                تفعيل العرض
              </span>
            </label>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 flex-1 md:flex-none justify-center"
            >
              <Plus className="w-4 h-4" /> {editingSaleId ? "حفظ التعديلات" : "إضافة"}
            </button>
            {editingSaleId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex-1 md:flex-none justify-center"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Sales List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {validFlashSales.map((sale) => (
          <div
            key={sale?.id || Math.random()}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {sale?.title || "عرض بدون عنوان"}
                </h3>
                <p className="text-sm text-gray-500">
                  ينتهي في:{" "}
                  <span className="font-mono">
                    {sale?.end_time
                      ? moment(sale.end_time).format("YYYY-MM-DD HH:mm")
                      : ""}
                  </span>
                </p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    sale?.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {sale?.is_active ? "نشط الآن" : "غير نشط"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  title="تعديل وقت وإعدادات العرض"
                  onClick={() => handleEditSale(sale)}
                  className="text-orange-600 bg-orange-50 p-2 rounded-lg hover:bg-orange-100"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  title="تعديل المنتجات المشاركة"
                  onClick={() => handleManageProducts(sale)}
                  className="text-blue-600 bg-blue-50 p-2 rounded-lg hover:bg-blue-100"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteFlashSale(sale?.id)}
                  className="text-red-600 bg-red-50 p-2 rounded-lg hover:bg-red-100"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              عدد المنتجات المشاركة: {(sale?.products || []).length}
            </p>
          </div>
        ))}
      </div>

      {/* Product Manager Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              إدارة منتجات: {selectedSale?.title || "العرض"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* All Products */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  جميع المنتجات
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {validProducts.map((p) => (
                    <div
                      key={p?.id || Math.random()}
                      className="flex items-center justify-between p-2 border rounded dark:border-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            p?.image?.startsWith("http")
                              ? p.image
                              : `${baseUrl.replace("/api", "")}/storage/${
                                  p?.image
                                }`
                          }
                          alt={p?.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="text-sm">
                          <p className="font-medium dark:text-white truncate w-32">
                            {p?.name}
                          </p>
                          <p className="text-gray-500">{p?.price} ج.م</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addProductToSale(p.id, p.price)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        إضافة
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Products */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  المنتجات في العرض
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {saleProducts.map((sp) => {
                    const prod = validProducts.find(
                      (p) => p.id === sp.product_id
                    );
                    if (!prod) return null;
                    return (
                      <div
                        key={sp.product_id}
                        className="p-3 border rounded bg-blue-50 dark:bg-gray-700/50 dark:border-gray-600"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium dark:text-white truncate w-32">
                            {prod.name}
                          </span>
                          <button
                            onClick={() => removeProductFromSale(sp.product_id)}
                            className="text-red-500 text-sm"
                          >
                            حذف
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="line-through text-gray-500">
                            {prod.price} ج.م
                          </span>
                          <div className="flex items-center gap-2">
                            <span>سعر العرض:</span>
                            <input
                              type="number"
                              value={sp.discount_price}
                              onChange={(e) =>
                                updateSaleProductPrice(
                                  sp.product_id,
                                  e.target.value
                                )
                              }
                              className="w-20 p-1 border rounded text-center dark:bg-gray-600"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {saleProducts.length === 0 && (
                    <p className="text-sm text-gray-500">
                      لم يتم إضافة منتجات بعد.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedSale(null)}
                className="px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-gray-300"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveProducts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
