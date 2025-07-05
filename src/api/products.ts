import axios from 'axios';
import { Product } from '../data/products';
import { Store } from '../data/stores';

const API_URL = 'http://localhost:8000/api';

export const getProductsBySubcategory = async (subcategoryName: string) => {
  const encodedName = encodeURIComponent(subcategoryName);
  const response = await axios.get(`${API_URL}/products/by-subcategory/${encodedName}/`);
  return response.data;
};

export const getProductsByCategory = async (categoryName: string) => {
  const encodedName = encodeURIComponent(categoryName);
  const response = await axios.get(`${API_URL}/products/by-category/${encodedName}/`);
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSellersByProductId = async (productId: number): Promise<Store[]> => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}/sellers/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};



export const updateProductStock = async (productId: number, quantityChange: number) => {
  try {
    const response = await axios.patch(
      `${API_URL}/products/${productId}/update-stock/`, 
      { quantity: quantityChange },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};