import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiTrash2, 
  FiPlus, 
  FiMinus, 
  FiChevronLeft, 
  FiCheckCircle, 
  FiTruck, 
  FiGift, 
  FiTag, 
  FiX
} from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { checkoutOrder } from '../api/orders';
import { toast } from 'react-toastify';
import { applyDiscount } from '../api/discounts';
import IMG from '../assets/img.jpg';
interface CartItem {
  id: number;
  productId: number;
  sellerId: number;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  deliveryTime?: string;
  product_stock: number;
  storeName: string;
}

interface StoreGroup {
  storeId: number;
  storeName: string;
  items: CartItem[];
}

const ShoppingCart: React.FC = () => {
  const {
    cart,
    loading,
    updateCartItem: updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();
  
  const userId = localStorage.getItem("user-id");
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [discountCodes, setDiscountCodes] = useState<Record<number, string>>({});
  const [discounts, setDiscounts] = useState<Record<number, {percentage: number, isValid: boolean}>>({});
  const [storeTotals, setStoreTotals] = useState<Record<number, number>>({});
  const [checkoutErrors, setCheckoutErrors] = useState<Record<number, string>>({});
  const [stockErrors, setStockErrors] = useState<Record<number, boolean>>({});

  const [storeGroups, totalItems, totalPrice] = React.useMemo(() => {
    if (!cart?.items) return [[], 0, 0];

    const groupsMap: Record<number, StoreGroup> = {};
    const newStockErrors: Record<number, boolean> = {};
    
    cart.items.forEach(item => {
      if (!groupsMap[item.seller_id]) {
        groupsMap[item.seller_id] = {
          storeId: item.seller_id,
          storeName: item.store_name,
          items: []
        };
      }

      
      const hasStockError = item.quantity > (item.product_stock || 100);
      newStockErrors[item.id] = hasStockError;
      
      groupsMap[item.seller_id].items.push({
        id: item.id,
        productId: item.product_id,
        sellerId: item.seller_id,
        name: item.product_name,
        price: item.product_price,
        quantity: item.quantity,
        image: item.product_image,
        stock: item.product_stock || 100,
        storeName: item.store_name,
        deliveryTime: "۲ تا ۳ روز کاری"
      });
    });
    
    setStockErrors(newStockErrors);
    return [Object.values(groupsMap), cart.total_items, cart.total_price];
  }, [cart]);

  const hasStockIssues = Object.values(stockErrors).some(error => error);

  useEffect(() => {
    const newStoreTotals: Record<number, number> = {};
    
    storeGroups.forEach(group => {
      const storeTotal = group.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const discount = discounts[group.storeId]?.isValid ? discounts[group.storeId].percentage : 0;
      newStoreTotals[group.storeId] = storeTotal * (1 - discount / 100);
    });
    
    setStoreTotals(newStoreTotals);
  }, [storeGroups, discounts]);

  const handleIncreaseQuantity = (item: CartItem) => {
    if (item.quantity >= item.product_stock) {
      toast.error(`موجودی کالای ${item.name} فقط ${item.product_stock} عدد است`, {
        position: "top-center",
        rtl: true,
      });
      return;
    }
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity <= 1) return;
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleApplyDiscount = async (storeId: number) => {
    const code = discountCodes[storeId]?.trim();

    if (!code) {
      toast.error("لطفاً کد تخفیف را وارد کنید", {
        position: "top-center",
        rtl: true,
      });
      return;
    }

    try {
      const storeGroup = storeGroups.find(g => g.storeId === storeId);
      if (!storeGroup) throw new Error("فروشگاه مورد نظر یافت نشد");

      const storeTotal = storeGroup.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const discount = await applyDiscount(code, storeId, storeTotal);

      setDiscounts(prev => ({
        ...prev,
        [storeId]: {percentage: discount.percentage, isValid: true},
      }));

      toast.success(`تخفیف ${discount.percentage}% برای فروشگاه ${storeGroup.storeName} اعمال شد`, {
        position: "top-center",
        autoClose: 5000,
        rtl: true,
      });

      setCheckoutErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[storeId];
        return newErrors;
      });

    } catch (error: any) {
      console.error('خطا در اعمال کد تخفیف:', error);

      setDiscounts(prev => {
        const newDiscounts = {...prev};
        delete newDiscounts[storeId];
        return newDiscounts;
      });

      setDiscountCodes(prev => {
        const newCodes = {...prev};
        delete newCodes[storeId];
        return newCodes;
      });

      let errorMessage = "خطا در اعمال کد تخفیف";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        rtl: true,
      });

      setCheckoutErrors(prev => ({
        ...prev,
        [storeId]: errorMessage
      }));
    }
  };

  const handleRemoveDiscount = (storeId: number) => {
    setDiscounts(prev => {
      const newDiscounts = {...prev};
      delete newDiscounts[storeId];
      return newDiscounts;
    });
    
    setDiscountCodes(prev => {
      const newCodes = {...prev};
      delete newCodes[storeId];
      return newCodes;
    });
    
    setCheckoutErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[storeId];
      return newErrors;
    });
  };

  const handleStoreCheckout = async (storeId: number, storeItems: CartItem[]) => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const storeGroup = storeGroups.find(g => g.storeId === storeId);
    if (!storeGroup) return;

    const outOfStockItems = storeItems.filter(item => item.quantity > item.product_stock);
    if (outOfStockItems.length > 0) {
      toast.error(`بعضی از محصولات فروشگاه ${storeGroup.storeName} موجودی کافی ندارند`, {
        position: "top-center",
        rtl: true,
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      const discountCode = discounts[storeId]?.isValid ? discountCodes[storeId] : null;

      const order = await checkoutOrder(
        storeItems.map(item => ({
          product_id: item.productId,
          seller_id: item.sellerId,
          quantity: item.quantity,
          discount_code: discountCode
        }))
      );
    
      storeItems.forEach(item => removeFromCart(item.id));
      handleRemoveDiscount(storeId);
    
      toast.success(`سفارش #${order.id} از فروشگاه ${storeGroup.storeName} با موفقیت ثبت شد!`, {
        position: "top-center",
        autoClose: 5000,
        rtl: true,
      });
    
      return order;

    } catch (error: any) {
      console.error('خطا در ثبت سفارش:', error);

      let errorMessage = "خطا در ثبت سفارش";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(`خطا در پرداخت فروشگاه ${storeGroup.storeName}: ${errorMessage}`, {
        position: "top-center",
        rtl: true,
      });

      throw error;
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckoutAll = async () => {
    if (!userId) {
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    const results = [];
    let hasError = false;

    try {
      for (const group of storeGroups) {
        try {
          const result = await handleStoreCheckout(group.storeId, group.items);
          results.push(result);
        } catch (error) {
          hasError = true;
        }
      }

      if (!hasError && results.length > 0) {
        toast.success(`تمام سفارش‌های شما با موفقیت ثبت شد!`, {
          position: "top-center",
          autoClose: 5000,
          rtl: true,
        });
      }

    } finally {
      setIsCheckingOut(false);
    }
  };

  const calculateDeliveryEstimate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toLocaleDateString('fa-IR');
  };

  const calculateTotalDiscount = () => {
    return totalPrice - Object.values(storeTotals).reduce((sum, total) => sum + total, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9]"
      style={{ direction: 'rtl' }}
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#3b82f6] hover:text-blue-700 transition-colors"
          >
            <FiChevronLeft className="ml-1" size={20} />
            <span className="font-medium">بازگشت</span>
          </button>
          <div className="flex items-center mr-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">سبد خرید شما</h1>
            {totalItems > 0 && (
              <span className="bg-[#3b82f6] text-white text-sm px-3 py-1 rounded-full mr-3">
                {totalItems.toLocaleString('fa-IR')} کالا
              </span>
            )}
          </div>
        </div>

        {storeGroups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-2xl mx-auto"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingCart className="w-12 h-12 text-[#3b82f6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1e293b] mb-3">
                سبد خرید شما خالی است
              </h2>
              <p className="text-gray-600 mb-6">
                می‌توانید از فروشگاه ما محصولات مورد نظر خود را انتخاب کنید
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af] text-white px-8 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                بازگشت به فروشگاه
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {storeGroups.map(group => {
                const storeTotal = group.items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );
                const discount = discounts[group.storeId]?.isValid ? discounts[group.storeId].percentage : 0;
                const finalTotal = storeTotal * (1 - discount / 100);
                const storeError = checkoutErrors[group.storeId];
                const hasStoreStockIssue = group.items.some(item => item.quantity > item.product_stock);

                return (
                  <motion.div
                    key={group.storeId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  >
                    <div className="p-5 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white">
                      <h2 className="font-bold text-lg flex items-center">
                        <FiCheckCircle className="ml-2" />
                        فروشگاه: {group.storeName}
                      </h2>
                    </div>

                    {storeError && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="flex items-center text-red-700">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">{storeError}</span>
                        </div>
                      </div>
                    )}

                    {hasStoreStockIssue && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                        <div className="flex items-center text-yellow-700">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">بعضی از محصولات این فروشگاه موجودی کافی ندارند</span>
                        </div>
                      </div>
                    )}

                    <div className="p-5 border-b border-gray-100">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 shadow-inner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-gray-700 flex items-center">
                            <FiTag className="ml-1 text-blue-600" />
                            کد تخفیف {group.storeName}
                          </h3>
                          {discounts[group.storeId]?.isValid && (
                            <button
                              onClick={() => handleRemoveDiscount(group.storeId)}
                              className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded-full flex items-center transition-colors"
                            >
                              <FiX size={12} className="ml-1" />
                              حذف تخفیف
                            </button>
                          )}
                        </div>

                        {discounts[group.storeId]?.isValid ? (
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white rounded-lg p-3 shadow-sm border border-green-100"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-green-600">
                                <span className="font-medium">{discount}% تخفیف اعمال شد</span>
                              </div>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {discountCodes[group.storeId]}
                              </span>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={discountCodes[group.storeId] || ''}
                              onChange={(e) => setDiscountCodes(prev => ({
                                ...prev,
                                [group.storeId]: e.target.value,
                              }))}
                              className="flex-1 rounded-r-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-transparent text-sm"
                              placeholder="کد تخفیف را وارد کنید"
                            />
                            <button
                              onClick={() => handleApplyDiscount(group.storeId)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-l-lg transition-colors text-sm whitespace-nowrap"
                            >
                              اعمال کد
                            </button>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {group.items.map(item => (
                        <motion.div
                          key={`${item.productId}-${item.sellerId}`}
                          layout
                          className="p-5 flex items-start sm:items-center"
                        >
                          <div className="relative">
                            <img
                              src={item.image || IMG}
                              alt={item.name}
                              className="w-24 h-24 object-contain rounded-xl border border-gray-200 ml-4"
                            />
                            {item.quantity > 1 && (
                              <span className="absolute -top-2 -right-2 bg-[#3b82f6] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <FiTruck className="ml-1" size={14} />
                              <span>تحویل تا {item.deliveryTime || "۲ تا ۳ روز کاری"}</span>
                            </div>
                            {item.quantity > item.product_stock && (
                              <div className="text-xs text-red-500 mt-1 flex items-center">
                                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                تعداد انتخابی بیشتر از موجودی است (موجودی: {item.product_stock})
                              </div>
                            )}
                            <div className="mt-3 text-lg font-bold text-[#1e293b]">
                              {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                              <button
                                onClick={() => handleDecreaseQuantity(item)}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-1 bg-white w-10 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleIncreaseQuantity(item)}
                                className={`px-3 py-2 ${
                                  item.quantity >= item.stock
                                    ? 'bg-gray-200 cursor-not-allowed'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                } transition-colors`}
                                disabled={item.quantity >= item.stock}
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-500 hover:text-red-700 mr-2 transition-colors"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="p-5 bg-blue-50 flex justify-between items-center border-t border-gray-200">
                      <div className="flex items-center">
                        <FiGift className="text-[#3b82f6] ml-2" />
                        <span className="text-gray-700 font-medium">جمع این فروشگاه:</span>
                      </div>
                      <div className="flex flex-col items-end">
                        {discounts[group.storeId]?.isValid ? (
                          <>
                            <div className="text-sm text-gray-500 line-through">
                              {storeTotal.toLocaleString('fa-IR')} تومان
                            </div>
                            <div className="text-xl font-bold text-[#1e40af]">
                              {finalTotal.toLocaleString('fa-IR')} تومان
                            </div>
                          </>
                        ) : (
                          <div className="text-xl font-bold text-[#1e40af]">
                            {storeTotal.toLocaleString('fa-IR')} تومان
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-5 border-t border-gray-200">
                      <button
                        onClick={() => handleStoreCheckout(group.storeId, group.items)}
                        disabled={isCheckingOut || loading || hasStoreStockIssue}
                        className={`w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold py-3 px-4 rounded-xl transition-all ${
                          (isCheckingOut || loading || hasStoreStockIssue) ? 'opacity-80 cursor-not-allowed' : 'shadow-md hover:shadow-lg'
                        }`}
                      >
                        {(isCheckingOut || loading) ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            در حال پردازش...
                          </span>
                        ) : (
                          'تسویه حساب این فروشگاه'
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-4">خلاصه سفارش</h2>
              
              <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
                <div className="flex items-center text-blue-800 mb-2">
                  <FiTruck className="ml-2" />
                  <span>تخمین زمان تحویل</span>
                </div>
                <p className="text-sm text-gray-700">
                  سفارش شما تا روز <span className="font-bold">{calculateDeliveryEstimate()}</span> تحویل داده می‌شود
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">تعداد کالاها:</span>
                  <span className="font-medium">{totalItems.toLocaleString('fa-IR')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">جمع کل:</span>
                  <span className="font-medium">{totalPrice.toLocaleString('fa-IR')} تومان</span>
                </div>
                {calculateTotalDiscount() > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>تخفیف:</span>
                    <span className="font-medium">
                      {calculateTotalDiscount().toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-gray-800 font-bold">مبلغ قابل پرداخت:</span>
                  <span className="text-xl font-bold text-[#1e40af]">
                    {Object.values(storeTotals).reduce((sum, total) => sum + total, 0).toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              <button 
                className="w-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] hover:from-[#f97316] hover:to-[#ea580c] text-white py-3 px-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                onClick={handleCheckoutAll}
                disabled={isCheckingOut || loading || hasStockIssues}
              >
                {(isCheckingOut || loading) ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    در حال پردازش...
                  </span>
                ) : hasStockIssues ? (
                  'موجودی برخی کالاها ناکافی است'
                ) : (
                  'پرداخت همه سفارش‌ها'
                )}
              </button>

              <button 
                onClick={clearCart}
                disabled={isCheckingOut || loading}
                className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-all"
              >
                خالی کردن سبد خرید
              </button>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-[#334155] mb-3">مزایای خرید از ما</h3>
                <ul className="space-y-2 text-sm text-[#475569]">
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">•</span>
                    <span>ضمانت بازگشت کالا تا ۷ روز</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">•</span>
                    <span>پشتیبانی ۲۴ ساعته</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">•</span>
                    <span>ارسال سریع و به موقع</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3b82f6] mr-2">•</span>
                    <span>پرداخت در محل برای تهران</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ShoppingCart;