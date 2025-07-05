import React from "react";

const DiscountedProducts: React.FC = () => {
    const discountedProducts = [
        {
            id: 1,
            name: "لپ‌تاپ اپل مک‌بوک پرو",
            price: "۲۹,۹۹۹,۰۰۰ تومان",
            discount: "۱۰٪",
            image:
                "https://dkstatics-public.digikala.com/digikala-adservice-banners/44b4889507363354138fbabd2184d65cb8ff926f_1742577244.jpg?x-oss-process=image/quality,q_95/format,webp",
            link: "#",
        },
        {
            id: 2,
            name: "گوشی موبایل سامسونگ گلکسی S21",
            price: "۱۵,۹۹۹,۰۰۰ تومان",
            discount: "۱۵٪",
            image:
                "https://dkms.digikala.com/static/files/a9e1ec70.jpg?x-oss-process=image/format,webp",
            link: "#",
        },
        {
            id: 3,
            name: "هدفون بی‌ساز مدل QC35",
            price: "۴,۹۹۹,۰۰۰ تومان",
            discount: "۲۰٪",
            image:
                "https://dkms.digikala.com/static/files/fd340e5a.jpg?x-oss-process=image/format,webp",
            link: "#",
        },
        {
            id: 4,
            name: "تلویزیون ال‌جی 55 اینچ",
            price: "۱۲,۹۹۹,۰۰۰ تومان",
            discount: "۲۵٪",
            image:
                "https://dkms.digikala.com/static/files/3ea4f643.jpg?x-oss-process=image/format,webp",
            link: "#",
        },
    ];

    return (
        <div className="my-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {discountedProducts.map((product) => (
                    <a
                        key={product.id}
                        href={product.link}
                        className="flex flex-col items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                    >
                        <div className="w-full h-56 overflow-hidden rounded-t-lg">
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
