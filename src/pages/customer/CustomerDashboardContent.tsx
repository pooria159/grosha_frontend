import React, { useEffect, useState } from "react";
import { FiUser, FiShoppingBag, FiCreditCard, FiGift, FiStar, FiBell, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../api/orders";
import axios from "axios";

interface UserData {
    username: string;
    email: string;
    phone: string;
    date_joined: string; 
}

interface OrderItem {
    id: number;
    product: {
        id: number;
        name: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    status: "pending" | "approved" | "cancelled";
    items: OrderItem[];
    total_price: number;
    created_at: string;
}

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

const CustomerDashboardContent: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    
    

    const handleprofile = () => {
        navigate(`/customer-dashboard/account-setting`);
    };

    const handlescore = () => {
        navigate(`/customer-dashboard/loyalty`);
    };

    const handleother = () => {
        navigate(`/customer-dashboard/orders`);
    };


    const handlediscount = () => {
        navigate(`/customer-dashboard/discount`);
    };

    const handlepool = () => {
        navigate(`/customer-dashboard/wallet`)
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
        const fetchUserData = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                console.error("No access token found");
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
                } else {
                    const errText = await response.text();
                    console.error("Failed to fetch user data:", errText);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                const userId = localStorage.getItem("user-id");
                const userOrders = data.filter((order: Order) => 
                    order.user && order.user.id.toString() === userId
                );
                const sortedOrders = userOrders
                    .sort((a: Order, b: Order) => 
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    )
                    .slice(0, 3);
                setOrders(sortedOrders);
            } catch (error) {
                console.error("خطا در دریافت سفارشات", error);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchUserData();
        fetchOrders();
    }, []);

    const getStatusDetails = (status: "pending" | "approved" | "cancelled" | "delivered" | "completed") => {
        switch(status) {
            case "completed":
                return { 
                    text: "ارسال شده", 
                    color: "bg-green-100 text-green-800"
                };
            case "cancelled":
                return { 
                    text: "لغو شده", 
                    color: "bg-red-100 text-red-800"
                };
            default:
                return { 
                    text: "در حال پردازش", 
                    color: "bg-yellow-100 text-yellow-800"
                };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR');
    };

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        return new Intl.DateTimeFormat('fa-IR', options).format(date);
    };

    return (
        <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen" style={{ direction: 'rtl' }}>
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#00296B] flex items-center justify-center">
                        <FiUser className="ml-2 text-[#00509D]" size={32} />
                        داشبورد مشتری
                    </h1>
                    <p className="text-[#64748b] mt-3 max-w-2xl mx-auto">
                        به پنل کاربری خود خوش آمدید! اینجا می‌توانید اطلاعات حساب، سفارش‌ها و تخفیف‌های خود را مدیریت کنید.
                    </p>
                </div>

                <div className="flex overflow-x-auto mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === "dashboard" ? "text-[#00509D] border-b-2 border-[#00509D]" : "text-[#64748b] hover:text-[#00509D]"}`}
                    >
                        <FiUser className="ml-2" />
                        اطلاعات کاربری
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border-r-4 border-[#00509D]">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-[#1e293b] flex items-center">
                                    <FiUser className="ml-2 text-[#00509D]" size={20} />
                                    اطلاعات حساب کاربری
                                </h2>
                                <button className="text-sm text-[#00509D] hover:text-[#003366]" onClick={handleprofile}>
                                    ویرایش اطلاعات
                                </button>
                            </div>

                            {userData ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-[#64748b]">نام کاربری</label>
                                        <p className="text-[#1e293b] font-medium mt-1">{userData.username}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#64748b]">ایمیل</label>
                                        <p className="text-[#1e293b] font-medium mt-1">{userData.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#64748b]">شماره تماس</label>
                                        <p className="text-[#1e293b] font-medium mt-1">{userData.phone || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#64748b]">تاریخ و زمان عضویت</label>
                                        <p className="text-[#1e293b] font-medium mt-1">
                                            {userData?.date_joined ? formatDateTime(userData.date_joined) : "-"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-[#1e293b] flex items-center">
                                    <FiShoppingBag className="ml-2 text-[#00509D]" size={20} />
                                    سفارش‌های اخیر
                                </h2>
                                <button className="text-sm text-[#00509D] hover:text-[#003366]" onClick={handleother}>
                                    مشاهده همه
                                </button>
                            </div>

                            <div className="space-y-4">
                                {loadingOrders ? (
                                    <div className="animate-pulse space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="border border-gray-200 rounded-lg p-4">
                                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/3 mt-3"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : orders.length > 0 ? (
                                    orders.map((order) => {
                                        const status = getStatusDetails(order.status);
                                        return (
                                            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-[#1e293b]">سفارش {order.id}</h3>
                                                        <div className="flex items-center mt-1 text-sm text-[#64748b]">
                                                            <FiCalendar className="ml-1" size={14} />
                                                            <span>{formatDate(order.created_at)}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`${status.color} text-xs font-medium px-2.5 py-0.5 rounded`}>
                                                        {status.text}
                                                    </span>
                                                </div>
                                                <div className="mt-3 flex justify-between items-center">
                                                    <span className="text-[#1e293b] font-medium">
                                                        {order.total_price.toLocaleString('fa-IR')} تومان
                                                    </span>
                                                    <button 
                                                        className="text-sm text-[#00509D] hover:text-[#003366]"
                                                        onClick={() => navigate(`/customer-dashboard/orders?order=${order.id}`)}
                                                    >
                                                        جزئیات سفارش
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        هیچ سفارشی یافت نشد
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-[#1e293b] flex items-center">
                                    <FiStar className="ml-2 text-[#FDC500]" size={20} />
                                    وضعیت وفاداری
                                </h2>
                            </div>

                            <div className="flex items-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FDC500] to-[#FFD700] flex items-center justify-center text-white font-bold text-xl mr-3">
                                    طلایی
                                </div>
                                <div>
                                    <p className="text-[#1e293b] font-medium">سطح کاربری شما</p>
                                    <p className="text-sm text-[#64748b]">۱۲۵۰ امتیاز</p>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between text-sm text-[#64748b] mb-1">
                                    <span>۳۵۰ امتیاز تا سطح بعدی</span>
                                    <span>پلاتینیوم</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-[#FDC500] to-[#FFD700] h-2 rounded-full" 
                                        style={{ width: '65%' }}
                                    ></div>
                                </div>
                            </div>

                            <button className="w-full mt-4 text-sm bg-gradient-to-r from-[#FDC500] to-[#FFD700] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                onClick={handlescore}>
                                مشاهده مزایا
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-4">
                                <FiCreditCard className="ml-2 text-[#00509D]" size={20} />
                                کیف پول و تخفیف‌ها
                            </h2>

                            <div className="bg-gradient-to-r from-[#00509D] to-[#00296B] rounded-xl p-4 text-white mb-4">
                                <p className="text-sm mb-2">موجودی کیف پول</p>
                                <p className="text-2xl font-bold">۵۰۰,۰۰۰ <span className="text-sm font-normal">تومان</span></p>
                                <button className="mt-2 text-xs bg-white text-[#00509D] py-1 px-3 rounded-full font-medium hover:bg-opacity-90 transition-opacity"
                                    onClick={handlepool}>
                                    افزایش موجودی
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-[#f0f9ff] border border-[#bae6fd]">
                                    <div className="flex items-center">
                                        <FiBell className="text-[#00509D] ml-2" />
                                        <span className="text-[#00509D]">کوپن‌های موجود</span>
                                    </div>
                                    <span className="font-bold text-[#00509D]">{discounts.length.toLocaleString('fa-IR')} عدد</span>
                                </div>

                                <button className="w-full text-sm bg-gradient-to-r from-[#00509D] to-[#00296B] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                    onClick={handlediscount}>
                                    مشاهده همه تخفیف‌ها
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboardContent;