import React, { useEffect, useState } from "react";
import { 
  FiUser, FiMail, FiPhone, FiLock, 
  FiCheckCircle, FiAlertCircle, FiKey,
  FiShield, FiInfo, FiEdit2
} from "react-icons/fi";

interface UserData {
  username: string;
  email: string;
  phone: string;
}

const AccountSettingsPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    new_password: "",
    confirm_password: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setFormData(prev => ({
            ...prev,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: "",
            new_password: "",
            confirm_password: ""
          }));
        } else {
          const errText = await response.text();
          console.error("Failed to fetch user data:", errText);
          setErrorMessage("خطا در دریافت اطلاعات کاربر");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("خطا در اتصال به سرور");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (activeTab === "info") {
      if (formData.username.length < 2) {
        setErrorMessage("نام کاربری باید حداقل ۲ حرف باشد.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage("فرمت ایمیل معتبر نیست.");
        return false;
      }
      const phoneRegex = /^\d{11}$/;
      if (!phoneRegex.test(formData.phone)) {
        setErrorMessage("شماره موبایل باید ۱۱ رقم باشد.");
        return false;
      }
    } else if (activeTab === "security") {
      if (formData.new_password && formData.new_password.length < 6) {
        setErrorMessage("رمز عبور جدید باید حداقل ۶ حرف باشد.");
        return false;
      }
      if (formData.new_password !== formData.confirm_password) {
        setErrorMessage("رمز عبور جدید با تأییدیه مطابقت ندارد.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      setIsSaving(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setErrorMessage("لطفاً ابتدا وارد شوید");
      setIsSaving(false);
      return;
    }

    const submitData = activeTab === "security" && formData.new_password
      ? { 
          password: formData.password,
          new_password: formData.new_password
        }
      : {
          username: formData.username,
          email: formData.email,
          phone: formData.phone
        };

    try {
      const response = await fetch("http://localhost:8000/api/users/profile/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setSuccessMessage("تغییرات با موفقیت ذخیره شد");
        if (activeTab === "security") {
          setFormData(prev => ({
            ...prev,
            password: "",
            new_password: "",
            confirm_password: ""
          }));
        }
      } else {
        const errData = await response.json();
        setErrorMessage(
          errData.password?.[0] ||
          errData.new_password?.[0] ||
          "خطا در ذخیره تغییرات"
        );
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setErrorMessage("خطا در اتصال به سرور");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ direction: 'rtl' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <FiUser className="ml-2 text-blue-600" size={32} />
            تنظیمات حساب کاربری
          </h1>
          <p className="text-lg text-gray-600">
            اطلاعات شخصی و تنظیمات امنیتی خود را مدیریت کنید
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/4 bg-gradient-to-b from-blue-50 to-blue-100 p-6">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`w-full text-right px-4 py-3 rounded-xl font-medium flex items-center transition-all ${activeTab === "info" ? 'bg-white shadow-md text-blue-600' : 'text-gray-700 hover:bg-white/50 hover:text-blue-600'}`}
                >
                  <FiUser className="ml-2" />
                  اطلاعات شخصی
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-right px-4 py-3 rounded-xl font-medium flex items-center transition-all ${activeTab === "security" ? 'bg-white shadow-md text-blue-600' : 'text-gray-700 hover:bg-white/50 hover:text-blue-600'}`}
                >
                  <FiShield className="ml-2" />
                  امنیت حساب
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-blue-200">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <FiInfo className="ml-2 text-blue-500" />
                  نکات امنیتی
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>از رمز عبور قوی و منحصر به فرد استفاده کنید</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>رمز عبور خود را با کسی به اشتراک نگذارید</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>به طور دوره‌ای رمز عبور خود را تغییر دهید</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:w-3/4 p-8">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : errorMessage && !userData ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center bg-red-100 text-red-700 p-4 rounded-xl">
                    <FiAlertCircle className="ml-2" />
                    <span>{errorMessage}</span>
                  </div>
                </div>
              ) : (
                <>
                  {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center">
                      <FiCheckCircle className="ml-2 text-xl" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center">
                      <FiAlertCircle className="ml-2 text-xl" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {activeTab === "info" && (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
                            <FiEdit2 className="ml-2 text-blue-500" />
                            ویرایش اطلاعات شخصی
                          </h2>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">نام کاربری</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiUser />
                                </div>
                                <input
                                  id="username"
                                  name="username"
                                  type="text"
                                  className="block w-full pr-10 pl-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                  value={formData.username}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">آدرس ایمیل</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiMail />
                                </div>
                                <input
                                  id="email"
                                  name="email"
                                  type="email"
                                  className="block w-full pr-10 pl-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">شماره موبایل</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiPhone />
                                </div>
                                <input
                                  id="phone"
                                  name="phone"
                                  type="tel"
                                  className="block w-full pr-10 pl-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  placeholder="09xxxxxxxxx"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isSaving ? 'opacity-80' : ''}`}
                          >
                            {isSaving ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                در حال ذخیره...
                              </>
                            ) : 'ذخیره تغییرات'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {activeTab === "security" && (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
                            <FiKey className="ml-2 text-blue-500" />
                            تنظیمات امنیتی
                          </h2>
                          
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">رمز عبور جدید</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiLock />
                                </div>
                                <input
                                  id="new_password"
                                  name="new_password"
                                  type="password"
                                  className="block w-full pr-10 pl-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                  value={formData.new_password}
                                  onChange={handleInputChange}
                                  placeholder="حداقل ۶ کاراکتر"
                                />
                              </div>
                            </div>

                            {formData.new_password && (
                              <>
                                <div>
                                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">تأیید رمز عبور جدید</label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                      <FiLock />
                                    </div>
                                    <input
                                      id="confirm_password"
                                      name="confirm_password"
                                      type="password"
                                      className="block w-full pr-10 pl-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                      value={formData.confirm_password}
                                      onChange={handleInputChange}
                                      placeholder="تکرار رمز عبور جدید"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">رمز عبور فعلی</label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                      <FiLock />
                                    </div>
                                    <input
                                      id="password"
                                      name="password"
                                      type="password"
                                      className="block w-full pr-10 pl-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                                      value={formData.password}
                                      onChange={handleInputChange}
                                      placeholder="برای تأیید تغییرات وارد کنید"
                                    />
                                  </div>
                                  <p className="mt-2 text-sm text-gray-500">برای تغییر رمز عبور، رمز عبور فعلی خود را وارد کنید</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <button
                            type="submit"
                            disabled={isSaving || !formData.new_password}
                            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isSaving ? 'opacity-80' : ''} ${!formData.new_password ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isSaving ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                در حال ذخیره...
                              </>
                            ) : 'تغییر رمز عبور'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;