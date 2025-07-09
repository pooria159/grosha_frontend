import React, { useState, useEffect, useRef } from "react";
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, 
  FiX, FiCheck, FiArrowUp, FiChevronDown,
  FiFilter, FiDownload 
} from "react-icons/fi";
import { BsExclamationCircle } from "react-icons/bs";
import { categories } from "../categoriesData";
import * as XLSX from 'xlsx';

interface Subcategory {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    subcategories: Subcategory[];
}

interface Product {
    id: number;
    name: string;
    category: string;
    subcategory: string;
    price: number;
    stock: number;
}

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
        name: "",
        category: "",
        subcategory: "",
        price: 0,
        stock: 0
    });
    const [editProductId, setEditProductId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<"all" | "inStock" | "outOfStock">("all");
    const [sortConfig, setSortConfig] = useState<{key: keyof Product; direction: 'asc' | 'desc'} | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    const topRef = useRef<HTMLDivElement | null>(null);

    const handleScrollToTop = () => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const refreshAccessToken = async () => {
        if (!refresh_token) {
            console.error("توکن refresh یافت نشد.");
            return null;
        }

        const response = await fetch("https://api.grosha.ir/api/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refresh_token }),
        });

        if (response.ok) {
            const data = await response.json();
            const newAccessToken = data.access_token;
            localStorage.setItem("access_token", newAccessToken);
            return newAccessToken;
        } else {
            console.error("خطا در تمدید توکن.");
            return null;
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let currentToken = token;

            if (!currentToken) {
                currentToken = await refreshAccessToken();
            }

            if (!currentToken) {
                console.error("توکن معتبر یافت نشد.");
                return;
            }

            const response = await fetch("https://api.grosha.ir/api/products/", {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("خطا: داده دریافتی آرایه نیست", data);
                    setProducts([]);
                }
            } else {
                const error = await response.json();
                console.error(`خطا در واکشی محصولات: ${error.detail || response.statusText}`);
                setProducts([]);
            }
        } catch (err) {
            console.error("خطا در ارتباط با سرور:", err);
            setProducts([]);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = async () => {
        const cleanedProduct = {
            ...newProduct,
            category: newProduct.category.trim(),
            subcategory: newProduct.subcategory.trim()
        };

        if (!cleanedProduct.name || !cleanedProduct.category || !cleanedProduct.subcategory || cleanedProduct.price <= 0 || cleanedProduct.stock <= 0) {
            alert("لطفاً تمام فیلدها را به درستی پر کنید.");
            return;
        }

        let currentToken = token;

        if (!currentToken) {
            currentToken = await refreshAccessToken();
        }

        if (!currentToken) {
            alert("توکن معتبر یافت نشد.");
            return;
        }

        const response = await fetch("https://api.grosha.ir/api/products/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentToken}`,
            },
            body: JSON.stringify(cleanedProduct),
        });

        if (response.ok) {
            const product: Product = await response.json();
            setProducts([...products, product]);
            setNewProduct({ name: "", category: "", subcategory: "", price: 0, stock: 0 });
            setSelectedCategory(null);
        } else {
            const error = await response.json();
            alert(`افزودن محصول با مشکل مواجه شد: ${error.detail || "خطای نامشخص"}`);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        const response = await fetch(`https://api.grosha.ir/api/products/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            setProducts(products.filter((p) => p.id !== id));
            setShowDeleteModal(false);
        } else {
            alert("حذف محصول ناموفق بود.");
        }
    };

    const handleEditProduct = (id: number) => {
        const product = products.find((p) => p.id === id);
        if (product) {
            setNewProduct({
                name: product.name,
                category: product.category,
                subcategory: product.subcategory,
                price: product.price,
                stock: product.stock
            });

            const category = categories.find(cat => cat.name === product.category);
            setSelectedCategory(category || null);

            setEditProductId(id);
        }
    };

    const handleSaveEdit = async () => {
        if (!editProductId) return;

        const cleanedProduct = {
            ...newProduct,
            category: newProduct.category.trim(),
            subcategory: newProduct.subcategory.trim()
        };

        if (!cleanedProduct.name || !cleanedProduct.category || !cleanedProduct.subcategory || cleanedProduct.price <= 0 || cleanedProduct.stock <= 0) {
            alert("لطفاً تمام فیلدها را به درستی پر کنید.");
            return;
        }

        const response = await fetch(`https://api.grosha.ir/api/products/${editProductId}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(cleanedProduct),
        });

        if (response.ok) {
            const updated: Product = await response.json();
            setProducts(products.map(p => p.id === editProductId ? updated : p));
            setEditProductId(null);
            setNewProduct({ name: "", category: "", subcategory: "", price: 0, stock: 0 });
            setSelectedCategory(null);
        } else {
            const error = await response.json();
            alert(`ویرایش محصول با مشکل مواجه شد: ${error.detail || "خطای نامشخص"}`);
        }
    };

    const handleCancelEdit = () => {
        setEditProductId(null);
        setNewProduct({ name: "", category: "", subcategory: "", price: 0, stock: 0 });
        setSelectedCategory(null);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryName = e.target.value;
        const category = categories.find(cat => cat.name === categoryName) || null;

        setSelectedCategory(category);
        setNewProduct({
            ...newProduct,
            category: categoryName,
            subcategory: ""
        });
    };

    const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewProduct({
            ...newProduct,
            subcategory: e.target.value
        });
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (!sortConfig) return 0;
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredProducts = sortedProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (activeTab === "inStock") return matchesSearch && product.stock > 0;
        if (activeTab === "outOfStock") return matchesSearch && product.stock === 0;
        return matchesSearch;
    });

    const requestSort = (key: keyof Product) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleExportExcel = () => {
        const dataToExport = filteredProducts.map(product => ({
            'نام محصول': product.name,
            'دسته‌بندی': product.category,
            'زیرمجموعه': product.subcategory,
            'قیمت (تومان)': product.price,
            'موجودی': product.stock > 0 ? `${product.stock} عدد` : 'ناموجود'
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "محصولات");
        
        if (!worksheet['!cols']) worksheet['!cols'] = [];

        XLSX.writeFile(workbook, "لیست_محصولات.xlsx", { bookType: 'xlsx'});
    };

    const Loader = () => (
        <div className="flex justify-center items-center py-12">
            <div className="relative w-24 h-24 animate-spin">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-8 rounded-full bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8]"
                        style={{
                            transform: `rotate(${i * 30}deg) translate(0, -36px)`,
                            opacity: 0.1 + (i * 0.05),
                            transformOrigin: "bottom center"
                        }}
                    />
                ))}
            </div>
        </div>
    );

    const ProductStatusBadge = ({ stock }: { stock: number }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            stock > 10 ? 'bg-green-100 text-green-800' :
            stock > 0 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
        }`}>
            {stock > 0 ? `${stock} عدد` : 'ناموجود'}
        </span>
    );

    return (
        <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] min-h-screen p-2 sm:p-4 md:p-6" style={{ direction: 'rtl' }}>
            <button 
                onClick={handleScrollToTop}
                className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white p-2 sm:p-3 rounded-full shadow-lg z-10 hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
                <FiArrowUp size={18} className="sm:size-[20px]" />
            </button>

            <div className="max-w-7xl mx-auto">
                <div className="mb-4 sm:mb-6 md:mb-8 text-center" ref={topRef}>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e293b] mb-1 sm:mb-2 md:mb-3">
                        مدیریت محصولات
                    </h1>
                    <p className="text-[#64748b] text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
                        مدیریت و سازماندهی محصولات فروشگاه شما با امکانات پیشرفته
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg border border-white/50 overflow-hidden mb-4 sm:mb-6 md:mb-8">
                    <div className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] p-3 sm:p-4 text-white">
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center justify-center sm:justify-start">
                            {editProductId ? (
                                <>
                                    <FiEdit2 className="ml-1 sm:ml-2" />
                                    ویرایش محصول
                                </>
                            ) : (
                                <>
                                    <FiPlus className="ml-1 sm:ml-2" />
                                    افزودن محصول جدید
                                </>
                            )}
                        </h2>
                    </div>
                    
                    <div className="p-3 sm:p-4 md:p-6">
                        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                            <div className="space-y-1 sm:space-y-2">
                                <label className="block text-[#334155] text-xs sm:text-sm md:text-base font-medium">
                                    نام محصول <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="نام محصول"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all text-xs sm:text-sm md:text-base"
                                    />
                                    {newProduct.name && (
                                        <FiCheck className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-1 sm:space-y-2">
                                <label className="block text-[#334155] text-xs sm:text-sm md:text-base font-medium">
                                    دسته‌بندی <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={newProduct.category}
                                        onChange={handleCategoryChange}
                                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all appearance-none bg-white pr-8 text-xs sm:text-sm md:text-base"
                                    >
                                        <option value="">انتخاب دسته‌بندی</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <FiChevronDown className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            
                            {selectedCategory && (
                                <div className="space-y-1 sm:space-y-2">
                                    <label className="block text-[#334155] text-xs sm:text-sm md:text-base font-medium">
                                        زیرمجموعه <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={newProduct.subcategory}
                                            onChange={handleSubcategoryChange}
                                            className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all appearance-none bg-white pr-8 text-xs sm:text-sm md:text-base"
                                        >
                                            <option value="">انتخاب زیرمجموعه</option>
                                            {selectedCategory.subcategories.map((subcategory) => (
                                                <option key={subcategory.id} value={subcategory.name}>
                                                    {subcategory.name}
                                                </option>
                                            ))}
                                        </select>
                                        <FiChevronDown className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            )}
                            
                            <div className="space-y-1 sm:space-y-2">
                                <label className="block text-[#334155] text-xs sm:text-sm md:text-base font-medium">
                                    قیمت (تومان) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="قیمت"
                                        value={newProduct.price || ""}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })}
                                        className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all pl-10 text-xs sm:text-sm md:text-base"
                                    />
                                    <span className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm md:text-base">تومان</span>
                                </div>
                            </div>
                            
                            <div className="space-y-1 sm:space-y-2">
                                <label className="block text-[#334155] text-xs sm:text-sm md:text-base font-medium">
                                    موجودی <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="موجودی"
                                    value={newProduct.stock || ""}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: +e.target.value })}
                                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all text-xs sm:text-sm md:text-base"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                            <button
                                onClick={editProductId ? handleSaveEdit : handleAddProduct}
                                disabled={!newProduct.name || !newProduct.category || !newProduct.subcategory || newProduct.price <= 0 || newProduct.stock < 0}
                                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 hover:shadow-lg w-full sm:w-auto flex items-center justify-center ${
                                    editProductId 
                                        ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857]"
                                        : "bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white hover:from-[#2563eb] hover:to-[#1e40af]"
                                } ${
                                    (!newProduct.name || !newProduct.category || !newProduct.subcategory || newProduct.price <= 0 || newProduct.stock < 0) 
                                        ? "opacity-50 cursor-not-allowed" 
                                        : ""
                                }`}
                            >
                                {editProductId ? (
                                    <>
                                        <FiEdit2 className="ml-1 sm:ml-2" />
                                        <span className="text-xs sm:text-sm md:text-base">ذخیره تغییرات</span>
                                    </>
                                ) : (
                                    <>
                                        <FiPlus className="ml-1 sm:ml-2" />
                                        <span className="text-xs sm:text-sm md:text-base">افزودن محصول</span>
                                    </>
                                )}
                            </button>
                            
                            {editProductId && (
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg transition-all duration-300 hover:shadow-lg w-full sm:w-auto flex items-center justify-center"
                                >
                                    <FiX className="ml-1 sm:ml-2" />
                                    <span className="text-xs sm:text-sm md:text-base">انصراف از ویرایش</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg border border-white/50 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="w-full">
                            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#1e293b] flex items-center">
                                <FiSearch className="ml-1 sm:ml-2 text-[#3b82f6]" />
                                <span>جستجوی محصولات</span>
                            </h2>
                        </div>
                        
                        <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="جستجوی محصولات..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-2 sm:p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all text-xs sm:text-sm md:text-base"
                                />
                                <FiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
                                >
                                    <FiFilter className="text-[#3b82f6]" />
                                    <span className="text-xs sm:text-sm md:text-base">فیلترها</span>
                                </button>
                                
                                {showFilters && (
                                    <div className="absolute left-0 mt-1 sm:mt-2 w-full sm:w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10 p-2 sm:p-3 md:p-4">
                                        <div className="space-y-2 sm:space-y-3">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">وضعیت موجودی</label>
                                                <select 
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3b82f6] focus:border-[#3b82f6] text-xs sm:text-sm"
                                                    value={activeTab}
                                                    onChange={(e) => setActiveTab(e.target.value as "all" | "inStock" | "outOfStock")}
                                                >
                                                    <option value="all">همه محصولات</option>
                                                    <option value="inStock">فقط موجود</option>
                                                    <option value="outOfStock">فقط ناموجود</option>
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
                                                <select 
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3b82f6] focus:border-[#3b82f6] text-xs sm:text-sm"
                                                >
                                                    <option value="">همه دسته‌بندی‌ها</option>
                                                    {categories.map(category => (
                                                        <option key={category.id} value={category.name}>{category.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex overflow-x-auto border-b border-gray-200 mt-3 sm:mt-4 md:mt-6">
                        <button
                            className={`py-2 px-2 sm:px-3 md:px-4 font-medium text-xs sm:text-sm flex items-center border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === "all" 
                                    ? "border-[#3b82f6] text-[#3b82f6]" 
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("all")}
                        >
                            همه محصولات
                            <span className="bg-gray-100 text-gray-600 rounded-full px-1 sm:px-2 py-0.5 text-xs font-medium mr-1 sm:mr-2">
                                {products.length}
                            </span>
                        </button>
                        
                        <button
                            className={`py-2 px-2 sm:px-3 md:px-4 font-medium text-xs sm:text-sm flex items-center border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === "inStock" 
                                    ? "border-[#10b981] text-[#10b981]" 
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("inStock")}
                        >
                            موجود در انبار
                            <span className="bg-gray-100 text-gray-600 rounded-full px-1 sm:px-2 py-0.5 text-xs font-medium mr-1 sm:mr-2">
                                {products.filter(p => p.stock > 0).length}
                            </span>
                        </button>
                        
                        <button
                            className={`py-2 px-2 sm:px-3 md:px-4 font-medium text-xs sm:text-sm flex items-center border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === "outOfStock" 
                                    ? "border-[#ef4444] text-[#ef4444]" 
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("outOfStock")}
                        >
                            ناموجود
                            <span className="bg-gray-100 text-gray-600 rounded-full px-1 sm:px-2 py-0.5 text-xs font-medium mr-1 sm:mr-2">
                                {products.filter(p => p.stock === 0).length}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg border border-white/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] p-3 sm:p-4 text-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
                            <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center">
                                لیست محصولات
                                <span className="bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium mr-1 sm:mr-2 md:mr-3">
                                    {filteredProducts.length} محصول
                                </span>
                            </h2>
                            
                            <div className="mt-1 sm:mt-0 flex items-center gap-1 sm:gap-2">
                                <button 
                                    onClick={handleExportExcel}
                                    className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 rounded-lg text-xs sm:text-sm hover:bg-white/20 transition-colors"
                                >
                                    <FiDownload size={12} className="sm:size-[14px]" />
                                    <span className="hidden sm:inline">خروجی Excel</span>
                                    <span className="sm:hidden">Excel</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-2 sm:p-3 md:p-4 lg:p-6">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">نام محصول</th>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">دسته بندی</th>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">زیر مجموعه</th>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">قیمت (تومان)</th>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">موجودی</th>
                                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-[#1e293b]">{product.name}</div>
                                                </td>
                                                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-[#475569]">
                                                    {product.subcategory}
                                                </td>
                                                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-[#1e293b]">
                                                    {product.price.toLocaleString('fa-IR')} تومان
                                                </td>
                                                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                                                    <ProductStatusBadge stock={product.stock} />
                                                </td>
                                                <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-[#475569]">
                                                    <div className="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
                                                        <button
                                                            onClick={() => {
                                                                handleEditProduct(product.id);
                                                                handleScrollToTop();
                                                            }}
                                                            className="text-[#3b82f6] hover:text-[#1d4ed8] transition-colors p-1 sm:p-2 rounded-full hover:bg-blue-50"
                                                            title="ویرایش"
                                                        >
                                                            <FiEdit2 size={16} className="sm:size-[18px]" />
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => {
                                                                setShowDeleteModal(true);
                                                                setProductToDelete(product.id);
                                                            }}
                                                            className="text-[#ef4444] hover:text-[#dc2626] transition-colors p-1 sm:p-2 rounded-full hover:bg-red-50"
                                                            title="حذف"
                                                        >
                                                            <FiTrash2 size={16} className="sm:size-[18px]" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="sm:hidden space-y-3">
                                    {filteredProducts.map((product) => (
                                        <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-sm font-medium text-[#1e293b]">{product.name}</h3>
                                                <div className="flex space-x-2 space-x-reverse">
                                                    <button
                                                        onClick={() => {
                                                            handleEditProduct(product.id);
                                                            handleScrollToTop();
                                                        }}
                                                        className="text-[#3b82f6] hover:text-[#1d4ed8] transition-colors p-1 rounded-full hover:bg-blue-50"
                                                        title="ویرایش"
                                                    >
                                                        <FiEdit2 size={16} />
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => {
                                                            setShowDeleteModal(true);
                                                            setProductToDelete(product.id);
                                                        }}
                                                        className="text-[#ef4444] hover:text-[#dc2626] transition-colors p-1 rounded-full hover:bg-red-50"
                                                        title="حذف"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <p className="text-gray-500">دسته‌بندی</p>
                                                    <p className="text-[#1e293b]">{product.category}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">زیرمجموعه</p>
                                                    <p className="text-[#1e293b]">{product.subcategory}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">قیمت</p>
                                                    <p className="text-[#1e293b]">{product.price.toLocaleString('fa-IR')} تومان</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">موجودی</p>
                                                    <div className="mt-1">
                                                        <ProductStatusBadge stock={product.stock} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {filteredProducts.length === 0 && !loading && (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="mx-auto w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                            <BsExclamationCircle size={24} className="sm:size-[32px] text-gray-400" />
                                        </div>
                                        <h3 className="text-sm sm:text-base md:text-lg font-medium text-[#334155]">محصولی یافت نشد</h3>
                                        <p className="text-[#64748b] text-xs sm:text-sm md:text-base mt-1">
                                            {searchQuery 
                                                ? "هیچ محصولی با معیارهای جستجوی شما مطابقت ندارد" 
                                                : activeTab === "inStock" 
                                                    ? "هیچ محصول موجودی در انبار وجود ندارد" 
                                                    : activeTab === "outOfStock" 
                                                        ? "همه محصولات موجود هستند" 
                                                        : "هنوز محصولی اضافه نشده است"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-xl overflow-hidden w-full max-w-xs sm:max-w-sm md:max-w-md">
                        <div className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] p-3 sm:p-4 text-white">
                            <h3 className="text-sm sm:text-base md:text-lg font-semibold flex items-center justify-center sm:justify-start">
                                <FiTrash2 className="ml-1 sm:ml-2" />
                                <span>حذف محصول</span>
                            </h3>
                        </div>
                        
                        <div className="p-3 sm:p-4 md:p-6">
                            <p className="text-[#475569] text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6">
                                آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟ این عمل برگشت‌پذیر نیست.
                            </p>
                            
                            <div className="flex justify-end space-x-2 sm:space-x-3 space-x-reverse">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg text-[#334155] text-xs sm:text-sm md:text-base hover:bg-gray-50 transition-colors"
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={() => {
                                        if (productToDelete) {
                                            handleDeleteProduct(productToDelete);
                                        }
                                    }}
                                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg hover:shadow-md transition-all text-xs sm:text-sm md:text-base"
                                >
                                    حذف محصول
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;