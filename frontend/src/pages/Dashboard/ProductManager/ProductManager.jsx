import { Loader2, Plus, Search, ShoppingBag } from "lucide-react";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import useProductManager from "./hooks/useProductManager";

export default function ProductManager() {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    filteredProducts,
    
    // Form & Modal states
    isModalOpen,
    editingProduct,
    name, setName,
    categoryId, setCategoryId,
    categories,
    price, setPrice,
    unit, setUnit,
    stock, setStock,
    description, setDescription,
    setImageFile,
    submitting,
    errorMsg,
    
    // Actions
    openAddModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
  } = useProductManager();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8" dir="rtl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="h-7 w-7 text-blue-600" />
            إدارة الخامات والمنتجات
          </h1>
          <p className="text-xs text-slate-400 mt-1">إضافة مواد خام كيميائية جديدة وتحديث الأسعار ومخزون السلع.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial md:w-64">
            <input
              type="text"
              placeholder="ابحث عن خامة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pr-10 pl-4 text-sm outline-none focus:border-blue-500 focus:bg-slate-900 transition"
            />
            <Search className="absolute top-3 right-3 h-4 w-4 text-gray-400" />
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition"
          >
            <Plus className="h-4.5 w-4.5" />
            إضافة خامة جديدة
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <ProductTable
          filteredProducts={filteredProducts}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <ProductModal
          editingProduct={editingProduct}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
          errorMsg={errorMsg}
          name={name} setName={setName}
          categoryId={categoryId} setCategoryId={setCategoryId}
          categories={categories}
          unit={unit} setUnit={setUnit}
          price={price} setPrice={setPrice}
          stock={stock} setStock={setStock}
          setImageFile={setImageFile}
          description={description} setDescription={setDescription}
          submitting={submitting}
        />
      )}
    </>
  );
}
