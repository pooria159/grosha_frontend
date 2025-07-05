import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaUserPlus, FaArrowRight, FaGift } from "react-icons/fa";
import { FiAward } from "react-icons/fi";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: ""
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    email: "",
    phone: ""
  });

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let formValid = true;
    let validationErrors = { username: "", password: "", email: "", phone: "" };

    if (!formData.username.trim()) {
      validationErrors.username = "نام کاربری ضروری است.";
      formValid = false;
    } else if (formData.username.length < 2) {
      validationErrors.username = "نام کاربری باید حداقل 2 کاراکتر باشد.";
      formValid = false;
    }

    if (formData.password.length < 6) {
      validationErrors.password = "رمز عبور باید حداقل 6 کاراکتر باشد.";
      formValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(formData.email)) {
      validationErrors.email = "آدرس ایمیل باید با @gmail.com تمام شود.";
      formValid = false;
    }

    const phonePattern = /^09[0-9]{9}$/;
    if (!phonePattern.test(formData.phone)) {
      validationErrors.phone = "شماره تلفن باید 11 رقم باشد و با 09 شروع شود.";
      formValid = false;
    }

    setErrors(validationErrors);
    return formValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const checkResponse = await fetch("http://localhost:8000/api/users/check-duplicates/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone
        })
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        alert(checkData.error || "خطا در بررسی اطلاعات");
        return;
      }

      if (checkData.email_exists) {
        setErrors(prev => ({ ...prev, email: "این ایمیل قبلاً ثبت شده است." }));
        return;
      }

      if (checkData.phone_exists) {
        setErrors(prev => ({ ...prev, phone: "این شماره تلفن قبلاً ثبت شده است." }));
        return;
      }

      const registerResponse = await fetch("http://localhost:8000/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        alert("ثبت‌نام موفق! اکنون وارد شوید.");
        navigate("/login");
      } else {
        if (registerData.email) {
          setErrors(prev => ({ ...prev, email: registerData.email[0] }));
        }
        if (registerData.phone) {
          setErrors(prev => ({ ...prev, phone: registerData.phone[0] }));
        }
        alert(registerData.error || "مشکلی در ثبت نام وجود دارد.");
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
          <div className="bg-gradient-to-r from-[#10b981] to-[#34d399] p-6 text-center relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`}></div>
            <div className="relative z-10 flex items-center justify-center">
              <FiAward className="text-white mr-2" size={28} />
              <h2 className="text-2xl font-bold text-white">ثبت‌نام در سامانه</h2>
            </div>
          </div>

          <form onSubmit={handleRegister} className="p-6 space-y-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748b] group-focus-within:text-[#3b82f6] transition-colors">
                <FaUser />
              </div>
              <input
                name="username"
                type="text"
                placeholder="نام کاربری"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-b-2 border-[#e2e8f0] focus:border-[#3b82f6] focus:outline-none bg-transparent transition-all duration-300 text-right"
                required
              />
              <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#3b82f6] transition-all duration-300 group-focus-within:w-full"></div>
              {errors.username && <p className="text-red-500 text-xs mt-1 pr-3">{errors.username}</p>}
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748b] group-focus-within:text-[#3b82f6] transition-colors">
                <FaLock />
              </div>
              <input
                name="password"
                type="password"
                placeholder="رمز عبور"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-b-2 border-[#e2e8f0] focus:border-[#3b82f6] focus:outline-none bg-transparent transition-all duration-300 text-right"
                required
              />
              <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#3b82f6] transition-all duration-300 group-focus-within:w-full"></div>
              {errors.password && <p className="text-red-500 text-xs mt-1 pr-3">{errors.password}</p>}
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748b] group-focus-within:text-[#3b82f6] transition-colors">
                <FaEnvelope />
              </div>
              <input
                name="email"
                type="email"
                placeholder="آدرس ایمیل"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-b-2 border-[#e2e8f0] focus:border-[#3b82f6] focus:outline-none bg-transparent transition-all duration-300 text-right"
                required
              />
              <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#3b82f6] transition-all duration-300 group-focus-within:w-full"></div>
              {errors.email && <p className="text-red-500 text-xs mt-1 pr-3">{errors.email}</p>}
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748b] group-focus-within:text-[#3b82f6] transition-colors">
                <FaPhone />
              </div>
              <input
                name="phone"
                type="tel"
                placeholder="شماره تلفن"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-b-2 border-[#e2e8f0] focus:border-[#3b82f6] focus:outline-none bg-transparent transition-all duration-300 text-right"
              />
              <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#3b82f6] transition-all duration-300 group-focus-within:w-full"></div>
              {errors.phone && <p className="text-red-500 text-xs mt-1 pr-3">{errors.phone}</p>}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white py-3 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:from-[#1d4ed8] hover:to-[#3b82f6] group"
            >
              <span>ثبت‌نام در سامانه</span>
              <FaUserPlus className="mr-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="flex-grow border-t border-[#e2e8f0]"></div>
              <span className="flex-shrink mx-4 text-[#64748b] text-sm">حساب دارید؟</span>
              <div className="flex-grow border-t border-[#e2e8f0]"></div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex items-center justify-center w-full text-[#3b82f6] font-medium hover:text-[#1d4ed8] transition-colors border border-[#3b82f6] rounded-lg py-2.5 px-4 hover:bg-[#3b82f6]/10"
              >
                <span>ورود به حساب کاربری</span>
                <FaArrowRight className="mr-2" />
              </button>
            </div>
          </form>

          <div className="bg-[#f8fafc] p-6 border-t border-[#e2e8f0]">
            <h3 className="flex items-center text-[#1e293b] font-medium mb-3">
              <FaGift className="mr-2 text-[#10b981]" />
              مزایای عضویت در سامانه
            </h3>
            <ul className="space-y-2 text-sm text-[#475569] pr-4">
              <li className="flex items-start">
                <span className="text-[#3b82f6] ml-2">•</span>
                <span>امکان ذخیره اطلاعات شخصی</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3b82f6] ml-2">•</span>
                <span>دسترسی به پیشنهادات ویژه</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3b82f6] ml-2">•</span>
                <span>امکان پیگیری سفارشات</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#3b82f6] ml-2">•</span>
                <span>پشتیبانی اختصاصی برای اعضا</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;