import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiSearch, FiChevronDown, FiLogOut, FiShoppingBag, FiHome, FiInfo, FiMail } from "react-icons/fi";
import CategoryMenu from "../pages/CategoryMenu";

const Header: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [hasShop, setHasShop] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const sellerStatus = localStorage.getItem("isSeller") === "true";
    const token = localStorage.getItem("access_token");

    if (savedUser) setUser(savedUser);
    if (sellerStatus) {
      setIsSeller(true);
      
      if (token) {
        fetch("http://localhost:8000/api/sellers/check-shop/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => {
          setHasShop(data.has_shop);
        })
        .catch(error => {
          console.error("Error checking shop status:", error);
        });
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("isSeller");
    localStorage.removeItem("access_token"); 
    
    setUser(null);
    setIsSeller(false);
    
    navigate("/", { replace: true });
    window.location.reload();
  };

  const handleSellerLogout = () => {
    localStorage.removeItem("isSeller");
    setIsSeller(false);
    setDropdownOpen(false);
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/customer-dashboard");
  };

  const goToSellerRegister = () => {
    setDropdownOpen(false);
    navigate("/seller-register");
  };

  const goToSellerLogin = () => {
    setDropdownOpen(false);
    navigate("/seller-login");
  };

  const goToSellerDashboard = () => {
    navigate("/seller-dashboard");
  };


  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg fixed top-0 left-0 w-full z-50" style={{ direction: "rtl" }}>
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="text-3xl font-bold text-yellow-400 transition-colors flex items-center">
            <span className="hidden sm:inline">گروشا</span>
            <span className="text-4xl">🛒</span>
          </div>
        </div>

        <div className={`relative w-full md:w-1/3 transition-all duration-300 ${searchFocused ? "scale-105" : ""}`}>
          <input
            type="search"
            placeholder="جستجو در محصولات..."
            className="w-full border-2 border-yellow-400 rounded-full px-4 py-2 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        <div className="flex items-center gap-4 md:gap-6 relative" ref={dropdownRef}>
          {user && (
            <a href="/shopping-cart" className="relative group" title="سبد خرید">
              <FiShoppingCart className="w-6 h-6 text-white group-hover:text-yellow-400 transition-colors" />
            </a>
          )}

          {isSeller && (
            <button
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-1 rounded-full flex items-center gap-1 transition-colors shadow-md hover:shadow-lg"
              onClick={goToSellerDashboard}
            >
              <FiShoppingBag className="w-4 h-4" />
              <span>غرفه من</span>
            </button>
          )}

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="flex items-center gap-1 group"
                title="پروفایل"
              >
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <FiChevronDown className={`w-4 h-4 text-white transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-12 left-0 bg-white text-gray-800 shadow-xl rounded-lg p-2 w-56 text-right z-50 border border-gray-200 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-gray-100">
                   {user ? (
                      <>
                        <p className="font-medium text-sm truncate">{user}</p>
                        <p className="text-xs text-gray-500">مشتری عزیز، خوش آمدید</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-sm text-gray-500">خوش آمدید</p>
                        <p className="text-xs text-gray-400">لطفا وارد شوید</p>
                      </>
                    )}

                  </div>
                  
                  <button 
                    onClick={goToProfile} 
                    className="w-full text-right px-3 py-2 hover:bg-blue-50 rounded-md flex items-center justify-between transition-colors"
                  >
                    <span>پروفایل کاربری</span>
                    <FiUser className="w-4 h-4" />
                  </button>
                  
                  {isSeller ? (
                    <button 
                      onClick={handleSellerLogout}
                      className="w-full text-right px-3 py-2 hover:bg-blue-50 rounded-md flex items-center justify-between transition-colors"
                    >
                      <span>خروج از غرفه</span>
                      <FiLogOut className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={goToSellerRegister}
                        className={`w-full text-right px-3 py-2 rounded-md flex items-center justify-between transition-colors ${hasShop ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-50'}`}
                        disabled={hasShop}
                      >
                        <span>ایجاد غرفه فروش</span>
                        <FiShoppingBag className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={goToSellerLogin}
                        className="w-full text-right px-3 py-2 hover:bg-blue-50 rounded-md flex items-center justify-between transition-colors"
                      >
                        <span>ورود فروشندگان</span>
                        <FiShoppingBag className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-right px-3 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center justify-between transition-colors mt-1 border-t border-gray-100"
                  >
                    <span>خروج از حساب</span>
                    <FiLogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-1 rounded-full flex items-center gap-1 transition-colors shadow-md hover:shadow-lg"
              onClick={() => navigate("/login")}
            >
              <FiUser className="w-4 h-4" />
              <span>ورود / ثبت‌نام</span>
            </button>
          )}
        </div>
      </div>

      <nav className="bg-blue-800 py-2 border-t border-blue-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-white text-sm md:text-base">
            <a href="/" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
              <FiHome className="w-4 h-4" />
              <span>خانه</span>
            </a>
            <a href="/about" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
              <FiInfo className="w-4 h-4" />
              <span>درباره ما</span>
            </a>
            <a href="/shop" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
              <FiShoppingBag className="w-4 h-4" />
              <span>فروشگاه</span>
            </a>
            <CategoryMenu />
            <a href="/blog" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
              <span>وبلاگ</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;