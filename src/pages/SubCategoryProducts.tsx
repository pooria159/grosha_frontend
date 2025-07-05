import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categories, Category, Subcategory } from "../data/categories";
import { Product } from "../data/products";
import { getProductsBySubcategory } from "../api/products";
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiStar, FiShoppingCart } from "react-icons/fi";
import IMG from "../assets/img.jpg";

const SubCategoryProducts: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                if (id) {
                    const decodedName = decodeURIComponent(id);
                    const data = await getProductsBySubcategory(decodedName);
                    setProducts(data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProducts();
        }
    }, [id]);

    const currentSubcategory = id ? decodeURIComponent(id) : "";

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = parseInt(e.target.value);
        setPriceRange(prev =>
            index === 0 ? [value, prev[1]] : [prev[0], value]
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
    };

    const filteredProducts = products.filter(product => {
        if (product.subcategory !== currentSubcategory) return false;
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
        return true;
    });

    const resetFilters = () => {
        setPriceRange([0, 50000000]);
    };

    return (
        <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen" style={{ direction: "rtl" }}>
            <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden fixed bottom-6 left-6 z-20 bg-[#00296B] text-white p-3 rounded-full shadow-lg flex items-center justify-center"
            >
                <FiFilter size={24} />
            </button>

            {isMobileFiltersOpen && (
                <div className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50">
                    <div className="absolute inset-y-0 left-0 w-4/5 bg-[#00296B] text-white p-4 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#FDC500]">فیلترها</h2>
                            <button onClick={() => setIsMobileFiltersOpen(false)}>
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3 text-[#FDC500] border-b border-[#00509D] pb-2">دسته‌بندی‌ها</h3>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <div key={category.id} className="mb-2">
                                            <div
                                                className="flex justify-between items-center cursor-pointer p-2 hover:bg-[#00509D] rounded-lg"
                                                onClick={() => toggleCategory(category.id)}
                                            >
                                                <span>{category.name}</span>
                                                {expandedCategories.includes(category.id) ? <FiChevronUp /> : <FiChevronDown />}
                                            </div>

                                            {expandedCategories.includes(category.id) && (
                                                <div className="pr-4 mt-1 space-y-1">
                                                    {category.subcategories.map(sub => (
                                                        <div
                                                            key={sub.id}
                                                            className={`p-2 rounded-lg cursor-pointer ${currentSubcategory === sub.name ? 'bg-[#FDC500] text-black' : 'hover:bg-[#003F7D]'}`}
                                                            onClick={() => {
                                                                navigate(`/subcategory-products/${encodeURIComponent(sub.name)}`);
                                                                setIsMobileFiltersOpen(false);
                                                            }}
                                                        >
                                                            {sub.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="hidden lg:block lg:w-1/4">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-6 border-b border-[#FDC500] pb-2">
                                <FiFilter className="ml-2 text-[#00296B]" size={20} />
                                فیلترها
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-3 text-[#1e293b]">دسته‌بندی‌ها</h3>
                                    <div className="space-y-2">
                                        {categories.map(category => (
                                            <div key={category.id} className="mb-2">
                                                <div
                                                    className="flex justify-between items-center cursor-pointer p-2 hover:bg-[#f1f5f9] rounded-lg"
                                                    onClick={() => toggleCategory(category.id)}
                                                >
                                                    <span>{category.name}</span>
                                                    {expandedCategories.includes(category.id) ? <FiChevronUp /> : <FiChevronDown />}
                                                </div>

                                                {expandedCategories.includes(category.id) && (
                                                    <div className="pr-4 mt-1 space-y-1">
                                                        {category.subcategories.map(sub => (
                                                            <div
                                                                key={sub.id}
                                                                className={`p-2 rounded-lg cursor-pointer ${currentSubcategory === sub.name ? 'bg-[#FDC500] text-black' : 'hover:bg-[#f1f5f9]'}`}
                                                                onClick={() => navigate(`/subcategory-products/${encodeURIComponent(sub.name)}`)}
                                                            >
                                                                {sub.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="w-full lg:w-3/4">
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <h1 className="text-2xl font-bold text-[#00296B] mb-2">
                                {currentSubcategory}
                            </h1>
                            <p className="text-[#64748b]">
                                {filteredProducts.length} محصول در این دسته‌بندی
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00509D]"></div>
                            </div>
                        ) : (
                            <>
                                {filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredProducts.map(product => (
                                            <div
                                                key={product.id}
                                                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                                                onClick={() => navigate(`/products/${product.id}`)}
                                            >
                                                <div className="relative h-60 overflow-hidden">
                                                    <img
                                                        src={IMG}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                                
                                                <div className="p-5">
                                                    <h3 className="font-bold text-lg text-[#1e293b] mb-2 truncate">
                                                        {product.name}
                                                    </h3>
                                                    
                                                    <div className="flex items-center mb-2">
                                                        <div className="flex text-[#FDC500]">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FiStar 
                                                                    key={i} 
                                                                    fill={i < (product.rating || 0) ? "#FDC500" : "none"}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                                        <h3 className="text-xl font-bold text-[#00296B] mb-2">
                                            محصولی یافت نشد
                                        </h3>
                                        <p className="text-[#64748b] mb-4">
                                            با تغییر فیلترها دوباره امتحان کنید
                                        </p>
                                        <button
                                            onClick={resetFilters}
                                            className="bg-gradient-to-r from-[#00296B] to-[#00509D] text-white px-6 py-2 rounded-lg hover:shadow-md transition-all"
                                        >
                                            حذف همه فیلترها
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SubCategoryProducts;