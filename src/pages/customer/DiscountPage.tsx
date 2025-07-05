import React, { useEffect, useState } from "react";
import axios from "axios";
import { instantDiscounts, InstantDiscount } from "../../data/discountsList";
import { FiClock, FiCopy, FiGift, FiPercent, FiAward, FiUser, FiAlertCircle, FiCalendar, FiCheck, FiX } from "react-icons/fi";

interface Discount {
    id: number;
    title: string;
    code: string;
    description: string;
    percentage: number;
    for_first_purchase: boolean;
    is_single_use: boolean;
    min_order_amount: number;
    valid_from: string;
    valid_to: string;
    is_active: boolean;
    is_valid: boolean;
    remaining_time: string;
    seller?: number;
    seller_name?: string;
    shop_name?: string;
}

const DiscountPage: React.FC = () => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [instantDiscountsToShow, setInstantDiscountsToShow] = useState<InstantDiscount[]>([]);
    const [remainingTime, setRemainingTime] = useState<string>("2:00:00");
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDiscountStatus = (discount: Discount) => {
        if (!discount.is_active) {
            return { text: "غیرفعال", color: "text-gray-500 bg-gray-50", border: "border-gray-200" };
        }
        
        if (!discount.is_valid) {
            return { text: "منقضی شده", color: "text-red-500 bg-red-50", border: "border-red-200" };
        }

        if (new Date(discount.valid_to) < new Date()) {
            return { text: "پایان یافته", color: "text-amber-500 bg-amber-50", border: "border-amber-200" };
        }

        return { text: "فعال", color: "text-green-500 bg-green-50", border: "border-green-200" };
    };

    useEffect(() => {
        const fetchDiscounts = async () => {
            const token = localStorage.getItem("access_token");
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:8000/api/discounts/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                setDiscounts(res.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching discounts", err);
                setError("خطا در دریافت تخفیف‌ها. لطفا دوباره تلاش کنید.");
            } finally {
                setLoading(false);
            }
        };

        fetchDiscounts();
    }, []);

    useEffect(() => {
        const selectRandomDiscounts = () => {
            const shuffled = [...instantDiscounts].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, 2);
        };

        const savedDiscounts = localStorage.getItem("instantDiscounts");
        const savedTime = localStorage.getItem("instantDiscountsTime");

        const currentTime = new Date().getTime();
        const twoHoursInMs = 2 * 60 * 60 * 1000;

        if (savedDiscounts && savedTime) {
            const parsedTime = parseInt(savedTime);
            if (currentTime - parsedTime < twoHoursInMs) {
                setInstantDiscountsToShow(JSON.parse(savedDiscounts));
                return;
            }
        }

        const newDiscounts = selectRandomDiscounts();
        setInstantDiscountsToShow(newDiscounts);
        localStorage.setItem("instantDiscounts", JSON.stringify(newDiscounts));
        localStorage.setItem("instantDiscountsTime", currentTime.toString());
    }, []);

    useEffect(() => {
        const updateRemainingTime = () => {
            const savedTime = localStorage.getItem("instantDiscountsTime");
            if (!savedTime) {
                setRemainingTime("2:00:00");
                return;
            }

            const endTime = parseInt(savedTime) + 2 * 60 * 60 * 1000;
            const now = new Date().getTime();
            const diff = endTime - now;

            if (diff <= 0) {
                setRemainingTime("00:00:00");
                const newDiscounts = [...instantDiscounts].sort(() => 0.5 - Math.random()).slice(0, 2);
                setInstantDiscountsToShow(newDiscounts);
                localStorage.setItem("instantDiscounts", JSON.stringify(newDiscounts));
                localStorage.setItem("instantDiscountsTime", new Date().getTime().toString());
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setRemainingTime(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        updateRemainingTime();
        const timerId = setInterval(updateRemainingTime, 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen p-4 md:p-8" style={{ direction: 'rtl' }}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] flex items-center justify-center">
                        <FiGift className="ml-2 text-[#3b82f6]" size={32} />
                        تخفیف‌های ویژه
                    </h1>
                    <p className="text-[#64748b] mt-3 max-w-2xl mx-auto">
                        از کدهای تخفیف منحصر به فرد ما استفاده کنید و در خریدهای خود صرفه‌جویی کنید
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-[#ef4444]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#1e293b] flex items-center">
                                    <FiClock className="ml-2 text-[#ef4444]" size={20} />
                                    تخفیف‌های لحظه‌ای
                                </h2>
                                <div className="bg-gradient-to-r from-[#ef4444] to-[#f87171] text-white px-4 py-2 rounded-full text-sm flex items-center animate-pulse">
                                    <FiClock className="ml-1" size={16} />
                                    زمان باقی‌مانده: {remainingTime}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {instantDiscountsToShow.map((d) => (
                                    <div
                                        key={d.id}
                                        className="bg-gradient-to-br from-white to-[#fef2f2] p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden border border-[#fee2e2]"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ef4444] to-[#fca5a5]"></div>

                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-bold text-[#b91c1c] flex items-center">
                                                <FiPercent className="ml-1" size={18} />
                                                {d.title}
                                            </h3>
                                            <span className="bg-[#fee2e2] text-[#b91c1c] px-2 py-1 rounded-full text-xs font-bold">
                                                {d.percentage}% تخفیف
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-700 mb-4 text-sm">{d.description}</p>
                                        
                                        <div className="flex items-center justify-between bg-[#f5f5f5] p-2 rounded-lg">
                                            <span className="font-mono font-bold text-gray-800">{d.code}</span>
                                            <button
                                                onClick={() => copyToClipboard(d.code)}
                                                className={`flex items-center text-sm px-3 py-1 rounded-md transition-all ${
                                                    copiedCode === d.code 
                                                        ? "bg-green-500 text-white"
                                                        : "bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                                                }`}
                                            >
                                                <FiCopy className="ml-1" size={14} />
                                                {copiedCode === d.code ? "کپی شد!" : "کپی"}
                                            </button>
                                        </div>
                                        
                                        {d.for_first_purchase && (
                                            <div className="mt-3 flex items-center text-xs text-[#3b82f6]">
                                                <FiUser className="ml-1" size={14} />
                                                مخصوص اولین خرید
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-6">
                                <FiAward className="ml-2 text-[#3b82f6]" size={20} />
                                تخفیف‌های شما
                            </h2>

                            {loading ? (
                                <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                                    <div className="animate-pulse flex flex-col items-center">
                                        <div className="h-8 w-8 bg-gray-300 rounded-full mb-3"></div>
                                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                                    <FiAlertCircle className="mx-auto text-red-400 mb-3" size={32} />
                                    <h4 className="text-red-600 font-medium mb-1">خطا در دریافت داده‌ها</h4>
                                    <p className="text-gray-500 text-sm">{error}</p>
                                </div>
                            ) : discounts.length === 0 ? (
                                <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                                    <FiAlertCircle className="mx-auto text-gray-400 mb-3" size={32} />
                                    <h4 className="text-gray-600 font-medium mb-1">تخفیفی یافت نشد</h4>
                                    <p className="text-gray-500 text-sm">در حال حاضر هیچ کد تخفیف فعالی برای شما وجود ندارد</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {discounts.map((d) => {
                                        const status = getDiscountStatus(d);
                                        return (
                                            <div
                                                key={d.id}
                                                className={`bg-gradient-to-br from-white to-[#f0f9ff] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border ${status.border} relative`}
                                            >
                                                {d.seller && (
                                                    <div className="absolute top-1 right-3 flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-200 shadow-sm">
                                                        <FiUser className="ml-1" size={12} />
                                                        <span>{d.shop_name || d.seller_name || "فروشنده"}</span>
                                                    </div>
                                                )}
                                                
                                                <div className={`absolute top-1 left-3 flex items-center text-xs ${status.color} px-2 py-1 rounded-full border ${status.border} shadow-sm`}>
                                                    {status.text === "فعال" ? (
                                                        <FiCheck className="ml-1" size={12} />
                                                    ) : status.text === "منقضی شده" ? (
                                                        <FiX className="ml-1" size={12} />
                                                    ) : (
                                                        <FiClock className="ml-1" size={12} />
                                                    )}
                                                    <span>{status.text}</span>
                                                </div>
                                                
                                                <div className="flex items-start justify-between mb-3 pt-5">
                                                    <h3 className="text-lg font-bold text-[#0369a1] flex items-center">
                                                        <FiGift className="ml-1" size={18} />
                                                        {d.title}
                                                    </h3>
                                                    <span className="bg-[#e0f2fe] text-[#0369a1] px-2 py-1 rounded-full text-xs font-bold">
                                                        {d.percentage}% تخفیف
                                                    </span>
                                                </div>
                                                
                                                <p className="text-gray-700 mb-4 text-sm">{d.description}</p>
                                                
                                                <div className="flex items-center justify-between bg-[#f5f5f5] p-2 rounded-lg">
                                                    <span className="font-mono font-bold text-gray-800">{d.code}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(d.code)}
                                                        className={`flex items-center text-sm px-3 py-1 rounded-md transition-all ${
                                                            copiedCode === d.code 
                                                                ? "bg-green-500 text-white"
                                                                : "bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                                                        }`}
                                                    >
                                                        <FiCopy className="ml-1" size={14} />
                                                        {copiedCode === d.code ? "کپی شد!" : "کپی"}
                                                    </button>
                                                </div>
                                                
                                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                                                    <div className="flex items-center text-gray-500">
                                                        <FiClock className="ml-1" size={12} />
                                                        <span>مانده: {d.remaining_time}</span>
                                                    </div>
                                                    {d.min_order_amount > 0 && (
                                                        <div className="flex items-center text-gray-500">
                                                            <span>حداقل خرید: {d.min_order_amount.toLocaleString()} تومان</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {d.for_first_purchase && (
                                                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full flex items-center">
                                                            <FiUser className="ml-1" size={12} />
                                                            اولین خرید
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-6">
                        <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-4">
                            <FiGift className="ml-2 text-[#3b82f6]" size={20} />
                            راهنمای تخفیف‌ها
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-[#f0fdf4] p-4 rounded-lg border border-[#bbf7d0]">
                                <h3 className="font-medium text-[#166534] mb-2 flex items-center">
                                    <FiAward className="ml-1" size={16} />
                                    نکات مهم
                                </h3>
                                <ul className="text-sm text-[#166534] space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-[#22c55e] mr-2">•</span>
                                        <span>تخفیف‌ها در تاریخ مشخص شده معتبر هستند</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-[#22c55e] mr-2">•</span>
                                        <span>تخفیف‌های یکبار مصرف فقط برای یک سفارش قابل استفاده هستند</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-[#22c55e] mr-2">•</span>
                                        <span>تخفیف‌های اولین خرید فقط برای حساب‌های جدید اعمال می‌شود</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#eff6ff] p-4 rounded-lg border border-[#bfdbfe]">
                                <h3 className="font-medium text-[#1e40af] mb-2 flex items-center">
                                    <FiPercent className="ml-1" size={16} />
                                    نحوه استفاده
                                </h3>
                                <ol className="text-sm text-[#1e40af] space-y-2 list-decimal pr-4">
                                    <li>کد تخفیف را کپی کنید</li>
                                    <li>در صفحه پرداخت، کد را وارد کنید</li>
                                    <li>مبلغ نهایی با اعمال تخفیف نمایش داده می‌شود</li>
                                </ol>
                            </div>

                            <div className="bg-[#fef2f2] p-4 rounded-lg border border-[#fecaca]">
                                <h3 className="font-medium text-[#b91c1c] mb-2 flex items-center">
                                    <FiAlertCircle className="ml-1" size={16} />
                                    شرایط استفاده
                                </h3>
                                <ul className="text-sm text-[#b91c1c] space-y-2">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>حداقل خرید برای برخی کدها ممکن است اعمال شود</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>تخفیف‌ها قابل ترکیب با سایر پیشنهادات نیستند</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>تخفیف‌های فروشگاهی فقط برای همان فروشگاه معتبر هستند</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscountPage;