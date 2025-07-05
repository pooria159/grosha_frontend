import React, { useEffect, useState } from 'react';
import { getOrders_seller, updateOrderStatus } from '../../api/orders';
import { toast } from 'react-toastify';
import IMG from '../../assets/img.jpg';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiRefreshCw, 
  FiChevronDown, 
  FiChevronUp, 
  FiShoppingBag, 
  FiDollarSign, 
  FiCalendar, 
  FiUser,
  FiPercent,
  FiTag,
  FiCreditCard,
  FiBox
} from 'react-icons/fi';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
  seller?: {
    id: number;
    shop_name: string;
  };
}

interface Discount {
  id: number;
  percentage: number;
  code: string;
}

interface Customer {
  id: number;
  username: string;
  email: string;
}

interface Order {
  order_id: number;
  customer: Customer;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded' | 'delivered';
  created_at: string;
  total_price: number;
  items: OrderItem[];
  original_price?: number;
  discount?: Discount;
  discount_percentage?: number;
  discount_code?: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await getOrders_seller();
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch (error) {
        toast.error('خطا در دریافت سفارشات');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const handleCheckout = async (order: Order) => {
    setProcessingId(order.order_id);
    try {
      await updateOrderStatus(order.order_id, 'completed');
      setOrders(prev => prev.map(o => o.order_id === order.order_id ? { ...o, status: 'completed' } : o));
      toast.success(`سفارش ${order.order_id} با موفقیت تسویه شد`);
    } catch (error) {
      toast.error('خطا در تسویه حساب سفارش');
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: 'cancelled' | 'delivered' | 'refunded') => {
    if (!window.confirm(`آیا از تغییر وضعیت سفارش به ${newStatus === 'cancelled' ? 'لغو شده' : newStatus === 'delivered' ? 'تحویل داده شده' : 'مرجوعی'} مطمئن هستید؟`)) return;
    
    setProcessingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`وضعیت سفارش ${orderId} با موفقیت تغییر یافت`);
    } catch (error) {
      toast.error('خطا در تغییر وضعیت سفارش');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-violet-100 text-violet-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiRefreshCw className="ml-1 animate-spin" size={16} />;
      case 'completed':
        return <FiCheckCircle className="ml-1" size={16} />;
      case 'cancelled':
        return <FiXCircle className="ml-1" size={16} />;
      case 'delivered':
        return <FiTruck className="ml-1" size={16} />;
      case 'refunded':
        return <FiBox className="ml-1" size={16} />;
      default:
        return <FiPackage className="ml-1" size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'در انتظار پرداخت';
      case 'completed':
        return 'تکمیل شده';
      case 'cancelled':
        return 'لغو شده';
      case 'delivered':
        return 'تحویل داده شده';
      case 'refunded':
        return 'مرجوعی';
      default:
        return status;
    }
  };

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fa-IR', options);
  };

  const statusFilters = [
    { value: 'all', label: 'همه', color: 'bg-gray-100 text-gray-800', icon: <FiShoppingBag size={16} />, count: orders.length },
    { value: 'pending', label: 'در انتظار', color: 'bg-amber-100 text-amber-800', icon: <FiRefreshCw size={16} />, count: orders.filter(o => o.status === 'pending').length },
    { value: 'completed', label: 'تکمیل شده', color: 'bg-emerald-100 text-emerald-800', icon: <FiCheckCircle size={16} />, count: orders.filter(o => o.status === 'completed').length },
    { value: 'cancelled', label: 'لغو شده', color: 'bg-rose-100 text-rose-800', icon: <FiXCircle size={16} />, count: orders.filter(o => o.status === 'cancelled').length },
    { value: 'delivered', label: 'تحویل شده', color: 'bg-violet-100 text-violet-800', icon: <FiTruck size={16} />, count: orders.filter(o => o.status === 'delivered').length },
    { value: 'refunded', label: 'مرجوعی', color: 'bg-blue-100 text-blue-800', icon: <FiBox size={16} />, count: orders.filter(o => o.status === 'refunded').length },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-6" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <FiPackage className="ml-2 text-indigo-600" size={28} />
                مدیریت سفارشات
              </h1>
              <p className="text-gray-600 mt-2">نمایش و مدیریت تمامی سفارشات سیستم</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-xs border border-gray-200">
              <p className="text-sm text-gray-500">تعداد سفارشات</p>
              <p className="text-xl font-bold text-indigo-600">{orders.length.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                  <FiShoppingBag className="ml-2 text-indigo-500" size={20} />
                  فیلتر وضعیت سفارشات
                </h2>
                <span className="text-sm text-gray-500">
                  <span className="font-medium text-indigo-600">{filteredOrders.length}</span> سفارش یافت شد
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 border
                      ${statusFilter === filter.value 
                        ? `${filter.color} border-transparent shadow-md font-semibold` 
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}
                    `}
                  >
                    {filter.icon}
                    {filter.label}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      statusFilter === filter.value ? 'bg-white/80' : 'bg-gray-100'
                    }`}>
                      {filter.count.toLocaleString('fa-IR')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
              <span className="mr-3 text-gray-600">در حال بارگذاری سفارشات...</span>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex flex-col items-center justify-center text-gray-500">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                <FiPackage className="w-12 h-12 text-indigo-400" />
              </div>
              <p className="text-lg font-medium">سفارشی یافت نشد</p>
              <p className="text-sm mt-1">هیچ سفارشی با وضعیت انتخاب شده وجود ندارد</p>
              <button 
                onClick={() => setStatusFilter('all')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                نمایش همه سفارشات
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredOrders.map((order) => {
              const hasDiscount = order.discount_percentage && order.discount_percentage > 0;
              const discountAmount = hasDiscount && order.original_price ? order.original_price - order.total_price : 0;
              
              return (
                <div 
                  key={order.order_id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div 
                    className="p-4 md:p-6 cursor-pointer transition-colors hover:bg-gray-50"
                    onClick={() => toggleOrderDetails(order.order_id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 flex items-center">
                            سفارش {order.order_id}
                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <p className="text-sm text-gray-500 flex items-center">
                              <FiUser className="ml-1" size={14} />
                              {order.customer.username}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <FiCalendar className="ml-1" size={14} />
                              {formatDate(order.created_at)}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <FiShoppingBag className="ml-1" size={14} />
                              {order.items.length} آیتم
                            </p>
                            {hasDiscount && (
                              <p className="text-sm text-green-600 flex items-center">
                                <FiPercent className="ml-1" size={14} />
                                تخفیف {order.discount_percentage}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end gap-3">
                        <div className="flex flex-col items-end">
                          {hasDiscount && order.original_price && (
                            <span className="text-sm text-gray-500 line-through">
                              {order.original_price.toLocaleString('fa-IR')} تومان
                            </span>
                          )}
                          <span className="font-bold text-gray-800 text-lg">
                            {order.total_price.toLocaleString('fa-IR')} تومان
                          </span>
                          {hasDiscount && discountAmount && (
                            <span className="text-xs text-green-600 mt-1">
                              صرفه‌جویی: {discountAmount.toLocaleString('fa-IR')} تومان
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckout(order);
                              }}
                              disabled={processingId === order.order_id}
                              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all
                                ${processingId === order.order_id ? 'opacity-70 cursor-not-allowed' : ''}
                              `}
                            >
                              {processingId === order.order_id ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  در حال پردازش
                                </>
                              ) : (
                                <>
                                  <FiDollarSign className="ml-1" size={16} />
                                  تسویه حساب
                                </>
                              )}
                            </button>
                          )}
                          
                          {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order.order_id, 'cancelled');
                              }}
                              disabled={processingId === order.order_id}
                              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-md hover:shadow-lg transition-all
                                ${processingId === order.order_id ? 'opacity-70 cursor-not-allowed' : ''}
                              `}
                            >
                              <FiXCircle className="ml-1" size={16} />
                              لغو سفارش
                            </button>
                          )}
                          
                          {order.status === 'completed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order.order_id, 'delivered');
                              }}
                              disabled={processingId === order.order_id}
                              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-md hover:shadow-lg transition-all
                                ${processingId === order.order_id ? 'opacity-70 cursor-not-allowed' : ''}
                              `}
                            >
                              <FiTruck className="ml-1" size={16} />
                              تحویل داده شد
                            </button>
                          )}
                          
                          {order.status === 'delivered' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order.order_id, 'refunded');
                              }}
                              disabled={processingId === order.order_id}
                              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all
                                ${processingId === order.order_id ? 'opacity-70 cursor-not-allowed' : ''}
                              `}
                            >
                              <FiBox className="ml-1" size={16} />
                              ثبت مرجوعی
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-3">
                      {expandedOrder === order.order_id ? (
                        <FiChevronUp className="text-gray-400" />
                      ) : (
                        <FiChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {expandedOrder === order.order_id && (
                    <div className="px-4 pb-4 md:px-6 md:pb-6 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            <FiCreditCard className="ml-2 text-indigo-500" size={18} />
                            خلاصه پرداخت
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">جمع کل سفارش:</span>
                              <span className="text-sm font-medium">
                                {(order.original_price || order.total_price).toLocaleString('fa-IR')} تومان
                              </span>
                            </div>
                            
                            {hasDiscount && (
                              <>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 flex items-center">
                                    <FiPercent className="ml-1 text-green-500" size={14} />
                                    تخفیف:
                                  </span>
                                  <span className="text-sm font-medium text-green-600">
                                    {discountAmount?.toLocaleString('fa-IR')} تومان
                                  </span>
                                </div>
                                {order.discount_code && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 flex items-center">
                                      <FiTag className="ml-1 text-blue-500" size={14} />
                                      کد تخفیف:
                                    </span>
                                    <span className="text-sm font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                                      {order.discount_code}
                                    </span>
                                  </div>
                                )}
                              </>
                            )}
                            
                            <div className="pt-2 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">هزینه ارسال:</span>
                                <span className="text-sm font-medium">رایگان</span>
                              </div>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">مبلغ قابل پرداخت:</span>
                                <span className="text-lg font-bold text-indigo-600">
                                  {order.total_price.toLocaleString('fa-IR')} تومان
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            <FiPackage className="ml-2 text-indigo-500" size={18} />
                            جزئیات محصولات
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">محصول</th>
                                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">تعداد</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">قیمت واحد</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">قیمت کل</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {order.items.map((item) => (
                                  <tr key={item.product_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 h-12 w-12">
                                          <img 
                                            src={IMG} 
                                            alt={item.product_name}
                                            className="h-12 w-12 object-cover rounded-lg"
                                          />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
                                          {item.seller && (
                                            <p className="text-xs text-gray-500 mt-1">فروشنده: {item.seller.shop_name}</p>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                      <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                                        {item.quantity.toLocaleString('fa-IR')}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-sm">
                                      {item.price.toLocaleString('fa-IR')} تومان
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 text-sm">
                                      {item.total_price.toLocaleString('fa-IR')} تومان
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                          <FiTruck className="ml-2 text-indigo-500" size={18} />
                          اطلاعات ارسال
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="text-xs font-medium text-gray-500 mb-1">وضعیت ارسال</h5>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                order.status === 'completed' ? 'bg-green-500' : 
                                order.status === 'delivered' ? 'bg-violet-500' :
                                order.status === 'cancelled' ? 'bg-red-500' : 
                                order.status === 'refunded' ? 'bg-blue-500' : 'bg-amber-500'
                              }`}></div>
                              <span className="text-sm">
                                {getStatusText(order.status)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h5 className="text-xs font-medium text-gray-500 mb-1">تاریخ تحویل تخمینی</h5>
                            <p className="text-sm">۲ تا ۳ روز کاری</p>
                          </div>
                          <div>
                            <h5 className="text-xs font-medium text-gray-500 mb-1">روش تحویل</h5>
                            <p className="text-sm">پست پیشتاز</p>
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

export default OrderManagement;