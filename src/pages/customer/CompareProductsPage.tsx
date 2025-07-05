import React from "react";
import { FiBarChart2, FiStar, FiTrash2, FiPlus, FiShoppingBag } from "react-icons/fi";

const CompareProductsPage: React.FC = () => {
  const products = [
    {
      id: 1,
      name: "گوشی موبایل سامسونگ گلکسی S23",
      price: "۲۹,۹۹۹,۰۰۰ تومان",
      rating: 4.7,
      features: [
        "پردازنده Snapdragon 8 Gen 2",
        "حافظه داخلی 256GB",
        "رم 8GB",
        "باتری 3900mAh",
        "دوربین اصلی 50MP"
      ],
      image: "https://images.samsung.com/is/image/samsung/p6pim/ir/2202/gallery/ir-galaxy-s22-s901-412360-sm-s901ezkgmid-530969917?$650_519_PNG$"
    },
    {
      id: 2,
      name: "گوشی موبایل آیفون 14 پرو",
      price: "۴۵,۵۰۰,۰۰۰ تومان",
      rating: 4.9,
      features: [
        "پردازنده A16 Bionic",
        "حافظه داخلی 256GB",
        "رم 6GB",
        "باتری 3200mAh",
        "دوربین اصلی 48MP"
      ],
      image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-2-202209?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660753619946"
    },
    {
      id: 3,
      name: "گوشی موبایل شیائومی 13 پرو",
      price: "۲۳,۷۵۰,۰۰۰ تومان",
      rating: 4.5,
      features: [
        "پردازنده Snapdragon 8 Gen 2",
        "حافظه داخلی 256GB",
        "رم 12GB",
        "باتری 4820mAh",
        "دوربین اصلی 50MP"
      ],
      image: "https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1676453023.11159185.png"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen p-4 md:p-8" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] flex items-center justify-center">
            <FiBarChart2 className="ml-2 text-[#3b82f6]" size={32} />
            مقایسه محصولات
          </h1>
          <p className="text-[#64748b] mt-3 max-w-2xl mx-auto">
            محصولات انتخابی خود را مقایسه کنید و بهترین گزینه را انتخاب نمایید
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-sm text-[#64748b]">تعداد محصولات:</span>
            <span className="bg-[#3b82f6] text-white px-3 py-1 rounded-full text-sm font-medium">
              {products.length} محصول
            </span>
          </div>
          
          <div className="flex space-x-2 space-x-reverse">
            <button className="flex items-center bg-white border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 px-4 py-2 rounded-lg transition-colors">
              <FiPlus className="ml-2" size={16} />
              افزودن محصول جدید
            </button>
            <button className="flex items-center bg-[#ef4444] text-white hover:bg-[#dc2626] px-4 py-2 rounded-lg transition-colors">
              <FiTrash2 className="ml-2" size={16} />
              پاک کردن همه
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#3b82f6] text-white">
                <tr>
                  <th className="py-4 px-6 text-right w-64">ویژگی‌ها</th>
                  {products.map((product) => (
                    <th key={product.id} className="py-4 px-6 text-center relative w-72">
                      <div className="flex flex-col items-center">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-24 h-24 object-contain mb-3 rounded-lg bg-gray-100 p-2"
                        />
                        <h3 className="font-medium text-sm md:text-base">{product.name}</h3>
                        <button className="absolute left-3 top-3 text-white/80 hover:text-white">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-[#334155]">قیمت</td>
                  {products.map((product) => (
                    <td key={product.id} className="py-4 px-6 text-center">
                      <span className="text-green-600 font-bold">{product.price}</span>
                    </td>
                  ))}
                </tr>
                
                <tr className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-[#334155]">امتیاز</td>
                  {products.map((product) => (
                    <td key={product.id} className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center">
                        <FiStar className="text-yellow-400 ml-1" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-gray-400 mr-1">/5</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {products[0].features.map((_, featureIndex) => (
                  <tr key={featureIndex} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-6 font-medium text-[#334155]">
                      ویژگی {featureIndex + 1}
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="py-3 px-6 text-center text-[#475569]">
                        {product.features[featureIndex]}
                      </td>
                    ))}
                  </tr>
                ))}
                
                <tr>
                  <td className="py-4 px-6"></td>
                  {products.map((product) => (
                    <td key={product.id} className="py-4 px-6 text-center">
                      <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg flex items-center mx-auto transition-colors">
                        <FiShoppingBag className="ml-2" size={16} />
                        افزودن به سبد خرید
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#1e293b] mb-4 flex items-center">
            <FiBarChart2 className="ml-2 text-[#3b82f6]" size={20} />
            نتیجه مقایسه
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#f0fdf4] p-4 rounded-lg border border-[#bbf7d0]">
              <h3 className="font-medium text-[#166534] mb-2">بهترین قیمت</h3>
              <p className="text-[#475569]">{products[2].name}</p>
              <p className="text-green-600 font-bold mt-1">{products[2].price}</p>
            </div>
            
            <div className="bg-[#eff6ff] p-4 rounded-lg border border-[#bfdbfe]">
              <h3 className="font-medium text-[#1e3a8a] mb-2">بالاترین امتیاز</h3>
              <p className="text-[#475569]">{products[1].name}</p>
              <div className="flex items-center mt-1">
                <FiStar className="text-yellow-400 ml-1" />
                <span className="font-medium">{products[1].rating}</span>
              </div>
            </div>
            
            <div className="bg-[#fef2f2] p-4 rounded-lg border border-[#fecaca]">
              <h3 className="font-medium text-[#991b1b] mb-2">بهترین باتری</h3>
              <p className="text-[#475569]">{products[2].name}</p>
              <p className="text-[#475569] mt-1">4820mAh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareProductsPage;