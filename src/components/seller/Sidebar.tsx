import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiTag,
  FiBarChart2,
  FiSettings,
  FiUserPlus,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

interface UserData {
  username: string;
  email: string;
  phone: string;
  date_joined: string;
}

const SellerSidebar: React.FC = () => {
  const location = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const menuItems = [
    { to: "/", label: "خانه", icon: <FiHome className="w-5 h-5 flex-shrink-0" /> },
    { to: "/seller-dashboard", label: "داشبورد", icon: <FiGrid className="w-5 h-5 flex-shrink-0" /> },
    { to: "/seller-dashboard/products", label: "مدیریت محصولات", icon: <FiBox className="w-5 h-5 flex-shrink-0" /> },
    { to: "/seller-dashboard/orders", label: "مدیریت سفارشات", icon: <FiShoppingBag className="w-5 h-5 flex-shrink-0" /> },
    { to: "/seller-dashboard/financial", label: "مدیریت مالی", icon: <FiDollarSign className="w-5 h-5 flex-shrink-0" /> },
    { to: "/seller-dashboard/customers", label: "مدیریت مشتریان", icon: <FiUsers className="w-5 h-5 flex-shrink-0" /> },
    { to: "/seller-dashboard/discounts", label: "مدیریت تخفیف‌ها", icon: <FiTag className="w-5 h-5 flex-shrink-0" /> },
    { to: "/seller-dashboard/reports", label: "گزارشات و آنالیز", icon: <FiBarChart2 className="w-5 h-5 flex-shrink-0" /> },
    { to: "/seller-dashboard/settings", label: "تنظیمات", icon: <FiSettings className="w-5 h-5 flex-shrink-0" /> },
    { to: "/seller-dashboard/team", label: "مدیریت تیم", icon: <FiUserPlus className="w-5 h-5 flex-shrink-0" /> },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await fetch("https://api.grosha.ir/api/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          const errText = await response.text();
          console.error("Failed to fetch user data:", errText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {isMobileView && (
        <button
          onClick={toggleMobileMenu}
          className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-[#00296B] text-white shadow-lg"
        >
          {isMobileMenuOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      )}

      <aside
        className={`fixed right-0 top-0 h-screen w-72 flex flex-col bg-[#00296B] text-white shadow-xl overflow-y-auto transition-all duration-300 z-40
          ${isMobileView ? (isMobileMenuOpen ? "translate-x-0" : "translate-x-full") : "translate-x-0"}`}
        style={{ direction: "rtl" }}
      >
        {isMobileView && (
          <button
            onClick={toggleMobileMenu}
            className="absolute left-4 top-4 p-1 text-white hover:text-[#FDC500]"
          >
            <FiX className="w-6 h-6" />
          </button>
        )}

        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-[#FDC500] flex items-center">
            <span>پنل فروشنده</span>
          </h2>

          <div className="flex items-center p-3 bg-[#003F88] rounded-lg mb-6">
            <div className="w-10 h-10 rounded-full bg-[#FDC500] flex items-center justify-center text-[#00296B] font-bold">
              {userData?.username?.charAt(0) || "U"}
            </div>
            <div className="mr-3">
              <p className="font-medium">{userData?.username || "کاربر"}</p>
              <p className="text-xs text-gray-300">سطح طلایی</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map(({ to, label, icon }) => {
              const isActive = location.pathname === to;

              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => isMobileView && setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                      isActive
                        ? "bg-[#FFD500] text-[#00296B] shadow-md"
                        : "text-white hover:bg-[#003F88]"
                    }`}
                  >
                    <span className={`ml-3 ${isActive ? "text-[#00296B]" : "text-[#FDC500]"}`}>
                      {icon}
                    </span>
                    <span className="flex-1">{label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#00296B]"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {isMobileView && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default SellerSidebar;