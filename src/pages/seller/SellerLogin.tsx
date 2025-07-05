import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaStore, FaPhone, FaUserAlt, FaArrowRight } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

const SellerLogin: React.FC = () => {
    const [credentials, setCredentials] = useState({
        shopName: "",
        phone: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        
        try {
            const response = await fetch("http://localhost:8000/api/sellers/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    shop_name: credentials.shopName,
                    phone: credentials.phone
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("isSeller", "true");
                localStorage.setItem("access_token", data.access);
                navigate("/seller-dashboard");
            } else {
                setError(data.detail || "خطا در ورود. لطفاً اطلاعات را بررسی کنید.");
            }
        } catch (error) {
            console.error(error);
            setError("خطا در اتصال به سرور.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] to-[#e1f0ff] p-4 md:p-8" style={{ direction: "rtl" }}>
            <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-[#2563eb] hover:text-[#1e40af] transition-colors"
                    >
                        <FiArrowLeft className="text-lg" />
                        <span className="font-medium">بازگشت</span>
                    </button>
                    <div className="text-sm text-gray-600">
                        حساب فروشنده ندارید؟{' '}
                        <Link 
                            to="/seller-register"
                            className="text-[#2563eb] hover:underline font-medium"
                        >
                            ثبت‌نام فروشنده
                        </Link>
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
                                    <h1 className="text-2xl md:text-3xl font-bold">ورود فروشندگان</h1>
                                    <p className="mt-2 opacity-90">
                                        به پنل مدیریت فروشگاه خود وارد شوید
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FaUserAlt className="text-[#2563eb]" size={16} />
                                    نام غرفه
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="shopName"
                                        value={credentials.shopName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
                                        placeholder="نام غرفه خود را وارد کنید"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FaPhone className="text-[#2563eb]" size={16} />
                                    تلفن همراه
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={credentials.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all pr-12"
                                        placeholder="مثال: 09123456789"
                                        required
                                    />
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
                                            <span>در حال ورود...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>ورود به پنل فروشنده</span>
                                            <FaArrowRight />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <p className="text-sm text-gray-600">
                                مشکل در ورود دارید؟{' '}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin;