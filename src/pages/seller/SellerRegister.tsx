import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPhone, FiMapPin, FiFileText, FiArrowLeft, FiHome } from "react-icons/fi";
import { FaStore } from "react-icons/fa";

const SellerRegister: React.FC = () => {
    const [formData, setFormData] = useState({
        shopName: "",
        phone: "",
        address: "",
        description: ""
    });
    const [errors, setErrors] = useState({
        shopName: "",
        phone: "",
        address: "",
        description: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };


    const validateForm = () => {
        let formValid = true;
        let validationErrors = { shopName: "", phone: "", address: "", description: "" };

        if (!formData.shopName.trim()) {
            validationErrors.shopName = "نام غرفه ضروری است";
            formValid = false;
        } else if (formData.shopName.length < 5) {
            validationErrors.shopName = "نام غرفه باید حداقل 5 کاراکتر باشد";
            formValid = false;
        }

        const phonePattern = /^09[0-9]{9}$/;
        if (!phonePattern.test(formData.phone)) {
            validationErrors.phone = "شماره تلفن باید 11 رقم باشد و با 09 شروع شود";
            formValid = false;
        }

        if (!formData.address.trim()) {
            validationErrors.address = "آدرس ضروری است";
            formValid = false;
        }

        if (formData.description && formData.description.length > 500) {
            validationErrors.description = "توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد";
            formValid = false;
        }

        setErrors(validationErrors);
        return formValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://localhost:8000/api/sellers/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    shop_name: formData.shopName,
                    phone: formData.phone,
                    address: formData.address,
                    description: formData.description
                })
            });

            if (response.ok) {
                localStorage.setItem("isSeller", "true");
                navigate("/seller-dashboard");
            } else {
                const data = await response.json();
                if (data.code === "token_not_valid") {
                    alert("توکن منقضی شده است. لطفاً دوباره وارد شوید.");
                    localStorage.removeItem("access_token");
                    navigate("/login");
                } else {
                    alert("ثبت‌نام فروشنده با خطا مواجه شد: " + (data.message || "خطای ناشناخته"));
                }
            }
        } catch (error) {
            console.error("خطا در اتصال به سرور:", error);
            alert("خطا در اتصال به سرور");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] to-[#e1f0ff] p-4 md:p-8" style={{ direction: 'rtl' }}>
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-[#2563eb] hover:text-[#1e40af] transition-colors"
                    >
                        <FiArrowLeft className="text-lg" />
                        <span className="font-medium">بازگشت</span>
                    </button>
                    <div className="text-sm text-gray-600">
                        قبلاً ثبت‌نام کرده‌اید؟{' '}
                        <button 
                            onClick={() => navigate("/seller-login")}
                            className="text-[#2563eb] hover:underline font-medium"
                        >
                            ورود فروشندگان
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] p-8 text-white relative">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute top-10 -left-10 w-32 h-32 rounded-full bg-white"></div>
                            <div className="absolute bottom-10 -right-10 w-40 h-40 rounded-full bg-white"></div>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <FaStore className="text-2xl" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">فروشنده شوید</h1>
                                    <p className="mt-2 opacity-90">
                                        کسب‌وکار خود را به هزاران مشتری متصل کنید
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FaStore className="text-[#2563eb]" size={16} />
                                        نام غرفه
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="shopName"
                                            value={formData.shopName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.shopName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all`}
                                            placeholder="مثال: فروشگاه نمونه"
                                        />
                                        {formData.shopName && !errors.shopName && (
                                            <div className="absolute left-3 top-3 text-green-500">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    {errors.shopName && <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        {errors.shopName}
                                    </p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FiPhone className="text-[#2563eb]" size={16} />
                                        تلفن همراه
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all`}
                                            placeholder="مثال: 09123456789"
                                        />
                                        {formData.phone && !errors.phone && (
                                            <div className="absolute left-3 top-3 text-green-500">
                                            </div>
                                        )}
                                    </div>
                                    {errors.phone && <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        {errors.phone}
                                    </p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiMapPin className="text-[#2563eb]" size={16} />
                                    آدرس فروشگاه
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all`}
                                        placeholder="آدرس کامل فروشگاه"
                                    />
                                    {formData.address && !errors.address && (
                                        <div className="absolute left-3 top-3 text-green-500">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {errors.address && <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    {errors.address}
                                </p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FiFileText className="text-[#2563eb]" size={16} />
                                    توضیحات (اختیاری)
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all`}
                                    placeholder="توضیحات درباره فروشگاه و محصولات شما..."
                                ></textarea>
                                <div className="flex justify-between items-center mt-1">
                                    <div className="text-xs text-gray-500">
                                        {formData.description.length}/500 کاراکتر
                                    </div>
                                    {errors.description && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                            </svg>
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white py-4 px-6 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg hover:shadow-[#2563eb]/30 hover:-translate-y-0.5 transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            <span>در حال ثبت‌نام...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaStore />
                                            <span>ثبت‌نام به عنوان فروشنده</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-10 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-bold text-[#1e293b] mb-6 text-center">چرا در پلتفرم ما فروشنده شوید؟</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        icon: <FiHome className="text-2xl text-[#2563eb]" />,
                                        title: "دسترسی به مشتریان",
                                        description: "به هزاران مشتری فعال و علاقه‌مند دسترسی پیدا کنید"
                                    },
                                    {
                                        icon: <svg className="w-6 h-6 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>,
                                        title: "درآمدزایی آسان",
                                        description: "سیستم پرداخت مطمئن و منظم برای دریافت سریع درآمد شما"
                                    },
                                    {
                                        icon: <svg className="w-6 h-6 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>,
                                        title: "پشتیبانی حرفه‌ای",
                                        description: "تیم پشتیبانی اختصاصی برای پاسخگویی به نیازهای شما"
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="bg-[#eff6ff] p-5 rounded-xl text-center">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            {item.icon}
                                        </div>
                                        <h4 className="font-bold text-[#2563eb] mb-2">{item.title}</h4>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerRegister;