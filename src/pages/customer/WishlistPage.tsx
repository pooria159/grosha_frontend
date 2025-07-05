import React from "react";
import { useWishlist } from "../../contexts/WishlistContext";
import { useNavigate } from "react-router-dom";
import { FiEye, FiHeart, FiX, FiShoppingBag, FiArrowLeft, FiStar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleViewDetails = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen p-4 md:p-8" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] flex items-center justify-center">
            <FiHeart className="ml-2 text-[#e11d48]" size={32} />
            لیست علاقه‌مندی‌ها
          </h1>
          <p className="text-[#64748b] mt-3 max-w-2xl mx-auto">
            تمام محصولاتی که به لیست علاقه‌مندی‌های خود اضافه کرده‌اید در اینجا نمایش داده می‌شوند
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <AnimatePresence>
              {wishlist.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl shadow-sm p-8 text-center border-l-4 border-[#3b82f6]"
                >
                  <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-pink-50 mb-6">
                    <FiHeart className="h-12 w-12 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">لیست علاقه‌مندی‌های شما خالی است</h3>
                  <p className="text-gray-500 mb-6">
                    محصولات مورد علاقه خود را ذخیره کنید تا بعداً به راحتی به آنها دسترسی داشته باشید
                  </p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiShoppingBag className="ml-2" />
                    مشاهده محصولات
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="wishlist-items"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {wishlist.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden  border-[#3b82f6] hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="relative overflow-hidden group">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                          onClick={() => handleViewDetails(item.productId)}
                        />
                        <button
                          onClick={() => removeFromWishlist(item.productId)}
                          className="absolute top-3 left-3 bg-white/90 hover:bg-white text-pink-600 p-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110"
                          title="حذف از علاقه‌مندی‌ها"
                        >
                          <FiX size={18} />
                        </button>
                      </div>

                      <div className="p-5">
                        <h3
                          className="text-lg font-bold text-[#1e40af] mb-2 cursor-pointer hover:text-[#3b82f6] transition-colors line-clamp-1"
                          onClick={() => handleViewDetails(item.productId)}
                        >
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleViewDetails(item.productId)}
                            className="flex-1 bg-white border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-1 space-x-reverse transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <FiEye />
                            <span>مشاهده جزئیات</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-6">
            <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-4">
              <FiHeart className="ml-2 text-[#e11d48]" size={20} />
              مزایای لیست علاقه‌مندی‌ها
            </h2>

            <div className="space-y-4">
              <div className="flex items-start p-3 rounded-lg bg-pink-50 border border-pink-100">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                    <FiHeart size={16} />
                  </div>
                </div>
                <div className="mr-3">
                  <h4 className="font-medium text-[#9d174d]">ذخیره محصولات</h4>
                  <p className="text-sm text-[#475569]">
                    محصولات مورد علاقه خود را برای خریدهای بعدی ذخیره کنید
                  </p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FiShoppingBag size={16} />
                  </div>
                </div>
                <div className="mr-3">
                  <h4 className="font-medium text-[#1e40af]">تخفیف‌های ویژه</h4>
                  <p className="text-sm text-[#475569]">
                    اولین نفری باشید که از تخفیف‌های ویژه محصولات علاقه‌مندی مطلع می‌شوید
                  </p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg bg-purple-50 border border-purple-100">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <FiStar size={16} />
                  </div>
                </div>
                <div className="mr-3">
                  <h4 className="font-medium text-[#6b21a8]">امتیاز وفاداری</h4>
                  <p className="text-sm text-[#475569]">
                    برای هر محصولی که از لیست علاقه‌مندی خریداری کنید 20 امتیاز اضافه دریافت می‌کنید
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-[#334155] mb-3">چرا لیست علاقه‌مندی‌ها مفید است؟</h3>
              <ul className="space-y-2 text-sm text-[#475569]">
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2">•</span>
                  <span>مقایسه راحت‌تر محصولات مشابه</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2">•</span>
                  <span>دسترسی سریع به محصولات مورد نظر</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2">•</span>
                  <span>مطلع شدن از تغییر قیمت محصولات</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#3b82f6] mr-2">•</span>
                  <span>سازماندهی بهتر خریدهای آینده</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;