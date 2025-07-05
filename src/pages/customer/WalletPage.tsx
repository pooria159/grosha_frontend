import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiCopy, FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiCreditCard, FiDollarSign, FiRefreshCw } from "react-icons/fi";
import { FaRegCreditCard } from "react-icons/fa";

interface BankCard {
    id: number;
    card_name: string;
    card_number: string;
    is_default?: boolean;
}

const WalletPage: React.FC = () => {
    const [bankCards, setBankCards] = useState<BankCard[]>([]);
    const [newCard, setNewCard] = useState({
        card_name: "",
        card_number: ""
    });
    const [editingCard, setEditingCard] = useState<BankCard | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(1250000);
    const [cardNumberError, setCardNumberError] = useState<string | null>(null);
    const [copiedCardId, setCopiedCardId] = useState<number | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchBankCards();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access_token");
        return {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };
    };

    const fetchBankCards = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                "http://localhost:8000/api/users/bank-cards/",
                getAuthHeaders()
            );

            let cards: BankCard[] = [];
            if (Array.isArray(response.data)) {
                cards = response.data;
            } else if (response.data?.results) {
                cards = response.data.results;
            } else if (response.data?.data) {
                cards = response.data.data;
            }

            setBankCards(cards);
        } catch (error) {
            console.error("Error fetching bank cards:", error);
            setError("خطا در دریافت اطلاعات کارت‌های بانکی");

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                toast.error("لطفاً مجدداً وارد شوید");
            }
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const validateCardNumber = (number: string): boolean => {
        return number.length === 16 && /^\d+$/.test(number);
    };

    const handleAddCard = async () => {
        if (!newCard.card_name || !newCard.card_number) {
            toast.error("لطفاً نام و شماره کارت را وارد کنید");
            return;
        }

        if (!validateCardNumber(newCard.card_number)) {
            setCardNumberError("شماره کارت باید ۱۶ رقم باشد");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8000/api/users/bank-cards/",
                newCard,
                getAuthHeaders()
            );
            setNewCard({ card_name: "", card_number: "" });
            setCardNumberError(null);
            setIsAdding(false);
            fetchBankCards();
            toast.success("کارت بانکی با موفقیت افزوده شد");
        } catch (error) {
            console.error("Error adding card:", error);
            toast.error("خطا در افزودن کارت بانکی");

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                toast.error("دسترسی غیرمجاز. لطفاً وارد شوید");
            }
        }
    };

    const handleUpdateCard = async () => {
        if (!editingCard) return;

        if (!editingCard.card_name || !editingCard.card_number) {
            toast.error("لطفاً نام و شماره کارت را وارد کنید");
            return;
        }

        if (!validateCardNumber(editingCard.card_number)) {
            setCardNumberError("شماره کارت باید ۱۶ رقم باشد");
            return;
        }

        try {
            await axios.put(
                `http://localhost:8000/api/users/bank-cards/${editingCard.id}/`,
                editingCard,
                getAuthHeaders()
            );
            setEditingCard(null);
            setCardNumberError(null);
            fetchBankCards();
            toast.success("کارت بانکی با موفقیت ویرایش شد");
        } catch (error) {
            console.error("Error updating card:", error);
            toast.error("خطا در ویرایش کارت بانکی");

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                toast.error("دسترسی غیرمجاز. لطفاً وارد شوید");
            }
        }
    };

    const handleDeleteCard = async (id: number) => {
        try {
            await axios.delete(
                `http://localhost:8000/api/users/bank-cards/${id}/`,
                getAuthHeaders()
            );
            fetchBankCards();
            toast.success("کارت بانکی با موفقیت حذف شد");
        } catch (error) {
            console.error("Error deleting card:", error);
            toast.error("خطا در حذف کارت بانکی");

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                toast.error("دسترسی غیرمجاز. لطفاً وارد شوید");
            }
        }
    };

    const formatCardNumber = (cardNumber: string): string => {
        const cleaned = cardNumber.replace(/\D/g, "");
        const groups = [];
        for (let i = cleaned.length; i > 0; i -= 4) {
            groups.push(cleaned.slice(Math.max(0, i - 4), i));
        }
        return groups.reverse().join(' ');
    };

    const copyToClipboard = (text: string, cardId: number) => {
        navigator.clipboard.writeText(text.replace(/\s/g, ""));
        setCopiedCardId(cardId);
        toast.success("شماره کارت کپی شد");
        setTimeout(() => setCopiedCardId(null), 2000);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fa-IR').format(amount) + " تومان";
    };

    const handleChargeWallet = () => {
        toast.info("این قابلیت به زودی اضافه خواهد شد");
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchBankCards();
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) return;

        if (isEditing && editingCard) {
            setEditingCard({...editingCard, card_number: value});
        } else {
            setNewCard({...newCard, card_number: value});
        }

        if (value.length !== 16) {
            setCardNumberError("شماره کارت باید ۱۶ رقم باشد");
        } else {
            setCardNumberError(null);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4 md:p-8" style={{ direction: 'rtl' }}>
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] flex items-center justify-center">
                        <FiCreditCard className="ml-2 text-[#3b82f6]" size={32} />
                        مدیریت کیف پول و کارت‌ها
                    </h1>
                    <p className="text-[#64748b] mt-3 max-w-2xl mx-auto">
                        موجودی کیف پول و کارت‌های بانکی خود را مدیریت کنید
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-white"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">موجودی کیف پول</h2>
                                    <p className="text-3xl font-bold mb-6">{formatCurrency(walletBalance)}</p>
                                </div>
                                <button 
                                    onClick={handleRefresh}
                                    className={`p-2 rounded-full ${isRefreshing ? 'animate-spin' : 'hover:bg-white/10'}`}
                                    disabled={isRefreshing}
                                >
                                    <FiRefreshCw size={20} />
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/30 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                                >
                                    <FaRegCreditCard size={18} />
                                    افزودن کارت جدید
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <FaRegCreditCard className="ml-2 text-[#3b82f6]" size={20} />
                                    کارت‌های بانکی من
                                </h2>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">
                                        {bankCards.length} کارت ثبت شده
                                    </span>
                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md"
                                    >
                                        <FiPlus size={16} />
                                        افزودن کارت
                                    </button>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="p-8 flex justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : bankCards.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50">
                                <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <FaRegCreditCard size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500">هیچ کارتی ثبت نشده است</p>
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    افزودن اولین کارت بانکی
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {bankCards.map((card) => (
                                    <div key={card.id} className="p-6 hover:bg-gray-50 transition-colors duration-200 group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                    <FaRegCreditCard size={20} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{card.card_name}</h3>
                                                    <div className="flex items-center mt-1">
                                                        <p className="font-mono tracking-wider text-gray-600" style={{direction: 'ltr'}}>
                                                            {formatCardNumber(card.card_number)}
                                                        </p>
                                                        <button
                                                            onClick={() => copyToClipboard(card.card_number, card.id)}
                                                            className="mr-2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                                                            title="کپی شماره کارت"
                                                        >
                                                            {copiedCardId === card.id ? (
                                                                <FiCheck size={16} className="text-green-500" />
                                                            ) : (
                                                                <FiCopy size={16} className="text-gray-500" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {card.is_default && (
                                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                                                        پیش‌فرض
                                                    </span>
                                                )}
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => setEditingCard(card)}
                                                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors duration-200"
                                                        title="ویرایش"
                                                    >
                                                        <FiEdit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCard(card.id)}
                                                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors duration-200"
                                                        title="حذف"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {isAdding && (
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                        <FiPlus className="ml-2 text-blue-600" size={20} />
                                        افزودن کارت جدید
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setIsAdding(false);
                                            setCardNumberError(null);
                                        }}
                                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">نام دارنده کارت</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            value={newCard.card_name}
                                            onChange={(e) => setNewCard({...newCard, card_name: e.target.value})}
                                            placeholder="نام کامل به فارسی"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">شماره کارت</label>
                                        <input
                                            type="text"
                                            className={`w-full p-3 border ${cardNumberError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                            value={formatCardNumber(newCard.card_number)}
                                            onChange={(e) => handleCardNumberChange(e)}
                                            maxLength={19}
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            style={{direction: 'ltr'}}
                                        />
                                        {cardNumberError && (
                                            <p className="text-red-500 text-sm mt-2">{cardNumberError}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                                    <button
                                        onClick={handleAddCard}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                                    >
                                        <FiCheck size={18} />
                                        ذخیره کارت
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsAdding(false);
                                            setCardNumberError(null);
                                        }}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                                    >
                                        <FiX size={18} />
                                        انصراف
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {editingCard && (
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                        <FiEdit2 className="ml-2 text-blue-600" size={20} />
                                        ویرایش کارت بانکی
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setEditingCard(null);
                                            setCardNumberError(null);
                                        }}
                                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">نام دارنده کارت</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            value={editingCard.card_name}
                                            onChange={(e) => setEditingCard({...editingCard, card_name: e.target.value})}
                                            placeholder="نام کامل به فارسی"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium">شماره کارت</label>
                                        <input
                                            type="text"
                                            className={`w-full p-3 border ${cardNumberError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                            value={formatCardNumber(editingCard.card_number)}
                                            onChange={(e) => handleCardNumberChange(e, true)}
                                            maxLength={19}
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            style={{direction: 'ltr'}}
                                        />
                                        {cardNumberError && (
                                            <p className="text-red-500 text-sm mt-2">{cardNumberError}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                                    <button
                                        onClick={handleUpdateCard}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                                    >
                                        <FiCheck size={18} />
                                        ذخیره تغییرات
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingCard(null);
                                            setCardNumberError(null);
                                        }}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                                    >
                                        <FiX size={18} />
                                        انصراف
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletPage;