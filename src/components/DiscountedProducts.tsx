import React from 'react';

const DiscountedProducts: React.FC = () => {
  const discountedProducts = [
    { id: 1, name: 'لپ‌تاپ اپل مک‌بوک پرو', price: '۲۹,۹۹۹,۰۰۰ تومان', discount: '۱۰٪', image: 'https://hirsagol.com/wp-content/uploads/2019/03/red-rose.jpg', link: '#' },
    { id: 2, name: 'گوشی موبایل سامسونگ گلکسی S21', price: '۱۵,۹۹۹,۰۰۰ تومان', discount: '۱۵٪', image: 'https://hirsagol.com/wp-content/uploads/2019/03/red-rose.jpg', link: '#' },
    { id: 3, name: 'هدفون بی‌ساز مدل QC35', price: '۴,۹۹۹,۰۰۰ تومان', discount: '۲۰٪', image: 'https://hirsagol.com/wp-content/uploads/2019/03/red-rose.jpg', link: '#' },
    { id: 4, name: 'تلویزیون ال‌جی 55 اینچ', price: '۱۲,۹۹۹,۰۰۰ تومان', discount: '۲۵٪', image: 'https://hirsagol.com/wp-content/uploads/2019/03/red-rose.jpg', link: '#' },
  ];

  return (
    <div className="my-8">
        <div className="flex justify-between items-center">
            <div className="flex-1"></div>
            <h2 className="text-2xl font-bold mb-4">تخفیف‌های ویژه</h2>
        </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {discountedProducts.map((product) => (
          <a key={product.id} href={product.link} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2 rounded-lg" />
            <span className="text-lg font-semibold">{product.name}</span>
            <span className="text-sm text-gray-600 line-through">{product.price}</span>
            <span className="text-sm text-red-500">{product.discount} تخفیف</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default DiscountedProducts;