import { User, Camera, Shield, Package } from "lucide-react";

export default function ProfileSidebar({
  profile,
  activeTab,
  setActiveTab,
  avatarPreview,
  handleAvatarChange,
  setSuccessMsg,
  setErrorMsg,
}) {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900 text-center">
        {/* Avatar upload container */}
        <div className="relative mx-auto h-24 w-24 rounded-full overflow-hidden border border-gray-200 shadow-inner group">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-slate-800">
              <User className="h-10 w-10 text-gray-400" />
            </div>
          )}
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
            <Camera className="h-5 w-5 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
          {profile.name}
        </h2>
        <p className="text-xs text-gray-400 mt-1">{profile.email}</p>
        <span className="inline-block mt-3 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          {profile.role === "admin" ? "مسؤول النظام" : "عميل تجاري"}
        </span>

        {/* Tabs Navigation */}
        <div className="mt-8 flex flex-col gap-2 border-t border-gray-100 dark:border-gray-800 pt-6">
          <button
            onClick={() => {
              setActiveTab("info");
              setSuccessMsg("");
              setErrorMsg("");
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "info"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800"
            }`}
          >
            <User className="h-4 w-4" />
            البيانات الشخصية
          </button>
          <button
            onClick={() => {
              setActiveTab("security");
              setSuccessMsg("");
              setErrorMsg("");
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "security"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800"
            }`}
          >
            <Shield className="h-4 w-4" />
            الحماية والسرية
          </button>
          <button
            onClick={() => {
              setActiveTab("orders");
              setSuccessMsg("");
              setErrorMsg("");
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "orders"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800"
            }`}
          >
            <Package className="h-4 w-4" />
            فواتيري وطلباتي
          </button>
        </div>
      </div>
    </aside>
  );
}
