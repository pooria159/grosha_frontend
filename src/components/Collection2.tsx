import React from "react";

const DiscountedProducts: React.FC = () => {
    const discountedProducts = [
        {
            id: 1,
            name: "لپ‌تاپ اپل مک‌بوک پرو",
            price: "۲۹,۹۹۹,۰۰۰ تومان",
            discount: "۱۰٪",
            image: "https://dkstatics-public.digikala.com/digikala-adservice-banners/48ea73a7367c5cd0e365174b482d780003f24ba2_1742033983.jpg?x-oss-process=image/quality,q_95/format,webp",
            link: "#",
        },
        {
            id: 2,
            name: "گوشی موبایل سامسونگ گلکسی S21",
            price: "۱۵,۹۹۹,۰۰۰ تومان",
            discount: "۱۵٪",
            image: "https://dkstatics-public.digikala.com/digikala-adservice-banners/bf6d41c39da335ea5e560b4512f5a9c5bdbf4423_1742028056.jpg?x-oss-process=image/quality,q_95/format,webp",
            link: "#",
        },

    ];

    return (
        <div className="my-8">
            <div className="grid grid-cols-2 gap-4">
                {discountedProducts.map((product) => (
                    <a
                        key={product.id}
                        href={product.link}
                        className="flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                    >
                        <div className="w-full h-64 overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default DiscountedProducts;
