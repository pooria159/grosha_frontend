import React from "react";
import { useNavigate } from "react-router-dom";

interface Product {
    id: number;
    title: string;
    image: string;
}

const products: Product[] = [
    { id: 1, title: "دریل پیچ گوشتی شارژی چکشی نیو", image: "https://www.digikala.com/mag/wp-content/uploads/2025/03/03-accessories-for-traveling-via-train.jpeg" },
    { id: 2, title: "فوتبال دستی داوین مدل FB01", image: "https://www.digikala.com/mag/wp-content/uploads/2025/03/03-accessories-for-traveling-via-train.jpeg" },
    { id: 3, title: "مودم 4.5G قابل حمل", image: "https://www.digikala.com/mag/wp-content/uploads/2025/03/03-accessories-for-traveling-via-train.jpeg" },
    { id: 4, title: "سرخ کن بدون روغن مدل EY501", image: "https://www.digikala.com/mag/wp-content/uploads/2025/03/03-accessories-for-traveling-via-train.jpeg" },
    { id: 5, title: "جاکفشی ایعیان مدل FH485", image: "https://www.digikala.com/mag/wp-content/uploads/2025/03/03-accessories-for-traveling-via-train.jpeg" },
    { id: 6, title: "ست تی شرت و شلوار دخترانه", image: "https://www.digikala.com/mag/wp-content/uploads/2025/03/03-accessories-for-traveling-via-train.jpeg" },
    { id: 7, title: "ست تی شرت و شلوار دخترانه", image: "https://www.digikala.com/mag/wp-content/uploads/2025/03/03-accessories-for-traveling-via-train.jpeg" },
    { id: 8, title: "ست تی شرت و شلوار دخترانه", image: "https://www.digikala.com/mag/wp-content/uploads/2025/03/03-accessories-for-traveling-via-train.jpeg" },
    { id: 9, title: "جاکفشی ایعیان مدل FH485", image: "https://www.digikala.com/mag/wp-content/uploads/2025/03/03-accessories-for-traveling-via-train.jpeg" },
    { id: 10, title: "ست تی شرت و شلوار دخترانه", image: "https://www.digikala.com/mag/wp-content/uploads/2025/03/03-accessories-for-traveling-via-train.jpeg" },
];

const HotProducts: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-md w-full mx-auto my-8">
            <div className="p-6">
                <h2 className="text-xl font-bold text-right mb-4">🔥 داغ ترین چند ساعت گذشته</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="p-4 border rounded-lg shadow-sm flex flex-col items-center">
                            <img src={product.image} alt={product.title} className="w-32 h-32 object-cover rounded" />
                            <p className="text-sm text-center mt-2">{product.title}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => navigate('/new-page')}
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600">
                        مشاهده بیشتر
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotProducts;
