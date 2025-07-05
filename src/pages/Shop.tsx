import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import { FiFilter, FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

const Shop: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleFilter = (id: number | null) => {
        setSelectedCategory(id);
    };

    const handleSubCategoryClick = (subCategoryName: string) => {
        const encodedName = encodeURIComponent(subCategoryName);
        navigate(`/subcategory-products/${encodedName}`);
    };

    const filteredCategories = selectedCategory
        ? categories.filter((cat) => cat.id === selectedCategory)
        : categories;

    const searchedCategories = searchQuery
        ? filteredCategories.map(category => ({
            ...category,
            subcategories: category.subcategories.filter(sub => 
                sub.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(category => category.subcategories.length > 0)
        : filteredCategories;

    return (
        <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen" style={{ direction: "rtl" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1e293b]">فروشگاه آنلاین</h1>
                        <p className="text-[#64748b] mt-2">دسته‌بندی مورد نظر خود را انتخاب کنید</p>
                    </div>
                    
                    <div className="relative mt-4 md:mt-0 w-full md:w-64">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <FiSearch className="text-[#64748b]" />
                        </div>
                        <input
                            type="text"
                            placeholder="جستجو در دسته‌بندی‌ها..."
                            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00296B] focus:border-[#00296B] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="lg:w-1/5">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-4">
                                <FiFilter className="ml-2 text-[#00296B]" size={20} />
                                فیلتر دسته‌بندی
                            </h2>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => handleFilter(null)}
                                        className={`w-full text-right px-4 py-3 rounded-lg flex items-center justify-between transition-all ${
                                            selectedCategory === null
                                                ? "bg-gradient-to-r from-[#00296B] to-[#00509D] text-white shadow-md"
                                                : "hover:bg-[#f1f5f9] text-[#334155]"
                                        }`}
                                    >
                                        همه دسته‌بندی‌ها
                                        {selectedCategory === null && <FiChevronLeft />}
                                    </button>
                                </li>
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <button
                                            onClick={() => handleFilter(category.id)}
                                            className={`w-full text-right px-4 py-3 rounded-lg flex items-center justify-between transition-all ${
                                                selectedCategory === category.id
                                                    ? "bg-gradient-to-r from-[#00296B] to-[#00509D] text-white shadow-md"
                                                    : "hover:bg-[#f1f5f9] text-[#334155]"
                                            }`}
                                        >
                                            {category.name}
                                            {selectedCategory === category.id && <FiChevronLeft />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <main className="lg:w-4/5">
                        {searchedCategories.length > 0 ? (
                            <div className="space-y-6">
                                {searchedCategories.map((category) => (
                                    <div key={category.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                        <div className="bg-gradient-to-r from-[#00296B] to-[#00509D] p-4">
                                            <h3 className="text-xl font-bold text-white flex items-center">
                                                <span className="bg-[#FDC500] text-[#00296B] w-8 h-8 rounded-full flex items-center justify-center ml-2">
                                                    {category.id}
                                                </span>
                                                {category.name}
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                                            {category.subcategories.map((sub) => (
                                                <div
                                                    key={sub.id}
                                                    className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                                                    onClick={() => handleSubCategoryClick(sub.name)}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#00296B]/10 to-[#FDC500]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    
                                                    <div className="h-60 bg-gray-100 overflow-hidden">
                                                        <img 
                                                            src={sub.image} 
                                                            alt={sub.name}
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    </div>
                                                    
                                                    <div className="p-4 text-center">
                                                        <h4 className="font-bold text-[#1e293b] group-hover:text-[#00509D] transition-colors">
                                                            {sub.name}
                                                        </h4>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                                <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                                    دسته‌بندی یافت نشد
                                </h3>
                                <p className="text-[#64748b] max-w-md mx-auto">
                                    هیچ دسته‌بندی با جستجوی شما مطابقت ندارد. لطفاً عبارت دیگری را امتحان کنید.
                                </p>
                                <button 
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory(null);
                                    }}
                                    className="mt-4 bg-gradient-to-r from-[#00296B] to-[#00509D] text-white px-6 py-2 rounded-lg hover:shadow-md transition-all"
                                >
                                    نمایش همه دسته‌بندی‌ها
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;