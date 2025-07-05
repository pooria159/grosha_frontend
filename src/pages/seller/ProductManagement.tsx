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

        const response = await fetch("http://localhost:8000/api/token/refresh/", {
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

            const response = await fetch("http://localhost:8000/api/products/", {
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

        const response = await fetch("http://localhost:8000/api/products/", {
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
        const response = await fetch(`http://localhost:8000/api/products/${id}/`, {
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

        const response = await fetch(`http://localhost:8000/api/products/${editProductId}/`, {
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
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            stock > 10 ? 'bg-green-100 text-green-800' :
            stock > 0 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
        }`}>
            {stock > 0 ? `${stock} عدد` : 'ناموجود'}
        </span>
    );

    const SortableHeader = ({ label, sortKey }: { label: string; sortKey: keyof Product }) => (
        <th 
            className="px-4 py-3 text-right text-xs font-medium text-[#3b82f6] uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => requestSort(sortKey)}
        >
            <div className="flex items-center justify-end">
                {label}
                {sortConfig?.key === sortKey && (
                    <span className="mr-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                )}
            </div>
        </th>
    );

    return (
        <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] min-h-screen p-4 md:p-8" style={{ direction: 'rtl' }}>
            <button 
                onClick={handleScrollToTop}
                className="fixed bottom-6 left-6 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white p-3 rounded-full shadow-lg z-10 hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
                <FiArrowUp size={20} />
            </button>

            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center" ref={topRef}>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-3 relative inline-block">
                        مدیریت محصولات
                    </h1>
                    <p className="text-[#64748b] max-w-2xl mx-auto">
                        مدیریت و سازماندهی محصولات فروشگاه شما با امکانات پیشرفته
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] p-4 text-white">
                        <h2 className="text-xl font-semibold flex items-center">
                            {editProductId ? (
                                <>
                                    <FiEdit2 className="ml-2" />
                                    ویرایش محصول
                                </>
                            ) : (
                                <>
                                    <FiPlus className="ml-2" />
                                    افزودن محصول جدید
                                </>
                            )}
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="block text-[#334155] font-medium">نام محصول <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="نام محصول"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                                    />
                                    {newProduct.name && (
                                        <FiCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-[#334155] font-medium">دسته‌بندی <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select
                                        value={newProduct.category}
                                        onChange={handleCategoryChange}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all appearance-none bg-white pr-3"
                                    >
                                        <option value="">انتخاب دسته‌بندی</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <FiChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            
                            {selectedCategory && (
                                <div className="space-y-2">
                                    <label className="block text-[#334155] font-medium">زیرمجموعه <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            value={newProduct.subcategory}
                                            onChange={handleSubcategoryChange}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all appearance-none bg-white pr-3"
                                        >
                                            <option value="">انتخاب زیرمجموعه</option>
                                            {selectedCategory.subcategories.map((subcategory) => (
                                                <option key={subcategory.id} value={subcategory.name}>
                                                    {subcategory.name}
                                                </option>
                                            ))}
                                        </select>
                                        <FiChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <label className="block text-[#334155] font-medium">قیمت (تومان) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="قیمت"
                                        value={newProduct.price || ""}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all pl-10"
                                    />
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">تومان</span>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-[#334155] font-medium">موجودی <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="موجودی"
                                    value={newProduct.stock || ""}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: +e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <button
                                onClick={editProductId ? handleSaveEdit : handleAddProduct}
                                disabled={!newProduct.name || !newProduct.category || !newProduct.subcategory || newProduct.price <= 0 || newProduct.stock < 0}
                                className={`px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg flex-1 md:flex-none flex items-center justify-center ${
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
                                        <FiEdit2 className="ml-2" />
                                        ذخیره تغییرات
                                    </>
                                ) : (
                                    <>
                                        <FiPlus className="ml-2" />
                                        افزودن محصول
                                    </>
                                )}
                            </button>
                            
                            {editProductId && (
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-8 py-3 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:from-[#dc2626] hover:to-[#b91c1c] flex-1 md:flex-none flex items-center justify-center"
                                >
                                    <FiX className="ml-2" />
                                    انصراف از ویرایش
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="w-full md:w-auto">
                            <h2 className="text-xl font-semibold text-[#1e293b] mb-2 md:mb-0 flex items-center">
                                <FiSearch className="ml-2 text-[#3b82f6]" />
                                جستجوی محصولات
                            </h2>
                        </div>
                        
                        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="جستجوی محصولات..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                                />
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FiFilter className="text-[#3b82f6]" />
                                    <span>فیلترها</span>
                                </button>
                                
                                {showFilters && (
                                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10 p-4">
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت موجودی</label>
                                                <select 
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                                                    value={activeTab}
                                                    onChange={(e) => setActiveTab(e.target.value as "all" | "inStock" | "outOfStock")}
                                                >
                                                    <option value="all">همه محصولات</option>
                                                    <option value="inStock">فقط موجود</option>
                                                    <option value="outOfStock">فقط ناموجود</option>
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
                                                <select 
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3b82f6] focus:border-[#3b82f6]"
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
                    
                    <div className="flex border-b border-gray-200 mt-6">
                        <button
                            className={`py-2 px-4 font-medium text-sm flex items-center border-b-2 transition-colors ${
                                activeTab === "all" 
                                    ? "border-[#3b82f6] text-[#3b82f6]" 
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("all")}
                        >
                            همه محصولات
                            <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs font-medium mr-2">
                                {products.length}
                            </span>
                        </button>
                        
                        <button
                            className={`py-2 px-4 font-medium text-sm flex items-center border-b-2 transition-colors ${
                                activeTab === "inStock" 
                                    ? "border-[#10b981] text-[#10b981]" 
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("inStock")}
                        >
                            موجود در انبار
                            <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs font-medium mr-2">
                                {products.filter(p => p.stock > 0).length}
                            </span>
                        </button>
                        
                        <button
                            className={`py-2 px-4 font-medium text-sm flex items-center border-b-2 transition-colors ${
                                activeTab === "outOfStock" 
                                    ? "border-[#ef4444] text-[#ef4444]" 
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("outOfStock")}
                        >
                            ناموجود
                            <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs font-medium mr-2">
                                {products.filter(p => p.stock === 0).length}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] p-4 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <h2 className="text-xl font-semibold flex items-center">
                                لیست محصولات
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium mr-3">
                                    {filteredProducts.length} محصول
                                </span>
                            </h2>
                            
                            <div className="mt-2 md:mt-0 flex items-center gap-2">
                                <button 
                                    onClick={handleExportExcel}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
                                >
                                    <FiDownload size={14} />
                                    خروجی Excel
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام محصول</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دسته بندی</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">زیر مجموعه</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">قیمت (تومان)</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">موجودی</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-[#1e293b]">{product.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475569]">
                                                    {product.subcategory}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1e293b]">
                                                    {product.price.toLocaleString('fa-IR')} تومان
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <ProductStatusBadge stock={product.stock} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475569]">
                                                    <div className="flex items-center space-x-2 space-x-reverse">
                                                        <button
                                                            onClick={() => {
                                                                handleEditProduct(product.id);
                                                                handleScrollToTop();
                                                            }}
                                                            className="text-[#3b82f6] hover:text-[#1d4ed8] transition-colors p-2 rounded-full hover:bg-blue-50"
                                                            title="ویرایش"
                                                        >
                                                            <FiEdit2 size={18} />
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => {
                                                                setShowDeleteModal(true);
                                                                setProductToDelete(product.id);
                                                            }}
                                                            className="text-[#ef4444] hover:text-[#dc2626] transition-colors p-2 rounded-full hover:bg-red-50"
                                                            title="حذف"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {filteredProducts.length === 0 && !loading && (
                                    <div className="text-center py-12">
                                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <BsExclamationCircle size={32} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-[#334155]">محصولی یافت نشد</h3>
                                        <p className="text-[#64748b] mt-1">
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md">
                        <div className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] p-4 text-white">
                            <h3 className="text-lg font-semibold flex items-center">
                                <FiTrash2 className="ml-2" />
                                حذف محصول
                            </h3>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-[#475569] mb-6">آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟ این عمل برگشت‌پذیر نیست.</p>
                            
                            <div className="flex justify-end space-x-3 space-x-reverse">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-[#334155] hover:bg-gray-50 transition-colors"
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={() => {
                                        if (productToDelete) {
                                            handleDeleteProduct(productToDelete);
                                        }
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg hover:shadow-md transition-all"
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