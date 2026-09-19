import { removeToken } from "@/utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "lucide-react";

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();

  const logout = () => {
    removeToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between bg-slate-900 border-b border-slate-800 text-white px-4 md:px-6 py-3 shadow-md flex-shrink-0 h-16">
      {/* Hamburger menu - mobile only */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
        aria-label="فتح القائمة"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-base md:text-lg font-semibold hidden lg:block">لوحة تحكم الفتح</h1>
      <h1 className="text-base font-semibold lg:hidden">لوحة التحكم</h1>

      <button
        onClick={logout}
        className="flex items-center gap-2 rounded-xl ease-in-out bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer transition text-sm font-semibold"
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
        <span className="hidden sm:inline">تسجيل الخروج</span>
      </button>
    </header>
  );
}
