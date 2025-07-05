import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getSellersByProductId } from "../api/products";
import { motion, AnimatePresence, number } from "framer-motion";
import { FiStar, FiChevronLeft, FiShoppingCart, FiHeart, FiShare2, FiClock, FiCheckCircle, FiThumbsUp, FiThumbsDown, FiUser } from "react-icons/fi";
import IMG from "../assets/img.jpg";
import USER from "../assets/user.jpg";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { useWishlist } from '../contexts/WishlistContext';


interface UserData {
    id: number;
    username: string;
    email: string;
    phone: string;
    date_joined: string; 
}

interface Product {
  id: number;
  name: string;
  description: string;
  specifications: Record<string, string>;
  category: string;
  subcategory: string;
  images: string[];
  rating: number;
  reviewCount: number;
  sellers: Array<{
    seller_id: number;
    shop_name: string;
    price: number;
    stock: number;
    delivery_time: string;
    logo?: string;
    product_id: number;
    discount?: number;
  }>;
}

interface Seller {
  seller: {
    id: number;
    shop_name: string;
    phone: string;
    address: string;
    description: string;
    logo?: string;
    min_order_amount: number;
    is_active: boolean;
    shipping_methods: any[];
    payment_gateways: any[];
  };
  price: number;
  stock: number;
  product_id: number;
  is_own_product: number;
}

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  dislikes: number;
  avatar?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [stores, setStores] = useState<Seller[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [notification, setNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    user: 'کاربر مهمان'
  });
  const [userName, setUserName] = useState('کاربر مهمان');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const findStoreBySellerId = (sellerId: number) => {
    return stores.find(store => store.seller.id === sellerId)?.seller;
  };



    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                console.error("No access token found");
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/api/users/profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    const errText = await response.text();
                    console.error("Failed to fetch user data:", errText);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);


  useEffect(() => {
    const checkLoginStatus = () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
      if (token) {
        if (savedUser) setUser(savedUser);
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        setUserName(userData.first_name ? `${userData.first_name} ${userData.last_name}` : userData.username || 'کاربر');
      } else {
        setUserName('کاربر مهمان');
      }
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);


  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}/comments/`);
      const realReviews = await res.json();

      setReviews(realReviews.map((r: any) => ({
          id: r.id,
          user: `${r.user.first_name} ${r.user.last_name}` || r.user.username,
          rating: r.rating || 4,
          comment: r.text,
          date: new Date(r.created_at).toLocaleDateString("fa-IR"),
          likes: r.likes || 0,
          dislikes: r.dislikes || 0,
          avatar: r.user.profile_picture || '',
      })));
      setLoading(false);
    } catch (err) {
      setError('خطا در دریافت نظرات');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        if (id) {
          const productData = await getProductById(parseInt(id));
          setProduct(productData);

          const sellersData = await getSellersByProductId(parseInt(id));
          setStores(sellersData);

          await fetchComments();
        }
      } catch (err) {
        setError("خطا در دریافت اطلاعات محصول");
        console.error("Error fetching product data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    if (product) {
      setIsFavorite(isInWishlist(product.id));
    }
  }, [product, isInWishlist]);

  const handleToggleFavorite = () => {
    if (!product) return;

    const favData = {
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || IMG,
      description: product.description || "",
    };

    if (isFavorite) {
      removeFromWishlist(product.id);
      setIsFavorite(false);
    } else {
      addToWishlist(favData);
      setIsFavorite(true);
    }
  };

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({show: false, message: ''});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const handleAddToCart = (store: Seller) => {
      if (!product) return;

      if (store.is_own_product === userData?.id) {
          toast.error("شما نمی‌توانید محصول خود را سفارش دهید.");
          return;
      }

      if (isInCart(store.product_id, store.seller.id)) {
          toast.info("این محصول قبلاً در سبد خرید شما ثبت شده است", {
              position: "top-center",
              autoClose: 3000,
          });
          return;
      }

      if (store.stock <= 0) {
          toast.error("موجودی این محصول کافی نیست", {
              position: "top-center",
              autoClose: 3000,
          });
          return;
      }

      addToCart(store.product_id, store.seller?.id, store);

      setNotification({
          show: true,
          message: `${product.name} از ${store.seller.shop_name} به سبد خرید اضافه شد`
      });
  };


  const handlelog = () =>{
    navigate('/login');
  };


  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("ابتدا وارد حساب کاربری شوید");
      navigate('/login');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("لطفا نظر خود را وارد کنید");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}/comments/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: newReview.comment,
          rating: newReview.rating 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "خطا در ثبت نظر");
      }

      toast.success("نظر با موفقیت ثبت شد");
      const updated = await res.json();
      setReviews(prev => [
        {
          id: updated.id,
          user: userName,
          rating: newReview.rating,
          comment: newReview.comment,
          date: new Date().toLocaleDateString("fa-IR"),
          likes: 0,
          dislikes: 0,
          avatar: '',
        },
        ...prev
      ]);
      setNewReview({ rating: 5, comment: '', user: userName });
    } catch (err) {
      console.error(err);
      toast.error("ثبت نظر با مشکل مواجه شد");
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const renderRatingStars = (rating: number, size = 'md') => {
    const starSize = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`${starSize} ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-50"
      >
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-[#00296B] mb-4">{error}</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#00296B] hover:bg-[#00296B] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center mx-auto"
          >
            <FiChevronLeft className="ml-1" />
            بازگشت به صفحه قبل
          </button>
        </div>
      </motion.div>
    );
  }

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-50"
      >
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-[#00296B] mb-4">محصول یافت نشد</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#00296B]hover:bg-[#00296B] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center mx-auto"
          >
            <FiChevronLeft className="ml-1" />
            بازگشت به صفحه قبل
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-50 min-h-screen"
      style={{ direction: "rtl" }}
    >
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
              <FiCheckCircle className="ml-2" />
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-gray-600">
            <button
              onClick={() => navigate("/")}
              className="hover:text-[#00296B] transition-colors flex items-center"
            >
              <span>خانه</span>
            </button>
            {user && (<button
              onClick={() => navigate("/shopping-cart")}
              className="hover:text-[#00296B] transition-colors flex items-center"
            >
              <span className="mx-2 text-gray-400">/</span>
              <span>سبد خرید</span>
            </button>
            )}
            <span className="mx-2 text-gray-400">/</span>
            <button
              onClick={() => navigate(`/subcategory-products/${encodeURIComponent(product.subcategory)}`)}
              className="hover:text-[#00296B] transition-colors"
            >
              {product.subcategory}
            </button>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-[#00296B] font-medium truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-6">
              <div className="relative bg-gray-100 rounded-lg flex items-center justify-center h-96 mb-4 overflow-hidden">
                <motion.img
                  key={selectedImage}
                  src={product.images?.[selectedImage] || IMG}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = IMG;
                  }}
                />
                
                {user && (<button
                  onClick={handleToggleFavorite}
                  className={`absolute top-4 left-4 p-2 rounded-full ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-white text-gray-400'} shadow-md hover:shadow-lg transition-all`}
                >
                  <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden ${selectedImage === index ? 'border-[#00296B]' : 'border-transparent'}`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = IMG;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2 p-6 border-t lg:border-t-0 lg:border-r border-gray-100">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-2">
                  {renderStars(product.rating || 4)}
                </div>
                <span className="text-sm text-gray-500">({product.reviewCount || reviews.length.toLocaleString('fa-IR')} نظر)</span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center text-green-600 mb-2">
                  <FiCheckCircle className="ml-1" />
                  <span className="text-sm font-medium">موجود در انبار</span>
                </div>
                <p className="text-gray-600 text-sm">{product.description || "این محصول با کیفیت بالا و گارانتی اصالت کالا عرضه می‌شود."}</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">محدوده قیمت</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">از</span>
                  <div className="text-left">
                    <span className="text-lg font-bold text-[#00296B]">
                      {formatPrice(Math.min(...product.sellers.map(s => s.price)))}
                    </span>
                    <span className="text-sm text-gray-500 mr-1">تومان</span>
                  </div>
                  <span className="text-gray-500 text-sm">تا</span>
                  <div className="text-left">
                    <span className="text-lg font-bold text-[#00296B]">
                      {formatPrice(Math.max(...product.sellers.map(s => s.price)))}
                    </span>
                    <span className="text-sm text-gray-500 mr-1">تومان</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === "description" ? 'border-[#00296B] text-[#00296B]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                توضیحات محصول
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === "reviews" ? 'border-[#00296B] text-[#00296B]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                نظرات کاربران ({reviews.length.toLocaleString('fa-IR')})
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "description" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">توضیحات کامل محصول</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description || "این محصول با کیفیت بالا و مطابق با استانداردهای بین‌المللی تولید شده است. دارای گارانتی اصالت و سلامت فیزیکی کالا می‌باشد. طراحی ارگونومیک و کاربرپسند این محصول، تجربه‌ای لذت‌بخش را برای شما به ارمغان می‌آورد."}
                    </p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">ثبت نظر جدید</h3>

                      {isLoggedIn ? (
                        <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

                          <div className="mb-6">
                            <label htmlFor="comment" className="block text-gray-700 text-sm font-medium mb-3">نظر شما</label>
                            <textarea
                              id="comment"
                              rows={5}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00296B] focus:border-transparent transition-all"
                              placeholder="تجربه خود را از استفاده از این محصول با دیگران به اشتراک بگذارید..."
                              value={newReview.comment}
                              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                              required
                            ></textarea>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="bg-[#00296B] hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center"
                            >
                              ثبت نظر
                              <FiCheckCircle className="mr-2" />
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-lg flex flex-col items-center">
                          <FiUser className="w-10 h-10 mb-4" />
                          <h4 className="text-lg font-medium mb-2">برای ثبت نظر وارد شوید</h4>
                          <p className="text-sm mb-4">با ثبت نظر خود به دیگر کاربران کمک کنید</p>
                          <button 
                            onClick={() => navigate('/login', { state: { from: location.pathname } })}
                            className="bg-[#00296B] hover:bg-blue-900 text-white px-6 py-2 rounded-lg"
                          >
                            ورود به حساب کاربری
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-6">نظرات کاربران ({reviews.length.toLocaleString('fa-IR')})</h3>
                      
                      {reviews.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                          <div className="text-gray-400 mb-4">
                            <FiStar className="w-12 h-12 mx-auto" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-700 mb-2">هنوز نظری ثبت نشده است</h4>
                          <p className="text-gray-500">اولین نفری باشید که نظر می‌دهد!</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {reviews.map((review) => (
                            <motion.div 
                              key={review.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                            >
                              <div className="flex items-start mb-4">
                                <img 
                                  src={review.avatar || USER} 
                                  alt={review.user}
                                  className="rounded-full w-12 h-12 object-cover ml-4"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-800">{review.user}</h4>
                                    <span className="text-xs text-gray-500">{review.date}</span>
                                  </div>
                                  <div className="mt-1">
                                    {renderRatingStars(review.rating)}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 leading-relaxed mt-4">{review.comment}</p>

                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  فروشگاه‌های عرضه‌کننده این محصول
                </h2>
                <p className="text-sm text-gray-500 mt-1">بهترین قیمت‌ها از معتبرترین فروشگاه‌ها</p>
              </div>

              {!user && (
                <button
                  onClick={handlelog}
                  className="w-[200px] px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center bg-[#00296B] text-white hover:bg-blue-900"
                >
                  ورود به حساب کاربری
                </button>
              )}
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {stores.map((store) => (
              <motion.div
                key={`${store.product_id}-${store.seller.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center flex-1">
                    <img
                      src={store.seller.logo || IMG}
                      alt={store.seller.shop_name}
                      className="w-16 h-16 object-contain rounded-lg border border-gray-200 ml-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = IMG;
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{store.seller.shop_name}</h3>
                      <div className="flex items-center mt-1">
                        {renderStars(4)}
                        <span className="text-xs text-gray-500 mr-1">({(Math.floor(Math.random() * 50) + 10).toLocaleString('fa-IR')})</span>
                      </div>
                      <div className={`flex items-center text-xs mt-1 ${store.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {store.stock > 0 
                          ? `${store.stock.toLocaleString('fa-IR')} عدد در انبار موجود است`
                          : 'موجود نیست - به زودی'}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <FiClock className="ml-1" />
                        <span>تحویل: {"۲ تا ۳ روز کاری"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#00296B]">
                        {formatPrice(store.price)} تومان
                      </div>
                    </div>
                    {user && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(store);
                        }}
                        className={`w-[200px] px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                          store.stock > 0 && (store.is_own_product !== userData?.id)
                            ? isInCart(store.product_id, store.seller.id)
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-[#00296B] hover:bg-blue-900 text-white'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                        disabled={store.stock <= 0 || isInCart(store.product_id, store.seller.id) || (store.is_own_product === userData?.id)}
                      >
                        <FiShoppingCart className="ml-2" />
                        {store.is_own_product === userData?.id
                          ? 'محصول شما'
                          : store.stock > 0 
                            ? isInCart(store.product_id, store.seller.id)
                              ? 'اضافه شده به سبد'
                              : 'افزودن به سبد'
                            : 'ناموجود'}
                      </button>
                    )}
                  </div>
                </div>
                {(store.is_own_product === userData?.id) && (
                  <div className="text-xs text-red-500 mt-2">
                    شما به عنوان فروشنده این محصول نمی‌توانید آن را سفارش دهید.
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;