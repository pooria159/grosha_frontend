import React, { useState, useEffect } from "react";
import { 
  FiUsers, 
  FiSearch, 
  FiMail,
  FiPhone,
  FiShoppingBag,
  FiEye,
  FiCalendar,
  FiX,
  FiDollarSign,
  FiTrendingUp
} from "react-icons/fi";

interface Customer {
  id: number;
  username: string;
  email: string;
  phone?: string;
  first_order_date: string;
  status?: string;
  order_count: number;
  total_spent: number;
}

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
}

interface Order {
  order_id: number;
  customer: Customer;
  items: OrderItem[];
  total_price: number;
  status: string;
  created_at: string;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await fetch("https://api.grosha.ir/api/orders/by-seller/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const ordersData: Order[] = await response.json();
        setOrders(ordersData);

        const customersMap = new Map<number, Customer>();

        ordersData.forEach(order => {
          const customerId = order.customer.id;
          
          if (!customersMap.has(customerId)) {
            customersMap.set(customerId, {
              ...order.customer,
              first_order_date: order.created_at,
              order_count: 1,
              total_spent: order.total_price,
              status: "فعال"
            });
          } else {
            const existingCustomer = customersMap.get(customerId)!;
            customersMap.set(customerId, {
              ...existingCustomer,
              order_count: existingCustomer.order_count + 1,
              total_spent: existingCustomer.total_spent + order.total_price,
              first_order_date: 
                new Date(order.created_at) < new Date(existingCustomer.first_order_date) 
                  ? order.created_at 
                  : existingCustomer.first_order_date
            });
          }
        });

        setCustomers(Array.from(customersMap.values()));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };

