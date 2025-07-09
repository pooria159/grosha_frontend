import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/customer/Sidebar";
import "../css/DashboardSlider.css";

const CustomerDashboard: React.FC = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobileView);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative flex min-h-screen bg-[#FDC500]">
      <div 
        className={`fixed md:static z-20 h-full transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <Sidebar toggleSidebar={isMobileView ? toggleSidebar : undefined} />
      </div>

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen && !isMobileView ? "ml-64" : "ml-0"
        }`}
      >
        {isMobileView && (
          <button
            onClick={toggleSidebar}
            className="fixed z-10 p-2 m-2 text-white bg-[#FDC500] rounded-md"
          >
            ☰
          </button>
        )}

        <div className="p-4 md:p-8 h-screen overflow-y-auto bg-[#ffffff]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;