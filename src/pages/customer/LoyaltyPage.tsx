import React from "react";
import { FiAward, FiGift, FiUsers, FiStar, FiShare2, FiCopy } from "react-icons/fi";

const LoyaltyPage: React.FC = () => {
  const userLevel = {
    name: "طلایی",
    progress: 65,
    nextLevel: "پلاتینیوم",
    benefits: [
      "۱۵٪ تخفیف روی تمام خریدها",
      "ارسال رایگان برای سفارش‌های بالای ۲۰۰ هزار تومان",
      "دسترسی زودهنگام به محصولات جدید",
      "پشتیبانی ویژه"
    ],
    points: 1250,
    pointsToNextLevel: 350
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText("INVITE123");
    alert("کد دعوت با موفقیت کپی شد!");
  };

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen p-4 md:p-8" style={{ direction: 'rtl' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] flex items-center justify-center">
            <FiAward className="ml-2 text-[#f59e0b]" size={32} />
            برنامه وفاداری
          </h1>
          <p className="text-[#64748b] mt-3 max-w-2xl mx-auto">
            از مزایای عضویت در برنامه وفاداری ما لذت ببرید و با هر خرید به سطح بالاتری دست پیدا کنید
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-[#f59e0b]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1e293b] flex items-center">
                  <FiStar className="ml-2 text-[#f59e0b]" size={20} />
                  سطح کاربری شما
                </h2>
                <span className="bg-[#f59e0b]/10 text-[#b45309] px-3 py-1 rounded-full text-sm font-medium">
                  {userLevel.name}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-[#64748b] mb-2">
                  <span>امتیاز شما: {userLevel.points}</span>
                  <span>{userLevel.pointsToNextLevel} امتیاز تا سطح {userLevel.nextLevel}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] h-3 rounded-full" 
                    style={{ width: `${userLevel.progress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-[#334155] mb-3 flex items-center">
                  <FiGift className="ml-2 text-[#f59e0b]" size={18} />
                  مزایای سطح {userLevel.name}
                </h3>
                <ul className="space-y-2">
                  {userLevel.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#f59e0b] mr-2">•</span>
                      <span className="text-[#475569]">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-4">سطوح برنامه وفاداری</h2>
              <div className="space-y-4">
                {[
                  { name: "نقره‌ای", minPoints: 0, discount: "۵٪", color: "gray" },
                  { name: "طلایی", minPoints: 1000, discount: "۱۵٪", color: "yellow" },
                  { name: "پلاتینیوم", minPoints: 2000, discount: "۲۵٪", color: "blue" },
                  { name: "الماس", minPoints: 5000, discount: "۴۰٪", color: "purple" }
                ].map((level, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${level.color}-100 text-${level.color}-600 mr-3`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#1e293b]">{level.name}</h4>
                      <p className="text-sm text-[#64748b]">حداقل امتیاز: {level.minPoints}</p>
                    </div>
                    <span className={`bg-${level.color}-100 text-${level.color}-600 px-3 py-1 rounded-full text-sm font-medium`}>
                      {level.discount} تخفیف
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-6">
            <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-4">
              <FiUsers className="ml-2 text-[#3b82f6]" size={20} />
              دعوت دوستان
            </h2>

            <div className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-xl p-4 text-white mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">کد دعوت شما</span>
                <button 
                  onClick={copyInviteCode}
                  className="text-white/80 hover:text-white transition-colors"
                  title="کپی کردن"
                >
                  <FiCopy size={16} />
                </button>
              </div>
              <div className="font-mono text-xl font-bold tracking-wider text-center py-2 bg-white/20 rounded">
                INVITE123
              </div>
              <p className="text-xs text-white/80 mt-2 text-center">
                برای هر دعوت موفق ۱۰۰ امتیاز دریافت کنید
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#f0fdf4] p-3 rounded-lg border border-[#bbf7d0]">
                <div className="flex items-center">
                  <FiUsers className="text-[#16a34a] ml-2" />
                  <span className="text-[#166534]">دوستان دعوت شده</span>
                </div>
                <span className="font-bold text-[#166534]">۳ نفر</span>
              </div>

              <div className="flex items-center justify-between bg-[#eff6ff] p-3 rounded-lg border border-[#bfdbfe]">
                <div className="flex items-center">
                  <FiAward className="text-[#1d4ed8] ml-2" />
                  <span className="text-[#1e3a8a]">امتیاز کسب شده</span>
                </div>
                <span className="font-bold text-[#1e3a8a]">۳۰۰ امتیاز</span>
              </div>

              <button className="w-full flex items-center justify-center bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">
                <FiShare2 className="ml-2" />
                اشتراک‌گذاری کد دعوت
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-[#334155] mb-3">نحوه کسب امتیاز</h3>
              <ul className="space-y-2 text-sm text-[#475569]">
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2">•</span>
                  <span>هر ۱۰۰۰ تومان خرید = ۱ امتیاز</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2">•</span>
                  <span>دعوت دوستان = ۱۰۰ امتیاز به ازای هر نفر</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2">•</span>
                  <span>نقد و بررسی محصولات = ۵۰ امتیاز</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2">•</span>
                  <span>تکمیل پروفایل = ۱۰۰ امتیاز</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;