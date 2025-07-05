import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiTag, FiShare2, FiBookmark, FiHeart } from "react-icons/fi";

interface BlogPost {
  id: number;
  title: string;
  body: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  likes: number;
  tags: string[];
}

const initialPostsData: BlogPost[] = [
  {
    id: 1,
    title: "معرفی پروژه گروشا و اهداف آن",
    body: `
      <p class="mb-4">در این مقاله با اهداف و ویژگی‌های پروژه گروشا آشنا می‌شوید و دلیل انتخاب این نام را خواهید فهمید.</p>
      <p class="mb-4">پروژه گروشا با هدف ایجاد بستری امن و آسان برای خرید و فروش آنلاین راه‌اندازی شده است. ما اعتقاد داریم که تجربه خرید آنلاین می‌تواند ساده‌تر و لذت‌بخش‌تر باشد.</p>
      <p class="mb-4">ما در گروشا به دنبال ایجاد تجربه‌ای متفاوت از خرید آنلاین هستیم که در آن کاربران احساس راحتی و امنیت داشته باشند.</p>
    `,
    date: "۱۴۰۲/۰۱/۱۵",
    category: "معرفی",
    author: "تیم گروشا",
    readTime: "۵ دقیقه",
    likes: 124,
    tags: ["معرفی", "اهداف", "تیم"]
  },
  {
    id: 2,
    title: "چگونه بهترین محصولات را انتخاب کنیم؟",
    body: `
      <p class="mb-4">راهنمایی برای انتخاب محصولات با کیفیت در فروشگاه‌های آنلاین و نکات مهم قبل از خرید.</p>
      <h3 class="text-xl font-bold my-4 text-[#1e40af]">نکات کلیدی برای انتخاب محصول</h3>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>بررسی نظرات کاربران و امتیازات محصول</li>
        <li>مقایسه قیمت‌ها در فروشگاه‌های مختلف</li>
        <li>توجه به گارانتی و خدمات پس از فروش</li>
        <li>بررسی مشخصات فنی و ویژگی‌های محصول</li>
      </ul>
      <p class="mb-4">همیشه به یاد داشته باشید که ارزان‌ترین گزینه لزوماً بهترین انتخاب نیست. کیفیت و خدمات پس از فروش می‌توانند در بلندمدت بسیار مهم‌تر باشند.</p>
    `,
    date: "۱۴۰۲/۰۲/۱۰",
    category: "راهنما",
    author: "کارشناس خرید",
    readTime: "۷ دقیقه",
    likes: 89,
    tags: ["خرید", "راهنما", "محصولات"]
  },
  {
    id: 3,
    title: "نکات مهم در فروش آنلاین برای فروشندگان",
    body: `
      <p class="mb-4">اگر فروشنده هستید این مقاله را از دست ندهید. نکاتی کلیدی برای موفقیت در فروشگاه اینترنتی.</p>
      <h3 class="text-xl font-bold my-4 text-[#1e40af]">استراتژی‌های فروش موفق</h3>
      <p class="mb-4">از جمله نکات مهم می‌توان به بازاریابی دیجیتال، مدیریت موجودی و پاسخگویی سریع اشاره کرد. در ادامه به بررسی هر یک می‌پردازیم:</p>
      <div class="bg-[#f0f9ff] p-4 rounded-lg border border-[#bae6fd] mb-4">
        <h4 class="font-bold text-[#0369a1] mb-2">بازاریابی دیجیتال</h4>
        <p>استفاده از شبکه‌های اجتماعی، تبلیغات هدفمند و سئو می‌تواند به دیده شدن محصولات شما کمک کند.</p>
      </div>
      <div class="bg-[#f0fdf4] p-4 rounded-lg border border-[#bbf7d0] mb-4">
        <h4 class="font-bold text-[#166534] mb-2">مدیریت موجودی</h4>
        <p>همیشه موجودی کالاهای خود را به روز نگه دارید تا از نارضایتی مشتریان جلوگیری کنید.</p>
      </div>
      <div class="bg-[#fef2f2] p-4 rounded-lg border border-[#fecaca] mb-4">
        <h4 class="font-bold text-[#991b1b] mb-2">پاسخگویی سریع</h4>
        <p>پاسخگویی به سوالات مشتریان در کمترین زمان ممکن می‌تواند به افزایش اعتماد و فروش کمک کند.</p>
      </div>
    `,
    date: "۱۴۰۲/۰۳/۰۵",
    category: "فروشندگان",
    author: "مشاور فروش",
    readTime: "۱۰ دقیقه",
    likes: 156,
    tags: ["فروش", "بازاریابی", "مدیریت"]
  }
];

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [postsData, setPostsData] = useState<BlogPost[]>(() => {
    const savedData = localStorage.getItem('blogPosts');
    return savedData ? JSON.parse(savedData) : initialPostsData;
  });

  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(postsData));
  }, [postsData]);

  const post = postsData.find((p) => p.id === Number(id));

  const handleLike = () => {
    setPostsData(prevPosts => 
      prevPosts.map(p => 
        p.id === Number(id) ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.body.substring(0, 100) + "...",
        url: window.location.href,
      }).catch(() => {
        alert("اشتراک‌گذاری لغو شد");
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("لینک مقاله در کلیپ‌بورد کپی شد!");
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9]" style={{ direction: "rtl" }}>
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl text-center border-t-8 border-[#FDC500]">
          <h2 className="text-2xl font-bold text-[#00296B] mb-4">مقاله یافت نشد</h2>
          <button
            onClick={() => navigate("/blog")}
            className="bg-gradient-to-r from-[#00509D] to-[#00296B] hover:from-[#003f7a] hover:to-[#001a3d] text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center mx-auto"
          >
            <FiArrowLeft className="ml-2" />
            بازگشت به وبلاگ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen pb-16" style={{ direction: "rtl" }}>
      <div className="bg-gradient-to-r from-[#00509D] to-[#00296B] py-16 px-6 md:px-12 text-white">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center text-white/90 hover:text-white transition-colors mb-6"
          >
            <FiArrowLeft className="ml-2" />
            بازگشت به وبلاگ
          </button>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center">
              <FiTag className="ml-1" size={14} />
              {post.category}
            </span>
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-white/10 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
            <div className="flex items-center">
              <FiCalendar className="ml-2" />
              {post.date}
            </div>
            <div className="flex items-center">
              <FiBookmark className="ml-2" />
              زمان مطالعه: {post.readTime}
            </div>
            <div className="flex items-center">
              نویسنده: <span className="font-medium mr-1">{post.author}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 -mt-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <article 
            className="prose prose-rtl max-w-none p-6 md:p-10"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          <div className="border-t border-gray-200 p-6 flex flex-wrap justify-between items-center gap-4">
            <button 
              onClick={sharePost}
              className="flex items-center text-[#00509D] hover:text-[#00296B] transition-colors"
            >
              <FiShare2 className="ml-2" />
              اشتراک‌گذاری مقاله
            </button>
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-gray-600">{post.likes.toLocaleString()} پسندیدن</span>
              <button 
                onClick={handleLike}
                className="bg-[#00509D] hover:bg-[#00296B] text-white px-6 py-2 rounded-lg transition flex items-center"
              >
                <FiHeart className="ml-2" />
                پسندیدم
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center">
            <FiBookmark className="ml-2 text-[#00509D]" />
            مقالات مرتبط
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsData
              .filter(p => p.id !== post.id)
              .slice(0, 3)
              .map(relatedPost => (
                <div 
                  key={relatedPost.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/${relatedPost.id}`)}
                >
                  <div className="p-6">
                    <span className="inline-block bg-[#00509D]/10 text-[#00509D] px-3 py-1 rounded-full text-xs font-medium mb-3">
                      {relatedPost.category}
                    </span>
                    <h4 className="font-bold text-lg mb-2 line-clamp-2">{relatedPost.title}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="ml-2" size={14} />
                      {relatedPost.date}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;