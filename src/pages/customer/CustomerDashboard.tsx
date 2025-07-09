import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/customer/Sidebar";
import "../css/DashboardSlider.css";

const CustomerDashboard: React.FC = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex min-h-screen bg-[#FDC500]">
      <Sidebar />

      <div
        className={`flex-1 transition-all duration-300 ${
          isMobileView ? "mr-0" : "md:ml-64"
        }`}
      >
        <div className="p-4 md:p-8 h-screen overflow-y-auto bg-[#ffffff]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;