  const getCustomerOrders = (customerId: number) => {
    return orders.filter(order => order.customer.id === customerId);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchQuery))
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "فعال").length;

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mr-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen p-4" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center">
              <FiUsers className="ml-2 text-indigo-600" size={20} />
              مدیریت مشتریان
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">مدیریت ارتباط با مشتریان</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border-t-4 border-indigo-500">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-gray-500 text-xs md:text-sm font-medium">کل مشتریان</h4>
                <p className="text-lg md:text-xl font-bold text-gray-800 mt-1">{totalCustomers.toLocaleString('fa-IR')}</p>
              </div>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <FiUsers className="text-indigo-600" size={16} />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border-t-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-gray-500 text-xs md:text-sm font-medium">مشتریان فعال</h4>
                <p className="text-lg md:text-xl font-bold text-gray-800 mt-1">{activeCustomers.toLocaleString('fa-IR')}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <FiTrendingUp className="text-green-600" size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
              placeholder="جستجوی مشتریان ..."
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام مشتری</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">اطلاعات تماس</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تعداد خریدها</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                            {customer.username.charAt(0)}
                          </div>
                          <div className="mr-2">
                            <div className="text-sm font-medium text-gray-900">{customer.username}</div>
                            <div className="text-xs text-gray-500">عضویت: {formatDate(customer.first_order_date)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-xs md:text-sm text-gray-900 flex items-center">
                          <FiMail className="ml-1 text-gray-400" size={12} />
                          <span className="truncate max-w-[120px] md:max-w-[180px]">{customer.email}</span>
                        </div>
                        <div className="text-xs md:text-sm text-gray-500 mt-1 flex items-center">
                          <FiPhone className="ml-1 text-gray-400" size={12} />
                          {customer.phone || 'ثبت نشده'}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiShoppingBag className="ml-1 text-gray-400" size={12} />
                          <span className="text-xs md:text-sm font-medium">
                            {customer.order_count.toLocaleString('fa-IR')} خرید
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleCustomerClick(customer)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="مشاهده جزئیات"
                        >
                          <FiEye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      هیچ مشتری یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showCustomerModal && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    جزئیات مشتری
                  </h3>
                  <button 
                    onClick={() => setShowCustomerModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                  <div className="relative">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {selectedCustomer.username.charAt(0)}
                    </div>
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      selectedCustomer.status === "فعال" 
                        ? "bg-green-500" 
                        : "bg-gray-500"
                    }`}></span>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">{selectedCustomer.username}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedCustomer.status === "فعال" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {selectedCustomer.status}
                      </span>
                      <span className="flex items-center text-xs text-gray-600">
                        <FiCalendar className="ml-1" size={10} />
                        اولین خرید: {formatDate(selectedCustomer.first_order_date)}
                      </span>
                      <span className="flex items-center text-xs text-gray-600">
                        <FiShoppingBag className="ml-1" size={10} />
                        {selectedCustomer.order_count.toLocaleString('fa-IR')} خرید
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">اطلاعات تماس</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-white p-1 rounded shadow-sm">
                        <FiMail className="text-indigo-500" size={12} />
                      </div>
                      <div className="mr-2">
                        <p className="text-xs text-gray-500">ایمیل</p>
                        <p className="text-gray-800 text-sm">{selectedCustomer.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-white p-1 rounded shadow-sm">
                        <FiPhone className="text-indigo-500" size={12} />
                      </div>
                      <div className="mr-2">
                        <p className="text-xs text-gray-500">تلفن</p>
                        <p className="text-gray-800 text-sm">{selectedCustomer.phone || 'ثبت نشده'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">آمار خرید</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded shadow-sm text-center">
                      <p className="text-xs text-gray-500">تعداد خریدها</p>
                      <p className="text-base font-bold text-indigo-600 mt-1">
                        {selectedCustomer.order_count.toLocaleString('fa-IR')}
                      </p>
                    </div>
                    
                    <div className="bg-white p-2 rounded shadow-sm text-center">
                      <p className="text-xs text-gray-500">مبلغ کل</p>
                      <p className="text-base font-bold text-green-600 mt-1">
                        {selectedCustomer.total_spent.toLocaleString('fa-IR')} تومان
                      </p>
                    </div>
                    
                    <div className="bg-white p-2 rounded shadow-sm text-center">
                      <p className="text-xs text-gray-500">میانگین خرید</p>
                      <p className="text-base font-bold text-purple-600 mt-1">
                        {selectedCustomer.order_count > 0
                          ? Math.round(selectedCustomer.total_spent / selectedCustomer.order_count)
                              .toLocaleString('fa-IR') + ' تومان'
                          : '0 تومان'}
                      </p>
                    </div>
                    
                    <div className="bg-white p-2 rounded shadow-sm text-center">
                      <p className="text-xs text-gray-500">آخرین خرید</p>
                      <p className="text-xs font-medium text-gray-800 mt-1">
                        {selectedCustomer.order_count > 0
                          ? formatDate(
                              getCustomerOrders(selectedCustomer.id)
                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at || ''
                            ) 
                          : 'بدون خرید'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">فعالیت‌های اخیر</h4>
                  
                  <div className="space-y-3">
                    {getCustomerOrders(selectedCustomer.id)
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 3)
                      .map(order => (
                        <div key={order.order_id} className="flex items-start pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <div className="bg-white p-1 rounded shadow-sm">
                            <FiShoppingBag className="text-green-500" size={12} />
                          </div>
                          <div className="mr-2 flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium text-gray-800 text-sm">سفارش {order.order_id}</p>
                              <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {order.items.length} آیتم - {order.total_price.toLocaleString('fa-IR')} تومان
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              وضعیت: 
                              <span className={`px-1 py-0.5 rounded-full mr-1 ${
                                order.status === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : order.status === "pending" 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-red-100 text-red-800"
                              }`}>
                                {order.status === "completed" ? "تکمیل شده" : 
                                 order.status === "pending" ? "در انتظار" : "لغو شده"}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    
                    {selectedCustomer.order_count === 0 && (
                      <div className="text-center py-3 text-gray-500 text-sm">
                        هیچ فعالیتی یافت نشد
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
                  <button 
                    onClick={() => setShowCustomerModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    بستن
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;