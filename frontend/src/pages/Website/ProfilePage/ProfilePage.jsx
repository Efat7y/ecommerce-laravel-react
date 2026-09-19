import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Website/layout/Header/Header";
import ProfileSidebar from "./components/ProfileSidebar";
import PersonalInfoForm from "./components/PersonalInfoForm";
import SecurityForm from "./components/SecurityForm";
import OrdersList from "./components/OrdersList";
import useProfilePage from "./hooks/useProfilePage";

export default function ProfilePage() {
  const {
    loadingProfile,
    loadingOrders,
    profile,
    orders,
    activeTab, setActiveTab,
    name, setName,
    email, setEmail,
    phone, setPhone,
    address, setAddress,
    bio, setBio,
    avatarPreview,
    handleAvatarChange,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    saving,
    successMsg, setSuccessMsg,
    errorMsg, setErrorMsg,
    handleUpdateInfo,
    handleUpdatePassword
  } = useProfilePage();

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-500">
        <p>عذراً، لا يمكن تحميل بيانات الملف الشخصي. قد تكون بحاجة إلى تسجيل الدخول مرة أخرى.</p>
        <button onClick={() => window.location.href = '/login'} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">تسجيل الدخول</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100" dir="rtl">
      <Helmet>
        <title>الصفحه الشخصيه</title>
      </Helmet>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar
            profile={profile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            avatarPreview={avatarPreview}
            handleAvatarChange={handleAvatarChange}
            setSuccessMsg={setSuccessMsg}
            setErrorMsg={setErrorMsg}
          />

          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-sm">
            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl dark:bg-emerald-950/20 dark:text-emerald-400">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl dark:bg-red-950/20 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            {activeTab === "info" && (
              <PersonalInfoForm
                handleUpdateInfo={handleUpdateInfo}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                address={address}
                setAddress={setAddress}
                bio={bio}
                setBio={setBio}
                saving={saving}
              />
            )}

            {activeTab === "security" && (
              <SecurityForm
                handleUpdatePassword={handleUpdatePassword}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                saving={saving}
              />
            )}

            {activeTab === "orders" && (
              <OrdersList orders={orders} loadingOrders={loadingOrders} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
