import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiShoppingBag, FiClock, FiStar, FiMessageSquare } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../../components/LoadingSpinner";

interface Comment {
    id: number;
    product_name: string;
    product_id: number;
    text: string;
    created_at: string;
    rating?: number;
    is_verified?: boolean;
}

const ReviewsPage: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingComment, setEditingComment] = useState<number | null>(null);
    const [editedText, setEditedText] = useState("");

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = () => {
        const token = localStorage.getItem("access_token");
        setLoading(true);

        fetch("http://localhost:8000/api/products/user/comments/", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("خطا در دریافت نظرات");
                }
                return res.json();
            })
            .then((data) => {
                setComments(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("خطا در دریافت نظرات");
                setLoading(false);
            });
    };

    const handleDeleteComment = (id: number) => {
        const token = localStorage.getItem("access_token");
        
        if (window.confirm("آیا از حذف این نظر مطمئن هستید؟")) {
            fetch(`http://localhost:8000/api/products/comments/${id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("خطا در حذف نظر");
                    }
                    toast.success("نظر با موفقیت حذف شد");
                    fetchComments();
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("خطا در حذف نظر");
                });
        }
    };

    const handleEditComment = (id: number, currentText: string) => {
        setEditingComment(id);
        setEditedText(currentText);
    };

    const handleSaveEdit = (id: number) => {
        const token = localStorage.getItem("access_token");
        
        fetch(`http://localhost:8000/api/products/comments/${id}/`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: editedText }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("خطا در ویرایش نظر");
                }
                toast.success("نظر با موفقیت ویرایش شد");
                setEditingComment(null);
                fetchComments();
            })
            .catch((err) => {
                console.error(err);
                toast.error("خطا در ویرایش نظر");
            });
    };

    const renderStars = (rating: number = 4) => {
        return [...Array(5)].map((_, i) => (
            <FiStar
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
        ));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen p-4 md:p-8"
            style={{ direction: "rtl" }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] flex items-center justify-center">
                        <FiMessageSquare className="ml-2 text-[#3b82f6]" size={32} />
                        نظرات ثبت‌شده شما
                    </h1>
                    <p className="text-[#64748b] mt-3 max-w-2xl mx-auto">
                        در این صفحه می‌توانید تمام نظراتی که برای محصولات مختلف ثبت کرده‌اید را مشاهده و مدیریت کنید.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence>
                            {comments.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white rounded-2xl shadow-sm p-8 text-center border-l-4 border-[#3b82f6]"
                                >
                                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 mb-6">
                                        <FiShoppingBag className="h-12 w-12 text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">هنوز نظری ثبت نکرده‌اید</h3>
                                    <p className="text-gray-500 mb-6">
                                        پس از ثبت نظر برای محصولات مختلف، نظرات شما در این صفحه نمایش داده خواهد شد.
                                    </p>
                                    <a
                                        href="/shop"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        مشاهده محصولات
                                    </a>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="comments"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {comments.map((comment) => (
                                        <motion.div
                                            key={comment.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white overflow-hidden shadow-sm rounded-2xl border-l-4 border-[#3b82f6] hover:shadow-md transition-shadow duration-300"
                                        >
                                            <div className="px-6 py-5">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center mb-2">
                                                            <h3 className="text-lg font-semibold text-[#1e40af] truncate">
                                                                <a
                                                                    href={`/product/${comment.product_id}`}
                                                                    className="hover:text-blue-700 hover:underline"
                                                                >
                                                                    {comment.product_name}
                                                                </a>
                                                            </h3>
                                                            {comment.is_verified && (
                                                                <span className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    تایید شده
                                                                </span>
                                                            )}
                                                        </div>

                                                        {editingComment === comment.id ? (
                                                            <div className="mt-4">
                                                                <textarea
                                                                    rows={3}
                                                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                                    value={editedText}
                                                                    onChange={(e) => setEditedText(e.target.value)}
                                                                />
                                                                <div className="mt-2 flex space-x-3">
                                                                    <button
                                                                        onClick={() => handleSaveEdit(comment.id)}
                                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                                    >
                                                                        ذخیره تغییرات
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingComment(null)}
                                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                    >
                                                                        انصراف
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="flex items-center mb-3">
                                                                    <div className="flex items-center space-x-1">
                                                                        {renderStars(comment.rating)}
                                                                    </div>
                                                                    <span className="text-sm text-gray-500 mr-2">
                                                                        امتیاز شما
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-700 mb-4 text-justify">{comment.text}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <FiClock className="ml-1" />
                                                        <span>
                                                            {new Date(comment.created_at).toLocaleDateString("fa-IR", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </span>
                                                    </div>

                                                    <div className="flex space-x-3">
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                                            title="حذف نظر"
                                                        >
                                                            <FiTrash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-6">
                        <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-4">
                            <FiStar className="ml-2 text-[#f59e0b]" size={20} />
                            نکات مهم
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start p-3 rounded-lg bg-green-50 border border-green-100">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        <FiStar size={16} />
                                    </div>
                                </div>
                                <div className="mr-3">
                                    <h4 className="font-medium text-[#166534]">امتیاز دهید</h4>
                                    <p className="text-sm text-[#475569]">
                                        با دادن امتیاز به محصولات، به سایر کاربران در انتخاب بهتر کمک کنید.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start p-3 rounded-lg bg-purple-50 border border-purple-100">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                        <FiShoppingBag size={16} />
                                    </div>
                                </div>
                                <div className="mr-3">
                                    <h4 className="font-medium text-[#6b21a8]">مزایای نظر دادن</h4>
                                    <p className="text-sm text-[#475569]">
                                        برای هر نظر تایید شده 50 امتیاز در برنامه وفاداری دریافت می‌کنید.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <h3 className="font-medium text-[#334155] mb-3">راهنمای امتیازدهی</h3>
                            <ul className="space-y-2 text-sm text-[#475569]">
                                <li className="flex items-start">
                                    <span className="text-[#3b82f6] mr-2">•</span>
                                    <span>5 ستاره: کیفیت عالی و کاملاً راضی‌کننده</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#3b82f6] mr-2">•</span>
                                    <span>4 ستاره: کیفیت خوب با کمی نقص جزئی</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#3b82f6] mr-2">•</span>
                                    <span>3 ستاره: کیفیت متوسط و قابل قبول</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#3b82f6] mr-2">•</span>
                                    <span>2 ستاره: کیفیت پایین و نارضایتی نسبی</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#3b82f6] mr-2">•</span>
                                    <span>1 ستاره: کیفیت بسیار پایین و کاملاً ناراضی</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewsPage;