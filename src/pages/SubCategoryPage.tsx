import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const SubCategoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const products = [
        { id: 1, subCategoryId: 1, name: "موبایل سامسونگ گلکسی S21", image: "https://via.placeholder.com/150" },
        { id: 2, subCategoryId: 1, name: "موبایل اپل آیفون 13", image: "https://via.placeholder.com/150" },
        { id: 3, subCategoryId: 1, name: "موبایل شیائومی Redmi Note 10", image: "https://via.placeholder.com/150" },
        { id: 4, subCategoryId: 1, name: "موبایل هوآوی P40 Pro", image: "https://via.placeholder.com/150" },
        { id: 5, subCategoryId: 2, name: "لپ‌تاپ ایسوس ROG", image: "https://via.placeholder.com/150" },
        { id: 6, subCategoryId: 2, name: "لپ‌تاپ دل XPS", image: "https://via.placeholder.com/150" },
        { id: 7, subCategoryId: 2, name: "لپ‌تاپ اپل مک‌بوک پرو", image: "https://via.placeholder.com/150" },
        { id: 8, subCategoryId: 2, name: "لپ‌تاپ لنوو Legion", image: "https://via.placeholder.com/150" },
        { id: 9, subCategoryId: 3, name: "تی‌شرت مردانه ساده", image: "https://via.placeholder.com/150" },
        { id: 10, subCategoryId: 3, name: "تی‌شرت مردانه طرح دار", image: "https://via.placeholder.com/150" },
        { id: 11, subCategoryId: 3, name: "پیراهن مردانه رسمی", image: "https://via.placeholder.com/150" },
        { id: 12, subCategoryId: 4, name: "شلوار جین مردانه", image: "https://via.placeholder.com/150" },
        { id: 13, subCategoryId: 4, name: "شلوار کتان مردانه", image: "https://via.placeholder.com/150" },
        { id: 14, subCategoryId: 5, name: "مبل کلاسیک چرمی", image: "https://via.placeholder.com/150" },
        { id: 15, subCategoryId: 5, name: "مبل مدرن", image: "https://via.placeholder.com/150" },
        { id: 16, subCategoryId: 6, name: "میز ناهارخوری شیشه‌ای", image: "https://via.placeholder.com/150" },
        { id: 17, subCategoryId: 6, name: "میز ناهارخوری چوبی", image: "https://via.placeholder.com/150" },
        { id: 18, subCategoryId: 7, name: "شیرینی خشک باقلوا", image: "https://via.placeholder.com/150" },
        { id: 19, subCategoryId: 7, name: "شیرینی خشک نارگیلی", image: "https://via.placeholder.com/150" },
        { id: 20, subCategoryId: 8, name: "نوشابه انرژی‌زا ردبول", image: "https://via.placeholder.com/150" },
        { id: 21, subCategoryId: 8, name: "نوشابه انرژی‌زا مونستر", image: "https://via.placeholder.com/150" },
        { id: 22, subCategoryId: 9, name: "کتاب رمان خارجی", image: "https://via.placeholder.com/150" },
        { id: 23, subCategoryId: 9, name: "کتاب رمان ایرانی", image: "https://via.placeholder.com/150" },
        { id: 24, subCategoryId: 10, name: "دفتر یادداشت A4", image: "https://via.placeholder.com/150" },
        { id: 25, subCategoryId: 10, name: "دفتر یادداشت جیبی", image: "https://via.placeholder.com/150" },
    ];

    const filteredProducts = products.filter((product) => product.subCategoryId === Number(id));

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">محصولات زیردسته‌بندی {id}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="p-4 bg-white rounded-lg shadow-md text-center cursor-pointer"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2 rounded-lg" />
                            <p>{product.name}</p>
                        </div>
                    ))
                ) : (
                    <p>هیچ محصولی در این زیردسته‌بندی موجود نیست.</p>
                )}
            </div>
        </div>
    );
};

export default SubCategoryPage;
