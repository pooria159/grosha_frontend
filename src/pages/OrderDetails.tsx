import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  sellerName: string;
}

interface Order {
  id: number;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

const OrderDetails: React.FC = () => {
  const { state } = useLocation();
  const order = state?.order as Order;
  const navigate = useNavigate();

  if (!order) {
    return (
      <div className="p-4 text-center">
        <p>سفارشی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen" style={{ direction: 'rtl' }}>
      <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#00296B] hover:text-blue-800 mb-6"
        >
          <FiChevronLeft className="ml-1" />
          بازگشت به لیست سفارشات
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#00296B] mb-2">
            سفارش شماره #{order.id}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">تاریخ:</span> {order.date}
            </div>
            <div>
              <span className="font-medium">وضعیت:</span> 
              <span className={`px-2 py-1 rounded-full text-xs ${
                order.status === "تحویل شده"
                  ? "bg-green-100 text-green-800"
                  : order.status === "در حال پردازش"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}>
                {order.status}
              </span>
            </div>
            <div>
              <span className="font-medium">مبلغ کل:</span> 
              {order.total.toLocaleString()} تومان
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-[#00509D] mb-4">
            اقلام سفارش
          </h3>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{item.productName}</h4>
                  <div className="text-sm text-gray-500 mt-1">
                    فروشنده: {item.sellerName}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-gray-600">
                    {item.quantity} × {item.price.toLocaleString()} تومان
                  </div>
                  <div className="font-bold text-[#00296B] mt-1">
                    {(item.quantity * item.price).toLocaleString()} تومان
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;