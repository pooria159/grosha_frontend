import React, { useState, useEffect, useRef } from "react";
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck, 
  FiArrowUp, FiClock, FiCalendar, FiGift, FiPercent, 
  FiAlertCircle,FiDollarSign
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns';

interface Discount {
  id: number;
  seller?: number | null;
  seller_name?: string;
  shop_name?: string;
  title: string;
  code: string;
  description: string;
  percentage: number;
  is_active: boolean;
  for_first_purchase: boolean;
  is_single_use: boolean;
  min_order_amount: number;
  valid_from: string;
  valid_to: string;
  created_at: string;
  updated_at: string;
  remaining_time: string;
  is_valid: boolean;
}

const DiscountManagement: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [newDiscount, setNewDiscount] = useState<Omit<Discount, "id" | "created_at" | "updated_at" | "remaining_time" | "is_valid" | "seller_name" | "shop_name">>({
    title: "",
    code: "",
    description: "",
    percentage: 1,
    is_active: true,
    for_first_purchase: false,
    is_single_use: true,
    min_order_amount: 0,
    valid_from: new Date().toISOString(),
    valid_to: addDays(new Date(), 7).toISOString(),
  });
  const [editDiscountId, setEditDiscountId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [discountToDelete, setDiscountToDelete] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const topRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const refreshAccessToken = async () => {
    if (!refresh_token) {
      console.error("Refresh token not found.");
      return null;
    }

    try {
      const response = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refresh_token }),
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.access;
        localStorage.setItem("access_token", newAccessToken);
        return newAccessToken;
      } else {
        console.error("Error refreshing token.");
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  const fetchDiscounts = async () => {
    setLoading(true);
    setApiError(null);
    try {
      let currentToken = token;

      if (!currentToken) {
        currentToken = await refreshAccessToken();
      }

      if (!currentToken) {
        setApiError("لطفاً مجدداً وارد شوید");
        return;
      }

      const response = await fetch("http://localhost:8000/api/discount/", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setDiscounts(data);
        } else {
          console.error("Error: Received data is not an array", data);
          setDiscounts([]);
          setApiError("فرمت داده دریافتی نامعتبر است");
        }
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || response.statusText;
        setApiError(`خطا در دریافت تخفیف‌ها: ${errorMessage}`);
        console.error(`Error fetching discounts: ${errorMessage}`);
        setDiscounts([]);
      }
    } catch (err) {
      console.error("Server connection error:", err);
      setApiError("خطا در اتصال به سرور");
      setDiscounts([]);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const validateDiscount = (discount: any) => {
    if (!discount.title || !discount.code || !discount.description || discount.percentage <= 0) {
      toast.error("لطفاً تمام فیلدهای ضروری را پر کنید");
      return false;
    }

    if (discount.percentage > 100) {
      toast.error("درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد");
      return false;
    }

    const fromDate = new Date(discount.valid_from);
    const toDate = new Date(discount.valid_to);
    
    if (fromDate >= toDate) {
      toast.error("تاریخ پایان باید بعد از تاریخ شروع باشد");
      return false;
    }

    return true;
  };

  const handleAddDiscount = async () => {
    if (!validateDiscount(newDiscount)) return;

    setLoading(true);
    try {
      let currentToken = token;
      if (!currentToken) {
        currentToken = await refreshAccessToken();
      }

      if (!currentToken) {
        toast.error("لطفاً مجدداً وارد شوید");
        return;
      }

      const response = await fetch("http://localhost:8000/api/discount/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(newDiscount),
      });

      if (response.ok) {
        const discount: Discount = await response.json();
        setDiscounts([...discounts, discount]);
        setNewDiscount({ 
          title: "", 
          code: "", 
          description: "", 
          percentage: 1, 
          is_active: true, 
          for_first_purchase: false,
          is_single_use: true,
          min_order_amount: 0,
          valid_from: new Date().toISOString(),
          valid_to: addDays(new Date(), 7).toISOString(),
        });
        toast.success("تخفیف با موفقیت اضافه شد");
        fetchDiscounts();
      } else {
        const error = await response.json();
        const errorMessage = error.detail || Object.values(error).join(", ") || "خطای نامشخص";
        toast.error(`افزودن تخفیف ناموفق: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error adding discount:", error);
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    setLoading(true);
    try {
      let currentToken = token;
      if (!currentToken) {
        currentToken = await refreshAccessToken();
      }

      if (!currentToken) {
        toast.error("لطفاً مجدداً وارد شوید");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/discount/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.ok) {
        setDiscounts(discounts.filter((p) => p.id !== id));
        setShowDeleteModal(false);
        toast.success("تخفیف با موفقیت حذف شد");
      } else {
        const error = await response.json();
        const errorMessage = error.detail || "خطای نامشخص";
        toast.error(`حذف تخفیف ناموفق: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error deleting discount:", error);
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDiscount = (id: number) => {
    const discount = discounts.find((p) => p.id === id);
    if (discount) {
      setNewDiscount({
        title: discount.title,
        code: discount.code,
        description: discount.description,
        percentage: discount.percentage,
        is_active: discount.is_active,
        for_first_purchase: discount.for_first_purchase,
        is_single_use: discount.is_single_use,
        min_order_amount: discount.min_order_amount,
        valid_from: discount.valid_from,
        valid_to: discount.valid_to
      });
      setEditDiscountId(id);
      handleScrollToTop();
    }
  };

  const handleSaveEdit = async () => {
    if (!editDiscountId) return;
    if (!validateDiscount(newDiscount)) return;

    setLoading(true);
    try {
      let currentToken = token;
      if (!currentToken) {
        currentToken = await refreshAccessToken();
      }

      if (!currentToken) {
        toast.error("لطفاً مجدداً وارد شوید");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/discount/${editDiscountId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(newDiscount),
      });

      if (response.ok) {
        const updated: Discount = await response.json();
        setDiscounts(discounts.map(p => p.id === editDiscountId ? updated : p));
        setEditDiscountId(null);
        setNewDiscount({ 
          title: "", 
          code: "", 
          description: "", 
          percentage: 1, 
          is_active: true, 
          for_first_purchase: false,
          is_single_use: true,
          min_order_amount: 0,
          valid_from: new Date().toISOString(),
          valid_to: addDays(new Date(), 7).toISOString(),
        });
        toast.success("تخفیف با موفقیت ویرایش شد");
      } else {
        const error = await response.json();
        const errorMessage = error.detail || Object.values(error).join(", ") || "خطای نامشخص";
        toast.error(`ویرایش تخفیف ناموفق: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error updating discount:", error);
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditDiscountId(null);
    setNewDiscount({ 
      title: "", 
      code: "", 
      description: "", 
      percentage: 1, 
      is_active: true, 
      for_first_purchase: false,
      is_single_use: true,
      min_order_amount: 0,
      valid_from: new Date().toISOString(),
      valid_to: addDays(new Date(), 7).toISOString(),
    });
  };

  const filteredDiscounts = discounts.filter(discount =>
    discount.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discount.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (discount.seller_name && discount.seller_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (discount.shop_name && discount.shop_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const Loader = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const CustomDateInput = React.forwardRef(({ value, onClick, onChange }: any, ref: any) => (
    <div className="relative">
      <input
        type="text"
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all cursor-pointer"
        onClick={onClick}
        value={value}
        onChange={onChange}
        ref={ref}
        readOnly
      />
      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  ));

  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] min-h-screen p-4 md:p-8" style={{ direction: 'rtl' }}>
      <button 
        onClick={handleScrollToTop}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white p-3 rounded-full shadow-lg z-10 hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <FiArrowUp size={20} />
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center" ref={topRef}>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-3 relative inline-block">
            <FiGift className="inline ml-2 text-[#3b82f6]" />
            مدیریت تخفیف‌ها
          </h1>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            مدیریت و سازماندهی تخفیف‌های فروشگاه شما با امکانات پیشرفته
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] p-4 text-white">
            <h2 className="text-xl font-semibold flex items-center">
              {editDiscountId ? (
                <>
                  <FiEdit2 className="ml-2" />
                  ویرایش تخفیف
                </>
              ) : (
                <>
                  <FiPlus className="ml-2" />
                  افزودن تخفیف جدید
                </>
              )}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-[#334155] font-medium">
                  عنوان تخفیف <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="مثال: تخفیف تابستان"
                    value={newDiscount.title}
                    onChange={(e) => setNewDiscount({ ...newDiscount, title: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    required
                  />
                  {newDiscount.title && (
                    <FiCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-[#334155] font-medium">
                  کد تخفیف <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="مثال: SUMMER"
                    value={newDiscount.code}
                    onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    required
                  />
                  {newDiscount.code && (
                    <FiCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-[#334155] font-medium">وضعیت تخفیف</label>
                <div className="relative">
                  <select
                    value={newDiscount.is_active ? "true" : "false"}
                    onChange={(e) => setNewDiscount({ ...newDiscount, is_active: e.target.value === "true" })}
                    className="w-full p-3.5 border bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all appearance-none"
                  >
                    <option value="true">فعال</option>
                    <option value="false">غیر فعال</option>
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[#334155] font-medium">اولین تخفیف</label>
                <div className="relative">
                  <select
                    value={newDiscount.for_first_purchase ? "true" : "false"}
                    onChange={(e) => setNewDiscount({ ...newDiscount, for_first_purchase: e.target.value === "true" })}
                    className="w-full p-3.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all appearance-none"
                  >
                    <option value="false">غیر فعال</option>
                    <option value="true">فعال</option>
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[#334155] font-medium">
                  درصد تخفیف <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="50%"
                    value={newDiscount.percentage}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(100, +e.target.value));
                      setNewDiscount({ ...newDiscount, percentage: value });
                    }}
                    className="w-full p-3 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    required
                  />
                  <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[#334155] font-medium">
                  حداقل مبلغ سفارش
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="100000"
                    value={newDiscount.min_order_amount}
                    onChange={(e) => setNewDiscount({ ...newDiscount, min_order_amount: +e.target.value })}
                    className="w-full p-3 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                  />
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[#334155] font-medium">
                  تاریخ شروع اعتبار <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={new Date(newDiscount.valid_from)}
                  onChange={(date: Date) => setNewDiscount({ ...newDiscount, valid_from: date.toISOString() })}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy/MM/dd - HH:mm"
                  locale="fa"
                  calendarClassName="font-sans"
                  customInput={<CustomDateInput />}
                  className="w-full"
                  wrapperClassName="w-full"
                  timeCaption="زمان"
                  popperPlacement="bottom-end"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#334155] font-medium">
                  تاریخ پایان اعتبار <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={new Date(newDiscount.valid_to)}
                  onChange={(date: Date) => setNewDiscount({ ...newDiscount, valid_to: date.toISOString() })}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy/MM/dd - HH:mm"
                  locale="fa"
                  calendarClassName="font-sans"
                  customInput={<CustomDateInput />}
                  className="w-full"
                  wrapperClassName="w-full"
                  timeCaption="زمان"
                  minDate={new Date(newDiscount.valid_from)}
                  popperPlacement="bottom-end"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-[#334155] font-medium">
                  توضیحات تخفیف <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="توضیحات کامل درباره تخفیف..."
                  value={newDiscount.description}
                  onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all h-24"
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <button
                onClick={editDiscountId ? handleSaveEdit : handleAddDiscount}
                disabled={!newDiscount.title || !newDiscount.code || !newDiscount.description || newDiscount.percentage <= 0}
                className={`px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg flex-1 md:flex-none flex items-center justify-center ${
                    editDiscountId 
                        ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857]"
                        : "bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white hover:from-[#2563eb] hover:to-[#1e40af]"
                } ${
                    (!newDiscount.title || !newDiscount.code || !newDiscount.description || newDiscount.percentage <= 0) 
                        ? "opacity-50 cursor-not-allowed" 
                        : ""
                }`}
              >
                {loading ? (
                  "در حال پردازش..."
                ) : editDiscountId ? (
                  <>
                    <FiEdit2 className="ml-2" />
                    ذخیره تغییرات
                  </>
                ) : (
                  <>
                    <FiPlus className="ml-2" />
                    افزودن تخفیف
                  </>
                )}
              </button>
              
              {editDiscountId && (
                <button
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 hover:shadow-lg hover:bg-gray-300 flex-1 md:flex-none flex items-center justify-center"
                >
                  <FiX className="ml-2" />
                  انصراف از ویرایش
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#1e293b] mb-4 flex items-center">
            <FiSearch className="ml-2 text-[#3b82f6]" />
            جستجوی تخفیف‌ها
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="جستجوی تخفیف‌ها بر اساس عنوان، کد، فروشنده یا توضیحات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] p-4 text-white">
            <h2 className="text-xl font-semibold flex items-center">
              <FiGift className="ml-2" />
              لیست تخفیف‌ها
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium mr-3">
                {filteredDiscounts.length} تخفیف
              </span>
            </h2>
          </div>
          
          <div className="p-6">
            {apiError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="mr-3">
                    <p className="text-sm text-red-700">{apiError}</p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <Loader />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عنوان تخفیف</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد تخفیف</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">درصد</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اولین خرید</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حداقل سفارش</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اعتبار</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDiscounts.map((discount) => (
                      <tr key={discount.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{discount.title}</div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">{discount.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {discount.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiPercent className="ml-1" />
                            {discount.percentage}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {discount.is_valid ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              فعال
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              غیرفعال
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {discount.for_first_purchase ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              بله
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              خیر
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            {discount.min_order_amount.toLocaleString('fa-IR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiClock className="ml-1" />
                            {discount.remaining_time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleEditDiscount(discount.id)}
                              className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded-full hover:bg-blue-50"
                              title="ویرایش"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            
                            <button
                              onClick={() => {
                                setShowDeleteModal(true);
                                setDiscountToDelete(discount.id);
                              }}
                              className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-full hover:bg-red-50"
                              title="حذف"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredDiscounts.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FiSearch size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">تخفیفی یافت نشد</h3>
                    <p className="text-gray-500 mt-1">
                      {searchQuery ? "هیچ تخفیفی با معیارهای جستجوی شما مطابقت ندارد" : "هنوز هیچ تخفیفی ثبت نشده است"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md">
            <div className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <FiTrash2 className="ml-2" />
                حذف تخفیف
              </h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">آیا مطمئن هستید که می‌خواهید این تخفیف را حذف کنید؟ این عمل برگشت‌پذیر نیست.</p>
              
              <div className="flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  انصراف
                </button>
                <button
                  onClick={() => {
                    if (discountToDelete) {
                      handleDeleteDiscount(discountToDelete);
                    }
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? "در حال حذف..." : "حذف تخفیف"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagement;