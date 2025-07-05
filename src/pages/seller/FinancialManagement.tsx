import React, { useState, useEffect } from "react";
import { 
  MdSync, 
  MdSearch,
  MdOutlineReceipt,
  MdOutlineTrendingUp,
  MdOutlineShowChart,
  MdOutlineCancel,
  MdCheckCircleOutline
} from "react-icons/md";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
}

interface Customer {
  id: number;
  username: string;
  email: string;
}

interface Order {
  order_id: number;
  customer: Customer;
  items: OrderItem[];
  total_price: number;
  original_price?: number;
  status: "completed" | "pending" | "cancelled";
  created_at: string;
  discount?: number;
  discount_percentage?: number;
}

const FinancialDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("monthly");
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token"));

  const orderStatuses = [
    { value: "all", label: "همه" },
    { value: "completed", label: "تکمیل شده" },
    { value: "pending", label: "در انتظار" },
    { value: "cancelled", label: "لغو شده" }
  ];

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      console.error("توکن refresh یافت نشد.");
      return null;
    }

    try {
      const response = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.access;
        localStorage.setItem("access_token", newAccessToken);
        setAccessToken(newAccessToken);
        return newAccessToken;
      } else {
        console.error("خطا در تمدید توکن.");
        return null;
      }
    } catch (error) {
      console.error("خطا در ارتباط با سرور:", error);
      return null;
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let token = accessToken;

      if (!token) {
        token = await refreshAccessToken();
        if (!token) {
          toast.error("لطفاً مجدداً وارد شوید");
          return;
        }
      }

      const response = await fetch("http://localhost:8000/api/orders/by-seller/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } else if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          await fetchOrders();
        } else {
          toast.error("لطفاً مجدداً وارد شوید");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "خطا در دریافت سفارشات");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = orders;
    
    if (activeFilter !== "all") {
      result = result.filter(order => order.status === activeFilter);
    }
    
    if (searchQuery) {
      result = result.filter(order => 
        order.customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => 
          item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
    
    setFilteredOrders(result);
  }, [searchQuery, activeFilter, orders]);

  const completedOrders = orders.filter(o => o.status === "completed");
  const pendingOrders = orders.filter(o => o.status === "pending");
  const cancelledOrders = orders.filter(o => o.status === "cancelled");

  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total_price, 0);
  const pendingAmount = pendingOrders.reduce((sum, order) => sum + order.total_price, 0);
  const cancelledAmount = cancelledOrders.reduce((sum, order) => sum + order.total_price, 0);

  const pieData = [
    { name: "تکمیل شده", value: totalRevenue, color: "#10B981" },
    { name: "در انتظار", value: pendingAmount, color: "#F59E0B" },
    { name: "لغو شده", value: cancelledAmount, color: "#EF4444" }
  ];

  const generateChartData = () => {
    if (timeRange === "monthly") {
      const monthlyGroups: Record<string, { revenue: number, expenses: number }> = {};
      
      orders.forEach(order => {
        const date = new Date(order.created_at);
        const month = date.toLocaleDateString('fa-IR', { month: 'long' });
        
        if (!monthlyGroups[month]) {
          monthlyGroups[month] = { revenue: 0, expenses: 0 };
        }
        
        if (order.status === "completed") {
          monthlyGroups[month].revenue += order.total_price;
        } else if (order.status === "cancelled") {
          monthlyGroups[month].expenses += order.total_price;
        }
      });
      
      return Object.keys(monthlyGroups).map(month => ({
        name: month,
        revenue: monthlyGroups[month].revenue,
        expenses: monthlyGroups[month].expenses
      }));
    } else {
      const weeklyGroups: Record<string, { revenue: number, expenses: number }> = {};
      
      orders.forEach(order => {
        const date = new Date(order.created_at);
        const weekNumber = Math.ceil(date.getDate() / 7);
        const weekKey = `هفته ${weekNumber}`;
        
        if (!weeklyGroups[weekKey]) {
          weeklyGroups[weekKey] = { revenue: 0, expenses: 0 };
        }
        
        if (order.status === "completed") {
          weeklyGroups[weekKey].revenue += order.total_price;
        } else if (order.status === "cancelled") {
          weeklyGroups[weekKey].expenses += order.total_price;
        }
      });
      
      return Object.keys(weeklyGroups).map(week => ({
        name: week,
        revenue: weeklyGroups[week].revenue,
        expenses: weeklyGroups[week].expenses
      }));
    }
  };

  const chartData = generateChartData();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value) + " تومان";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-6" style={{ direction: "rtl" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <MdOutlineTrendingUp className="ml-2 text-indigo-600" size={28} />
                داشبورد مالی
              </h1>
              <p className="text-gray-600 mt-2">وضعیت مالی و تراکنش‌های شما در یک نگاه</p>
            </div>
            <div className="mt-4 md:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="monthly">نمایش ماهانه</option>
                <option value="weekly">نمایش هفتگی</option>
              </select>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm pr-10 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="جستجوی سفارشات..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {orderStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setActiveFilter(status.value)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeFilter === status.value
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
              title="کل درآمد"
              value={totalRevenue}
              change={`${completedOrders.length} سفارش تکمیل شده`}
              icon={<MdCheckCircleOutline size={24} className="text-green-600" />}
              color="green"
              loading={loading}
            />
            <SummaryCard
              title="در انتظار تسویه"
              value={pendingAmount}
              change={`${pendingOrders.length} سفارش در انتظار`}
              icon={<MdSync size={24} className="text-yellow-600 animate-spin" />}
              color="yellow"
              loading={loading}
            />
            <SummaryCard
              title="سفارشات لغو شده"
              value={cancelledAmount}
              change={`${cancelledOrders.length} سفارش لغو شده`}
              icon={<MdOutlineCancel size={24} className="text-red-600" />}
              color="red"
              loading={loading}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-indigo-700 flex items-center">
                  <MdOutlineShowChart className="ml-2" />
                  عملکرد مالی {timeRange === "monthly" ? "ماهیانه" : "هفتگی"}
                </h3>
                <select 
                  className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded-lg focus:outline-none"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="monthly">ماهیانه</option>
                  <option value="weekly">هفتگی</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#9CA3AF' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#9CA3AF' }}
                      tickFormatter={(value) => new Intl.NumberFormat('fa-IR').format(value / 1000000) + 'میلیون'}
                    />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(value), ""]}
                      contentStyle={{ 
                        borderRadius: "8px", 
                        border: "none", 
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        fontFamily: 'inherit'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      formatter={(value) => <span className="text-gray-700">{value}</span>}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      name="درآمد" 
                      stroke="#10B981" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      name="هزینه" 
                      stroke="#EF4444" 
                      fillOpacity={1} 
                      fill="url(#colorExpenses)" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-green-700 flex items-center mb-4">
                <MdOutlineReceipt className="ml-2" />
                توزیع مالی
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), ""]}
                      contentStyle={{ 
                        borderRadius: "8px", 
                        border: "none", 
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        fontFamily: 'inherit'
                      }}
                    />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      formatter={(value) => <span className="text-gray-700">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-indigo-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-indigo-700 flex items-center">
                <MdOutlineReceipt className="ml-2" />
                آخرین سفارشات
              </h3>
              <div className="text-sm text-gray-500">
                نمایش {filteredOrders.length} از {orders.length} سفارش
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                هیچ سفارشی یافت نشد
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره سفارش</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مشتری</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">محصولات</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مبلغ</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium">{order.customer.username}</div>
                          <div className="text-gray-400 text-xs">{order.customer.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-sm text-gray-700">
                                {item.product_name} ({item.quantity}x)
                                <div className="text-xs text-gray-500">{formatCurrency(item.price)}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="text-gray-900">{formatCurrency(order.total_price)}</div>
                          {order.discount_percentage && (
                            <div className="text-xs text-green-600">
                              {formatCurrency(order.original_price || order.total_price)} ({order.discount_percentage}% تخفیف)
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    completed: {
      color: "bg-green-100 text-green-800",
      icon: <MdCheckCircleOutline className="ml-1" />,
      label: "تکمیل شده"
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <MdSync className="ml-1 animate-spin" />,
      label: "در انتظار"
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: <MdOutlineCancel className="ml-1" />,
      label: "لغو شده"
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

const SummaryCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color,
  loading = false
}: { 
  title: string, 
  value: number, 
  change: string,
  icon: React.ReactNode, 
  color: string,
  loading?: boolean
}) => {
  const colorClasses = {
    green: {
      bg: "bg-green-50",
      text: "text-green-700",
      iconBg: "bg-green-100",
      border: "border-green-500"
    },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      iconBg: "bg-yellow-100",
      border: "border-yellow-500"
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-700",
      iconBg: "bg-red-100",
      border: "border-red-500"
    }
  };

  const formattedValue = new Intl.NumberFormat('fa-IR').format(value) + " تومان";

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`${colorClasses[color as keyof typeof colorClasses].bg} p-5 rounded-2xl shadow-sm border-t-4 ${colorClasses[color as keyof typeof colorClasses].border}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className={`${colorClasses[color as keyof typeof colorClasses].text} font-medium text-sm`}>{title}</h4>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded mt-2 w-3/4 animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-1">{formattedValue}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">{change}</p>
        </div>
        <div className={`${colorClasses[color as keyof typeof colorClasses].iconBg} p-3 rounded-lg`}>{icon}</div>
      </div>
    </motion.div>
  );
};

export default FinancialDashboard;