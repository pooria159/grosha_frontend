import React, { useState } from "react";
import { FiBell, FiMail, FiPhone, FiSettings, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

const NotificationsPage: React.FC = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [activeTab, setActiveTab] = useState("all");

  const notifications = [
    {
      id: 1,
      type: "shipping",
      title: "سفارش #۱۲۳۴ ارسال شد",
      message: "سفارش شما با موفقیت ارسال شده و در حال انتقال به آدرس شما می‌باشد.",
      time: "۲ ساعت پیش",
      read: false,
    },
    {
      id: 2,
      type: "promotion",
      title: "تخفیف ویژه ۲۰٪",
      message: "کد تخفیف: SPRING20 برای خرید بعدی شما فعال شد.",
      time: "۱ روز پیش",
      read: true,
    },
    {
      id: 3,
      type: "system",
      title: "به‌روزرسانی سیستم",
      message: "سیستم ما به‌روزرسانی شد. لطفاً در صورت مشاهده هرگونه مشکل به ما اطلاع دهید.",
      time: "۳ روز پیش",
      read: true,
    },
  ];

  const handleSettingChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };


  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(notif => 
        activeTab === "unread" ? !notif.read : 
        activeTab === "promotions" ? notif.type === "promotion" : 
        notif.type === activeTab
      );

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] p-4 md:p-8 min-h-screen" style={{ direction: 'rtl' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-[#1e293b] flex items-center">
              <FiBell className="ml-2 text-[#3b82f6]" size={28} />
              اعلان‌ها
            </h1>
            <p className="text-[#64748b] mt-2">مدیریت اطلاع‌رسانی‌ها و پیام‌های سیستم</p>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="relative">
              <FiBell className="text-[#3b82f6]" size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </span>
            <span className="text-sm text-[#64748b]">اعلان‌های خوانده نشده</span>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {["all", "unread", "promotions", "shipping", "system"].map((tab) => (
            <button
              key={tab}
              className={`whitespace-nowrap px-4 py-2 rounded-full mr-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#3b82f6] text-white"
                  : "bg-white text-[#64748b] hover:bg-[#f1f5f9]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all" && "همه"}
              {tab === "unread" && "خوانده نشده"}
              {tab === "promotions" && "تخفیف‌ها"}
              {tab === "shipping" && "ارسال سفارش"}
              {tab === "system" && "سیستم"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${
                    notification.read
                      ? "border-transparent opacity-80"
                      : notification.type === "shipping"
                      ? "border-[#10b981]"
                      : notification.type === "promotion"
                      ? "border-[#f59e0b]"
                      : "border-[#3b82f6]"
                  } transition-all hover:shadow-md`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-lg mr-3 ${
                          notification.type === "shipping"
                            ? "bg-[#10b981]/10 text-[#10b981]"
                            : notification.type === "promotion"
                            ? "bg-[#f59e0b]/10 text-[#f59e0b]"
                            : "bg-[#3b82f6]/10 text-[#3b82f6]"
                        }`}
                      >
                        {notification.type === "shipping" && <FiCheck size={18} />}
                        {notification.type === "promotion" && <FiAlertCircle size={18} />}
                        {notification.type === "system" && <FiSettings size={18} />}
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1e293b]">{notification.title}</h3>
                        <p className="text-sm text-[#64748b] mt-1">{notification.message}</p>
                        <span className="text-xs text-[#94a3b8] mt-2 block">{notification.time}</span>
                      </div>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-[#64748b] hover:text-[#3b82f6] p-1"
                        aria-label="علامت‌گذاری به عنوان خوانده شده"
                      >
                        <FiX size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <FiBell className="mx-auto text-[#94a3b8]" size={48} />
                <h3 className="text-lg font-medium text-[#64748b] mt-4">اعلانی یافت نشد</h3>
                <p className="text-[#94a3b8] mt-1">هیچ اعلانی مطابق با فیلترهای شما وجود ندارد.</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-6">
            <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-4">
              <FiSettings className="ml-2 text-[#3b82f6]" size={20} />
              تنظیمات اعلان‌ها
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-[#334155] mb-3">روش‌های دریافت اعلان</h3>
                <div className="space-y-3">
                  {[
                    { id: "email", label: "ایمیل", icon: <FiMail size={16} /> },
                    { id: "sms", label: "پیامک", icon: <FiPhone size={16} /> },
                    { id: "push", label: "نوتیفیکیشن", icon: <FiBell size={16} /> },
                  ].map((method) => (
                    <div key={method.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-[#64748b] ml-2">{method.icon}</span>
                        <span className="text-[#475569]">{method.label}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[method.id]}
                          onChange={() => handleSettingChange(method.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-[#334155] mb-3">انواع اعلان‌ها</h3>
                <div className="space-y-3">
                  {[
                    { id: "promo", label: "تخفیف‌ها و پیشنهادات ویژه" },
                    { id: "order", label: "وضعیت سفارش‌ها" },
                    { id: "account", label: "تغییرات حساب کاربری" },
                    { id: "news", label: "اخبار و به‌روزرسانی‌ها" },
                  ].map((type) => (
                    <div key={type.id} className="flex items-center">
                      <input
                        id={type.id}
                        type="checkbox"
                        className="w-4 h-4 text-[#3b82f6] bg-gray-100 border-gray-300 rounded focus:ring-[#3b82f6]"
                      />
                      <label htmlFor={type.id} className="mr-2 text-sm text-[#475569]">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                type="button"
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;