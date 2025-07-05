import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoryPage from "./pages/CategoryPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import SellerDashboard from "./pages/seller/SellerDashboard";
import DashboardContent from "./pages/seller/DashboardContent";
import ProductManagement from "./pages/seller/ProductManagement";
import OrderManagement from "./pages/seller/OrderManagement";
import FinancialManagement from "./pages/seller/FinancialManagement";
import CustomerManagement from "./pages/seller/CustomerManagement";
import DiscountManagement from "./pages/seller/DiscountManagement";
import ReportsAndAnalytics from "./pages/seller/ReportsAndAnalytics";
import Settings from "./pages/seller/Settings";
import TeamManagement from "./pages/seller/TeamManagement";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerDashboardContent from "./pages/customer/CustomerDashboardContent";
import AccountSettingsPageCustomer from "./pages/customer/AccountSettingsPage";
import AddressesPageCustomer from "./pages/customer/AddressesPage";
import CompareProductsPageCustomer from "./pages/customer/CompareProductsPage";
import DiscountPageCustomer from "./pages/customer/DiscountPage";
import LoyaltyPageCustomer from "./pages/customer/LoyaltyPage";
import NotificationsPageCustomer from  "./pages/customer/NotificationsPage";
import OrdersPageCustomer from "./pages/customer/OrdersPage";
import ReviewsPageCustomer from "./pages/customer/ReviewsPage";
import SupportPageCustomer from "./pages/customer/SupportPage";
import WalletPageCustomer from "./pages/customer/WalletPage";
import WishlistPageCustomer from "./pages/customer/WishlistPage";
import SellerRegister from "./pages/seller/SellerRegister";
import SellerLogin from "./pages/seller/SellerLogin";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import Shop from  "./pages/Shop";
import SubCategoryProducts from "./pages/SubCategoryProducts";
import ProductDetail from "./pages/ProductDetail";
import ShoppingCart from './pages/ShoppingCart';
import { CartProvider } from './contexts/CartContext';
import OrderDetails from "./pages/OrderDetails";
import { WishlistProvider } from './contexts/WishlistContext';

const App: React.FC = () => {
    const [user, setUser] = useState<string | null>(localStorage.getItem("user"));
    const [isSeller, setIsSeller] = useState<boolean>(localStorage.getItem("isSeller") === "true");

    return (
        <CartProvider>
            <WishlistProvider>
                <Routes>
                    <Route path="/" element={<Home user={user} setUser={setUser} isSeller={isSeller} setIsSeller={setIsSeller} />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/category/:id" element={<CategoryPage />} />
                    <Route path="/subcategory/:id" element={<SubCategoryPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogPostDetail />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/subcategory-products/:id" element={<SubCategoryProducts />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/shopping-cart" element={<ShoppingCart />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/orders" element={<OrderManagement />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/seller-register" element={<SellerRegister setIsSeller={setIsSeller} />} />
                    <Route path="/seller-login" element={<SellerLogin setIsSeller={setIsSeller} />} />
                    <Route path="/seller-dashboard" element={<SellerDashboard isSeller={isSeller} />}>
                        <Route index element={<DashboardContent />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="financial" element={<FinancialManagement />} />
                        <Route path="customers" element={<CustomerManagement />} />
                        <Route path="discounts" element={<DiscountManagement />} />
                        <Route path="reports" element={<ReportsAndAnalytics />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="team" element={<TeamManagement />} />
                    </Route>
                    <Route path="/customer-dashboard" element={<CustomerDashboard user={user} />}>
                        <Route index element={<CustomerDashboardContent />} />
                        <Route path="orders" element={<OrdersPageCustomer />} />
                        <Route path="addresses" element={<AddressesPageCustomer />} />
                        <Route path="wallet" element={<WalletPageCustomer />} />
                        <Route path="account-setting" element={<AccountSettingsPageCustomer />} />
                        <Route path="discount" element={<DiscountPageCustomer />} />
                        <Route path="support" element={<SupportPageCustomer />} />
                        <Route path="wishlist" element={<WishlistPageCustomer />} />
                        <Route path="reviews" element={<ReviewsPageCustomer />} />
                        <Route path="notifications" element={<NotificationsPageCustomer />} />
                        <Route path="loyalty" element={<LoyaltyPageCustomer />} />
                        <Route path="compare-products" element={<CompareProductsPageCustomer />} />
                    </Route>
                </Routes>
            </WishlistProvider>
        </CartProvider>
    );
};

export default App;