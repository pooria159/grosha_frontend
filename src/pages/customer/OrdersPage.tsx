import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../api/orders";
import { 
  FiEye, 
  FiChevronUp, 
  FiPackage, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiTruck, 
  FiShoppingBag, 
  FiCalendar,
  FiPercent,
  FiDollarSign,
  FiTag
} from "react-icons/fi";
import IMG from "../../assets/img.jpg";

interface Product {
  id: number;
  name: string;
  image?: string;
  price: number;
  category?: string;
}

interface Seller {
  id: number;
  shop_name: string;
  logo?: string;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  seller: Seller;
}

interface Discount {
  id: number;
  percentage: number;
  code: string;
}

interface Order {
  id: number;
  status: "pending" | "approved" | "cancelled" | "completed";
  items: OrderItem[];
  total_price: number;
  original_price: number;
  created_at: string;
  discount?: Discount;
  discount_percentage?: number;
  discount_code?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const userId = localStorage.getItem("user-id");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        const userOrders = data.filter((order: Order) => 
          order.user && order.user.id.toString() === userId
        );
        setOrders(userOrders);
      } catch (error) {
        console.error("خطا در دریافت سفارشات", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusChange = async (orderId: number, newStatus: "pending" | "approved" | "cancelled" | "completed") => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("خطا در تغییر وضعیت سفارش", error);
    }
  };

  const getStatusDetails = (status: string) => {
    switch(status) {
      case "approved":
        return { 
          text: "تایید شده", 
          color: "bg-green-100 text-green-800",
          iconColor: "text-green-500",
          icon: <FiCheckCircle className="ml-1" /> 
        };
      case "cancelled":
        return { 
          text: "لغو شده", 
          color: "bg-red-100 text-red-800",
          iconColor: "text-red-500",
          icon: <FiXCircle className="ml-1" /> 
        };
      case "completed":
        return { 
          text: "تکمیل شده", 
          color: "bg-blue-100 text-blue-800",
          iconColor: "text-blue-500",
          icon: <FiCheckCircle className="ml-1" /> 
        };
      default:
        return { 
          text: "در حال بررسی", 
          color: "bg-yellow-100 text-yellow-800",
          iconColor: "text-yellow-500",
          icon: <FiClock className="ml-1" /> 
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen p-4 md:p-8" style={{ direction: "rtl" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] flex items-center justify-center">
            <FiShoppingBag className="ml-2 text-[#00509D]" size={32} />
            تاریخچه سفارشات
          </h1>
          <p className="text-[#64748b] mt-3 max-w-2xl mx-auto">
            مشاهده و مدیریت تمام سفارش‌های انجام شده
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00509D]"></div>
            <p className="mt-4 text-gray-600 text-lg">در حال بارگذاری سفارشات...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <FiPackage className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">هیچ سفارشی ثبت نشده است</h3>
            <p className="text-gray-500 mt-2">هنوز سفارشی برای نمایش وجود ندارد</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const status = getStatusDetails(order.status);
              const hasDiscount = order.discount_percentage && order.discount_percentage > 0;
              const discountAmount = hasDiscount ? order.original_price - order.total_price : 0;
              
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md">
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${status.color} bg-opacity-30`}>
                          {status.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            سفارش {order.id}
                            <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                              {status.text}
                            </span>
                          </h3>
                          <p className="text-gray-500 text-sm mt-1 flex items-center">
                            <FiCalendar className="ml-1" />
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-center min-w-[120px]">
                          <p className="text-sm">مبلغ قابل پرداخت</p>
                          <p className="font-bold">{order.total_price.toLocaleString('fa-IR')} تومان</p>
                        </div>
                        
                        {hasDiscount && (
                          <div className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-center min-w-[120px]">
                            <p className="text-sm">تخفیف اعمال شده</p>
                            <p className="font-bold">{discountAmount.toLocaleString('fa-IR')} تومان</p>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => toggleOrderDetails(order.id)}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                            expandedOrder === order.id 
                              ? "bg-blue-50 text-blue-600 border-blue-200" 
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                          }`}
                        >
                          {expandedOrder === order.id ? (
                            <>
                              <FiChevronUp />
                              بستن جزئیات
                            </>
                          ) : (
                            <>
                              <FiEye />
                              مشاهده جزئیات
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button 
                        onClick={() => handleStatusChange(order.id, "approved")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                          order.status === "approved" 
                            ? "bg-green-100 text-green-800" 
                            : "text-gray-600 hover:bg-green-50"
                        }`}
                      >
                        <FiCheckCircle className={status.iconColor} />
                        تایید سفارش
                      </button>
                      <button 
                        onClick={() => handleStatusChange(order.id, "cancelled")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                          order.status === "cancelled" 
                            ? "bg-red-100 text-red-800" 
                            : "text-gray-600 hover:bg-red-50"
                        }`}
                      >
                        <FiXCircle className={status.iconColor} />
                        لغو سفارش
                      </button>
                      <button 
                        onClick={() => handleStatusChange(order.id, "completed")}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                          order.status === "completed" 
                            ? "bg-blue-100 text-blue-800" 
                            : "text-gray-600 hover:bg-blue-50"
                        }`}
                      >
                        <FiCheckCircle className={status.iconColor} />
                        تکمیل سفارش
                      </button>
                    </div>
                  </div>
                  
                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-5 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                          <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <FiDollarSign className="text-blue-500" />
                            خلاصه پرداخت
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">جمع کل سفارش:</span>
                              <span className="font-medium">{order.original_price.toLocaleString('fa-IR')} تومان</span>
                            </div>
                            
                            {hasDiscount && (
                              <>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <FiPercent className="text-green-500" />
                                    تخفیف ({order.discount_percentage}%):
                                  </span>
                                  <span className="font-medium text-green-600">
                                    {discountAmount.toLocaleString('fa-IR')} تومان
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <FiTag className="text-blue-500" />
                                    کد تخفیف:
                                  </span>
                                  <span className="font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-sm">
                                    {order.discount_code}
                                  </span>
                                </div>
                              </>
                            )}
                            
                            <div className="pt-3 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">هزینه ارسال:</span>
                                <span className="font-medium">رایگان</span>
                              </div>
                            </div>
                            
                            <div className="pt-3 border-t border-gray-200 font-bold">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">مبلغ قابل پرداخت:</span>
                                <span className="text-lg text-blue-600">
                                  {order.total_price.toLocaleString('fa-IR')} تومان
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                          <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <FiPackage className="text-blue-500" />
                            جزئیات سفارش
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">محصول</th>
                                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">تعداد</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">قیمت واحد</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">قیمت کل</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {order.items.map(item => (
                                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 h-12 w-12">
                                          <img
                                            src={item.product.image || IMG}
                                            alt={item.product.name}
                                            className="h-12 w-12 rounded-lg object-cover border"
                                          />
                                        </div>
                                        <div>
                                          <div className="font-medium text-gray-900">{item.product.name}</div>
                                          <div className="text-gray-500 text-sm">
                                            فروشنده: {item.seller.shop_name}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                      <span className="px-2 py-1 bg-gray-100 rounded-md">
                                        {item.quantity.toLocaleString('fa-IR')}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                                      {item.price.toLocaleString('fa-IR')} تومان
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                                      {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <FiTruck className="text-blue-500" />
                          اطلاعات ارسال
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-1">وضعیت ارسال</h5>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                order.status === 'completed' ? 'bg-green-500' : 
                                order.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}></div>
                              <span>
                                {order.status === 'completed' ? 'تحویل شده' :
                                 order.status === 'cancelled' ? 'لغو شده' : 'در حال آماده‌سازی'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-1">تخمین زمان تحویل</h5>
                            <p>۲ تا ۳ روز کاری</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;