import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  FiSearch, 
  FiCalendar, 
  FiTag, 
  FiArrowLeft, 
  FiArrowRight,
  FiBookOpen,
  FiShoppingBag,
  FiShield,
  FiTrendingUp,
  FiUser,
  FiAward,
  FiMail
} from "react-icons/fi";

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: string;
  readTime: string;
  icon: React.ReactNode;
  bgColor: string;
}

const postsData: BlogPost[] = [
  {
    id: 1,
    title: "معرفی پروژه گروشا و اهداف آن",
    summary: "در این مقاله با اهداف و ویژگی‌های پروژه گروشا آشنا می‌شوید و دلیل انتخاب این نام را خواهید فهمید.",
    date: "۱۴۰۲/۰۱/۱۵",
    category: "معرفی",
    readTime: "۵ دقیقه",
    icon: <FiAward className="text-2xl" />,
    bgColor: "bg-[#FFEEB2]"
  },
  {
    id: 2,
    title: "چگونه بهترین محصولات را انتخاب کنیم؟",
    summary: "راهنمایی برای انتخاب محصولات با کیفیت در فروشگاه‌های آنلاین و نکات مهم قبل از خرید.",
    date: "۱۴۰۲/۰۲/۱۰",
    category: "راهنما",
    readTime: "۸ دقیقه",
    icon: <FiBookOpen className="text-2xl" />,
    bgColor: "bg-[#C2E0FF]"
  },
  {
    id: 3,
    title: "نکات مهم در فروش آنلاین برای فروشندگان",
    summary: "اگر فروشنده هستید این مقاله را از دست ندهید. نکاتی کلیدی برای موفقیت در فروشگاه اینترنتی.",
    date: "۱۴۰۲/۰۳/۰۵",
    category: "فروشندگان",
    readTime: "۱۲ دقیقه",
    icon: <FiShoppingBag className="text-2xl" />,
    bgColor: "bg-[#FFD6C2]"
  },
  {
    id: 4,
    title: "راهکارهای افزایش امنیت در خرید اینترنتی",
    summary: "چگونه خرید امنی داشته باشیم و از کلاهبرداری‌های اینترنتی در امان بمانیم؟",
    date: "۱۴۰۲/۰۴/۲۰",
    category: "امنیت",
    readTime: "۶ دقیقه",
    icon: <FiShield className="text-2xl" />,
    bgColor: "bg-[#D4EDDA]"
  },
  {
    id: 5,
    title: "تحلیل بازار فروش آنلاین در سال ۱۴۰۲",
    summary: "بررسی روندهای جدید در بازار تجارت الکترونیک و پیش‌بینی آینده فروش آنلاین.",
    date: "۱۴۰۲/۰۵/۱۲",
    category: "تحلیل",
    readTime: "۱۰ دقیقه",
    icon: <FiTrendingUp className="text-2xl" />,
    bgColor: "bg-[#E2D4F0]"
  },
  {
    id: 6,
    title: "۱۰ ترفند برای جذب مشتری بیشتر",
    summary: "با این راهکارهای ساده اما موثر، مشتریان بیشتری جذب فروشگاه اینترنتی خود کنید.",
    date: "۱۴۰۲/۰۶/۰۸",
    category: "بازاریابی",
    readTime: "۷ دقیقه",
    icon: <FiUser className="text-2xl" />,
    bgColor: "bg-[#FFC2D4]"
  }
];

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("همه");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 4;

  const categories = useMemo(() => {
    const cats = postsData.map((p) => p.category);
    return ["همه", ...Array.from(new Set(cats))];
  }, []);

  const filteredPosts = useMemo(() => {
    return postsData.filter((post) => {
      const matchesCategory = selectedCategory === "همه" || post.category === selectedCategory;
      const matchesSearch = post.title.includes(searchTerm) || post.summary.includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ direction: "rtl" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#00296B] mb-4">
            وبلاگ <span className="text-[#FDC500]">گروشا</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            جدیدترین مقالات و راهنمایی‌های تخصصی در زمینه خرید و فروش آنلاین
          </p>
        </div>

        <div className="mb-12 bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="جستجو در مقالات..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDC500] focus:border-[#FDC500] outline-none transition"
              />
            </div>
            <div className="w-full md:w-64">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDC500] focus:border-[#FDC500] outline-none transition bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "همه" ? "همه دسته‌بندی‌ها" : cat}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiTag className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <h3 className="text-2xl font-bold text-[#00296B] mb-4">مقاله‌ای یافت نشد</h3>
            <p className="text-gray-600 mb-6">ممکن است عبارت جستجو یا فیلتر انتخابی شما با هیچ مقاله‌ای مطابقت نداشته باشد.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("همه");
              }}
              className="bg-[#FDC500] hover:bg-[#ffd524] text-[#00296B] font-bold py-2 px-6 rounded-lg transition duration-300"
            >
              نمایش همه مقالات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentPosts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className={`${post.bgColor} h-40 flex items-center justify-center`}>
                  <div className="bg-white p-4 rounded-full shadow-lg">
                    {post.icon}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <FiCalendar className="ml-1" />
                    <span className="ml-2">{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime} مطالعه</span>
                  </div>
                  <Link to={`/blog/${post.id}`} className="block no-underline group flex-1">
                    <h2 className="text-xl font-bold text-[#00296B] mb-3 group-hover:text-[#00509D] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.summary}</p>
                  </Link>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="bg-[#FDC500]/20 text-[#00296B] px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <Link 
                      to={`/blog/${post.id}`} 
                      className="text-[#00509D] hover:text-[#00296B] font-medium flex items-center transition-colors"
                    >
                      مطالعه بیشتر
                      <FiArrowLeft className="mr-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPosts.length > postsPerPage && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-r-md border border-gray-300 ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <FiArrowRight />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 border-t border-b border-gray-300 ${currentPage === number ? 'bg-[#00509D] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-l-md border border-gray-300 ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <FiArrowLeft />
              </button>
            </nav>
          </div>
        )}

        <div className="mt-20 bg-gradient-to-r from-[#00296B] to-[#00509D] rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-2">عضویت در خبرنامه</h3>
                <p className="text-gray-200">با عضویت در خبرنامه از جدیدترین مقالات و پیشنهادات ویژه ما با خبر شوید.</p>
              </div>
              <div className="md:w-1/2">
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="آدرس ایمیل شما"
                    className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDC500]"
                  />
                  <button
                    type="submit"
                    className="bg-[#FDC500] hover:bg-[#ffd524] text-[#00296B] font-bold py-3 px-6 rounded-lg transition duration-300 whitespace-nowrap flex items-center justify-center"
                  >
                    <FiMail className="ml-1" />
                    عضویت در خبرنامه
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;