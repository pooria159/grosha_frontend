import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductsByCategory } from "../api/products";
import { Product } from "../data/products";

const CategoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                if (id) {
                    const decodedName = decodeURIComponent(id);
                    setCategoryName(decodedName);
                    const data = await getProductsByCategory(decodedName);
                    setProducts(data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                navigate("/error", { state: { message: "خطا در دریافت محصولات" } });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [id, navigate]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">محصولات دسته‌بندی {categoryName}</h1>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00509D]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                                className="p-4 bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                            >
                                <div className="h-48 bg-gray-200 flex items-center justify-center mb-2 rounded-lg overflow-hidden">
                                    <img 
                                        src={product.image || "https://via.placeholder.com/300x300?text=Product+Image"} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x300?text=Product+Image";
                                        }}
                                    />
                                </div>
                                <h3 className="font-medium text-gray-800">{product.name}</h3>
                                <p className="text-[#00509D] font-bold mt-2">
                                    {product.price.toLocaleString()} تومان
                                </p>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-600 mb-4">هیچ محصولی در این دسته‌بندی موجود نیست.</p>
                            <button 
                                onClick={() => navigate(-1)}
                                className="bg-[#00509D] text-white px-4 py-2 rounded hover:bg-[#003F7D] transition-colors"
                            >
                                بازگشت
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;