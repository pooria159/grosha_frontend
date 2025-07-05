import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { FiTrendingUp, FiPieChart, FiDollarSign, FiCalendar, FiAward, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Customer {
  id: number;
  username: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
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
  discount?: number;
  discount_percentage?: number;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
const BAR_COLORS = ["#3b82f6", "#10b981"];

const mockMonthlyData = [
  { name: "فروردین", فروش: 4500000, تعداد: 12 },
  { name: "اردیبهشت", فروش: 3800000, تعداد: 10 },
  { name: "خرداد", فروش: 5200000, تعداد: 15 },
  { name: "تیر", فروش: 4100000, تعداد: 11 },
  { name: "مرداد", فروش: 3900000, تعداد: 9 },
  { name: "شهریور", فروش: 4800000, تعداد: 14 },
];

const mockTopProducts = [
  { name: "یخچال ساید", فروش: 3200000 },
  { name: "تلویزیون هوشمند", فروش: 2800000 },
  { name: "لپ‌تاپ گیمینگ", فروش: 2500000 },
  { name: "هدفون بی‌سیم", فروش: 1800000 },
  { name: "کنسول بازی", فروش: 1500000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
        <p className="font-bold text-gray-800">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="flex items-center text-sm mt-1">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            ></span>
            {item.name}: <span className="font-bold mr-1">
              {new Intl.NumberFormat('fa-IR').format(item.value)} تومان
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomYAxisTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={4} 
        textAnchor="end" 
        fill="#666"
        fontSize={12}
      >
        {new Intl.NumberFormat('fa-IR', {
          notation: 'compact',
          compactDisplay: 'short'
        }).format(payload.value)}
      </text>
    </g>
  );
};

const ReportsAndAnalytics: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [useMockData, setUseMockData] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'monthly' | 'weekly'>('monthly');
  const token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");

  const refreshAccessToken = async () => {
    if (!refresh_token) {
      console.error("توکن refresh یافت نشد.");
      return null;
    }
    try {
      const response = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refresh_token }),
      });
      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.access;
        localStorage.setItem("access_token", newAccessToken);
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
      let currentToken = token;
      if (!currentToken) {
        currentToken = await refreshAccessToken();
      }
      if (!currentToken) {
        toast.error("توکن معتبر یافت نشد.");
        return;
      }

      const response = await fetch("http://localhost:8000/api/orders/by-seller/", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        calculateUniqueUsers(data);
      } else {
        toast.error("خطا در دریافت سفارشات");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const calculateUniqueUsers = (ordersData: Order[]) => {
    const uniqueUserIds = new Set<number>();
    ordersData.forEach(order => {
      uniqueUserIds.add(order.customer.id);
    });
    setTotalUsers(uniqueUserIds.size);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const groupOrdersByMonth = () => {
    const monthlyData: Record<string, { total: number; count: number }> = {};

    orders.forEach(order => {
      if (order.status !== 'completed') return;
      
      const date = new Date(order.created_at);
      const month = date.toLocaleString('fa-IR', { month: 'long' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, count: 0 };
      }
      
      monthlyData[month].total += order.total_price;
      monthlyData[month].count += 1;
    });

    return Object.entries(monthlyData).map(([name, { total, count }]) => ({
      name,
      فروش: total,
      تعداد: count
    }));
  };

  const getTopProducts = () => {
    const productSales: Record<string, number> = {};

    orders.forEach(order => {
      if (order.status !== 'completed') return;
      
      order.items.forEach(item => {
        const productName = item.product_name;
        productSales[productName] = (productSales[productName] || 0) + item.total_price;
      });
    });

    return Object.entries(productSales)
      .map(([name, فروش]) => ({ name, فروش }))
      .sort((a, b) => b.فروش - a.فروش)
      .slice(0, 5);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const monthlySalesData = useMockData ? mockMonthlyData : groupOrdersByMonth();
  const topProductsData = useMockData ? mockTopProducts : getTopProducts();  
  const completedOrders = orders.filter(order => order.status === 'completed');
  const totalSales = completedOrders.reduce((sum, order) => sum + order.total_price, 0);  
  const avgOrderValue = completedOrders.length > 0 ? totalSales / completedOrders.length : 0;
  
  let growthRate = 0;
  if (monthlySalesData.length >= 2) {
    const lastMonth = monthlySalesData[monthlySalesData.length - 1].فروش;
    const prevMonth = monthlySalesData[monthlySalesData.length - 2].فروش;
    growthRate = prevMonth !== 0 ? ((lastMonth - prevMonth) / prevMonth) * 100 : 0;
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen p-4 md:p-6" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                  <FiTrendingUp className="ml-2 text-indigo-600" size={28} />
                  گزارشات و آنالیز فروش
                </h1>
                <p className="text-gray-600 mt-2">
                  تحلیل جامع عملکرد فروش و شناسایی فرصت‌های رشد کسب‌وکار
                </p>
              </div>
            </div>  
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-[#3b82f6] hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#64748b] text-sm">فروش کل</p>
                    <h3 className="text-2xl font-bold text-[#1e293b] mt-1">
                      {new Intl.NumberFormat('fa-IR').format(totalSales)}
                      <span className="text-sm font-normal text-[#64748b] mr-1">تومان</span>
                    </h3>
                  </div>
                  <div className="bg-[#3b82f6]/10 p-3 rounded-lg">
                    <FiDollarSign className="text-[#3b82f6]" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className={`flex items-center ${growthRate >= 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                    {growthRate >= 0 ? '↑' : '↓'} {Math.abs(growthRate).toFixed(1)}%
                  </span>
                  <span className="text-[#64748b] mr-1">نسبت به ماه قبل</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-[#10b981] hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#64748b] text-sm">میانگین سفارش</p>
                    <h3 className="text-2xl font-bold text-[#1e293b] mt-1">
                      {new Intl.NumberFormat('fa-IR').format(avgOrderValue)}
                      <span className="text-sm font-normal text-[#64748b] mr-1">تومان</span>
                    </h3>
                  </div>
                  <div className="bg-[#10b981]/10 p-3 rounded-lg">
                    <FiPieChart className="text-[#10b981]" size={24} />
                  </div>
                </div>
                <div className="mt-4 text-sm text-[#64748b]">
                  <span>از {completedOrders.length} سفارش تکمیل شده</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-[#f59e0b] hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#64748b] text-sm">مشتریان منحصر به فرد</p>
                    <h3 className="text-2xl font-bold text-[#1e293b] mt-1">
                      {new Intl.NumberFormat('fa-IR').format(totalUsers)}
                      <span className="text-sm font-normal text-[#64748b] mr-1">نفر</span>
                    </h3>
                  </div>
                  <div className="bg-[#f59e0b]/10 p-3 rounded-lg">
                    <FiUsers className="text-[#f59e0b]" size={24} />
                  </div>
                </div>
                <div className="mt-4 text-sm text-[#64748b]">
                  <span>تعداد کاربران فعال</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-[#8b5cf6] hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#64748b] text-sm">محصولات پرفروش</p>
                    <h3 className="text-2xl font-bold text-[#1e293b] mt-1">
                      {new Intl.NumberFormat('fa-IR').format(getTopProducts().length)}
                      <span className="text-sm font-normal text-[#64748b] mr-1">محصول</span>
                    </h3>
                  </div>
                  <div className="bg-[#8b5cf6]/10 p-3 rounded-lg">
                    <FiAward className="text-[#8b5cf6]" size={24} />
                  </div>
                </div>
                <div className="mt-4 text-sm text-[#64748b]">
                  <span>براساس فروش {completedOrders.length} سفارش</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#3b82f6] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1e293b] flex items-center">
                    <FiCalendar className="ml-2 text-[#3b82f6]" size={24} />
                    نمودار فروش ماهانه
                  </h2>
                  <div className="flex space-x-2 space-x-reverse">
                    <button 
                      onClick={() => setActiveTab('monthly')}
                      className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'monthly' ? 'bg-[#3b82f6] text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      ماهانه
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={monthlySalesData}
                      margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                      barSize={80}
                    >
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={{ stroke: '#e2e8f0' }}
                      />
                      <YAxis 
                        tick={<CustomYAxisTick />}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={{ stroke: '#e2e8f0' }}
                        width={60}
                      />
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ fill: '#f1f5f9' }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: 20 }}
                        formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                      />
                      <Bar 
                        dataKey="فروش" 
                        fill="#3b82f6" 
                        radius={[6, 6, 0, 0]}
                        animationDuration={1500}
                        name="مبلغ فروش"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#8b5cf6] hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-6">
                  <FiAward className="ml-2 text-[#8b5cf6]" size={24} />
                  محصولات پرفروش
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topProductsData}
                        dataKey="فروش"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={2}
                        label={renderCustomizedLabel}
                        labelLine={false}
                      >
                        {topProductsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={<CustomTooltip />}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="left"
                        wrapperStyle={{ 
                          paddingLeft: 20,
                          fontSize: '0.75rem'
                        }}
                        formatter={(value, entry, index) => (
                          <span className="text-gray-600">
                            {topProductsData[index]?.name}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#10b981] hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-6">
                <FiTrendingUp className="ml-2 text-[#10b981]" size={24} />
                جزئیات سفارشات
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره سفارش</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مشتری</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مبلغ نهایی</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.order_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Intl.NumberFormat('fa-IR').format(order.total_price)} تومان
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status === 'completed' ? 'تکمیل شده' : 
                             order.status === 'pending' ? 'در انتظار' : 'لغو شده'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsAndAnalytics;