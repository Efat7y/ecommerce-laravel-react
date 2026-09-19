import { useState } from "react";
import Navbar from "./layout/Navbar/Navbar";
import Sidebar from "./layout/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}