import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaArrowRight, FaSignInAlt, FaUserPlus, FaGift } from "react-icons/fa";
import { FiAward } from "react-icons/fi";

interface LoginProps {
  setUser: (user: string | null) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user", credentials.username);
        localStorage.setItem("user-id", String(data.user_id));

        setUser(credentials.username);
        navigate("/");
      } else {
        alert(data.detail || "مشکلی در ورود به حساب وجود دارد.");
      }
    } catch (error) {
      console.error(error);
      alert("خطا در اتصال به سرور.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] p-6 text-center relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`}></div>
            <div className="relative z-10 flex items-center justify-center">
              <FiAward className="text-white mr-2" size={28} />
              <h2 className="text-2xl font-bold text-white">ورود به حساب کاربری</h2>
            </div>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748b] group-focus-within:text-[#3b82f6] transition-colors">
                <FaUser />
              </div>
              <input
                name="username"
                type="text"
                placeholder="نام کاربری"
                value={credentials.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-b-2 border-[#e2e8f0] focus:border-[#3b82f6] focus:outline-none bg-transparent transition-all duration-300 text-right"
                required
              />
              <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#3b82f6] transition-all duration-300 group-focus-within:w-full"></div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748b] group-focus-within:text-[#3b82f6] transition-colors">
                <FaLock />
              </div>
              <input
                name="password"
                type="password"
                placeholder="رمز عبور"
                value={credentials.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-b-2 border-[#e2e8f0] focus:border-[#3b82f6] focus:outline-none bg-transparent transition-all duration-300 text-right"
                required
              />
              <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#3b82f6] transition-all duration-300 group-focus-within:w-full"></div>
            </div>


            <button
              type="submit"
              className="w-full flex items-center justify-center bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white py-3 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:from-[#1d4ed8] hover:to-[#3b82f6] group"
            >
              <span>ورود به حساب</span>
              <FaSignInAlt className="mr-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="flex-grow border-t border-[#e2e8f0]"></div>
              <span className="flex-shrink mx-4 text-[#64748b] text-sm">یا</span>
              <div className="flex-grow border-t border-[#e2e8f0]"></div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="flex items-center justify-center w-full text-[#3b82f6] font-medium hover:text-[#1d4ed8] transition-colors border border-[#3b82f6] rounded-lg py-2.5 px-4 hover:bg-[#3b82f6]/10"
              >
                <span>ایجاد حساب جدید</span>
                <FaUserPlus className="mr-2" />
              </button>
            </div>
          </form>

          <div className="bg-[#f8fafc] p-6 border-t border-[#e2e8f0]">
            <h3 className="flex items-center text-[#1e293b] font-medium mb-3">
              <FaGift className="mr-2 text-[#f59e0b]" />
              مزایای عضویت
            </h3>
            <ul className="space-y-2 text-sm text-[#475569] pr-4">
              <li className="flex items-start">
                <span className="text-[#3b82f6] ml-2">•</span>
                <span>تخفیف‌های ویژه اعضا</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3b82f6] ml-2">•</span>
                <span>پیگیری سفارشات</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3b82f6] ml-2">•</span>
                <span>امکان ذخیره آدرس‌ها</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3b82f6] ml-2">•</span>
                <span>دسترسی به تاریخچه خرید</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;