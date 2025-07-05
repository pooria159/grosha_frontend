import axios from 'axios';

export interface DiscountResponse {
  id: number;
  title: string;
  code: string;
  percentage: number;
  seller_id: number | null;
  shop_name: string | null;
  description: string;
  min_order_amount: number;
  for_first_purchase: boolean;
}

export const applyDiscount = async (
  code: string, 
  storeId: number,
  orderTotal: number 
): Promise<DiscountResponse> => {
  const token = localStorage.getItem("access_token");
  const response = await axios.post<DiscountResponse>(
    "http://localhost:8000/api/discounts/apply/",
    { 
      code, 
      store_id: storeId,
      order_total: orderTotal
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};