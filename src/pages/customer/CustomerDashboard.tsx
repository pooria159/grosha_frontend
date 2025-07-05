import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/customer/Sidebar";
import "../css/DashboardSlider.css";

const CustomerDashboard: React.FC = () => {
    return (
        <div className="flex flex-row-reverse min-h-screen bg-[#FDC500] overflow-hidden">
            <div className="sidebar-container w-64 bg-[#00296B] text-white h-screen overflow-y-auto shadow-lg">
                <Sidebar />
            </div>

            <div className="content flex-1 p-8 overflow-y-auto h-screen bg-[#ffffff]">
                <Outlet />
            </div>
        </div>
    );
};

export default CustomerDashboard;
