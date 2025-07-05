import React from "react";
import { FiAward, FiUsers, FiPackage, FiShield, FiTruck, FiHeadphones, FiStar } from "react-icons/fi";

const About: React.FC = () => {
    const teamMembers = [
        { name: "سارا محمدی", role: "مدیرعامل", avatar: "/avatars/1.jpg" },
        { name: "علی رضایی", role: "مدیر فنی", avatar: "/avatars/2.jpg" },
        { name: "نازنین حسینی", role: "مدیر بازاریابی", avatar: "/avatars/3.jpg" },
        { name: "محمد کریمی", role: "پشتیبانی مشتریان", avatar: "/avatars/4.jpg" },
    ];

    const stats = [
        { value: "۱۰۰۰۰+", label: "مشتریان راضی", icon: <FiUsers className="text-2xl" /> },
        { value: "۵۰۰۰+", label: "محصولات متنوع", icon: <FiPackage className="text-2xl" /> },
        { value: "۹۸٪", label: "رضایت مشتریان", icon: <FiStar className="text-2xl" /> },
        { value: "۲۴/۷", label: "پشتیبانی", icon: <FiHeadphones className="text-2xl" /> },
    ];

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen" style={{ direction: "rtl" }}>
            <div className="relative bg-[#00296B] text-white py-20 px-6 md:px-12 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#FDC500] filter blur-3xl"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-[#00509D] filter blur-3xl"></div>
                </div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                                داستان ما، <span className="text-[#FDC500]">ارزش‌های ما</span>
                            </h1>
                            <p className="text-lg text-gray-300 mb-8">
                                پروژه <span className="font-bold text-white">گروشا</span> با هدف ایجاد بستری امن، سریع و آسان برای خرید و فروش آنلاین راه‌اندازی شده است. ما معتقدیم که خرید اینترنتی باید ساده، مطمئن و لذت‌بخش باشد.
                            </p>
                            <button className="bg-[#FDC500] hover:bg-[#ffd524] text-[#00296B] font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg">
                                تماس با ما
                            </button>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <div className="relative w-full max-w-md">
                                <div className="w-full h-80 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 shadow-xl flex items-center justify-center">
                                    <div className="text-center p-6">
                                        <FiAward className="mx-auto text-6xl text-[#FDC500] mb-4" />
                                        <h3 className="text-2xl font-bold mb-2">تضمین کیفیت</h3>
                                        <p className="text-gray-300">ما کیفیت را فدای هیچ چیزی نمی‌کنیم</p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#FDC500] rounded-2xl shadow-lg flex items-center justify-center">
                                    <FiTruck className="text-3xl text-[#00296B]" />
                                </div>
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#00509D] rounded-2xl shadow-lg flex items-center justify-center">
                                    <FiShield className="text-2xl text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
                            <div className="text-[#00509D] mb-3 flex justify-center">{stat.icon}</div>
                            <h3 className="text-3xl font-bold text-[#00296B] mb-2">{stat.value}</h3>
                            <p className="text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#00509D] text-white py-16 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">ارزش‌های اصلی ما</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-[#FDC500] transition">
                            <div className="w-12 h-12 bg-[#FDC500] rounded-lg flex items-center justify-center mb-4">
                                <FiHeadphones className="text-xl text-[#00296B]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">پشتیبانی ۲۴ ساعته</h3>
                            <p className="text-gray-300">تیم پشتیبانی ما همیشه آماده پاسخگویی به سوالات و حل مشکلات شماست.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-[#FDC500] transition">
                            <div className="w-12 h-12 bg-[#FDC500] rounded-lg flex items-center justify-center mb-4">
                                <FiShield className="text-xl text-[#00296B]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">ضمانت بازگشت وجه</h3>
                            <p className="text-gray-300">در صورت نارضایتی از محصول، بدون دردسر هزینه شما بازگردانده می‌شود.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-[#FDC500] transition">
                            <div className="w-12 h-12 bg-[#FDC500] rounded-lg flex items-center justify-center mb-4">
                                <FiTruck className="text-xl text-[#00296B]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">ارسال سریع و مطمئن</h3>
                            <p className="text-gray-300">ارسال به سراسر کشور با بهترین روش‌های حمل و نقل در کوتاه‌ترین زمان.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-[#FDC500] transition">
                            <div className="w-12 h-12 bg-[#FDC500] rounded-lg flex items-center justify-center mb-4">
                                <FiPackage className="text-xl text-[#00296B]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">تنوع محصولات</h3>
                            <p className="text-gray-300">گسترده‌ترین مجموعه محصولات با بروزرسانی مداوم.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-[#FDC500] transition">
                            <div className="w-12 h-12 bg-[#FDC500] rounded-lg flex items-center justify-center mb-4">
                                <FiUsers className="text-xl text-[#00296B]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">امنیت اطلاعات</h3>
                            <p className="text-gray-300">اطلاعات شما با پیشرفته‌ترین روش‌های رمزنگاری محافظت می‌شود.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-[#FDC500] transition">
                            <div className="w-12 h-12 bg-[#FDC500] rounded-lg flex items-center justify-center mb-4">
                                <FiStar className="text-xl text-[#00296B]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">رضایت مشتری</h3>
                            <p className="text-gray-300">رضایت شما اولویت اول ماست و برای آن هر کاری می‌کنیم.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
                <div className="bg-gradient-to-r from-[#00296B] to-[#00509D] rounded-2xl p-8 md:p-12 text-white shadow-xl">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-2/3 mb-8 md:mb-0">
                            <h2 className="text-3xl font-bold mb-4">ماموریت ما</h2>
                            <p className="text-lg leading-relaxed">
                                فراهم کردن تجربه‌ای بی‌نظیر در خرید آنلاین با ارائه بهترین خدمات، قیمت‌های رقابتی و پشتیبانی حرفه‌ای تا رضایت کامل مشتریان را به دست آوریم. ما هر روز برای بهبود خدمات خود تلاش می‌کنیم و به تعهدات خود به مشتریان پایبند هستیم.
                            </p>
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            <div className="w-40 h-40 bg-[#FDC500] rounded-full flex items-center justify-center shadow-lg">
                                <FiAward className="text-5xl text-[#00296B]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
                <h2 className="text-3xl font-bold text-center mb-4 text-[#00296B]">تیم ما</h2>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                    با تیم متخصص و پرانرژی ما آشنا شوید که هر روز برای ارائه بهترین خدمات به شما تلاش می‌کنند.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gradient-to-r from-[#00509D] to-[#00296B] flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-[#00296B]">
                                    {member.name.charAt(0)}
                                </div>
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold text-[#00296B] mb-1">{member.name}</h3>
                                <p className="text-[#FDC500] font-medium">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white py-16 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h2 className="text-3xl font-bold text-[#00296B] mb-6">با ما در تماس باشید</h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-[#FDC500] p-2 rounded-lg mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00296B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#00509D]">ایمیل</h4>
                                        <a href="mailto:info@example.com" className="text-gray-600 hover:text-[#FDC500] transition">info@example.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-[#FDC500] p-2 rounded-lg mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00296B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#00509D]">تلفن</h4>
                                        <a href="tel:+982112345678" className="text-gray-600 hover:text-[#FDC500] transition">۰۲۱-۱۲۳۴۵۶۷۸</a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-[#FDC500] p-2 rounded-lg mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00296B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#00509D]">آدرس</h4>
                                        <p className="text-gray-600">تهران، خیابان مثال، پلاک ۱۲۳</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;