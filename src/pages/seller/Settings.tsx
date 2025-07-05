import React, { useState, useEffect, useRef } from "react";
import { 
  FiSettings, FiShoppingBag, FiTruck, FiCreditCard, 
  FiSave, FiUpload, FiInfo, FiPlus, FiX 
} from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IMG from '../../assets/user.jpg';

interface ShippingMethod {
  id: number;
  name: string;
}

interface PaymentGateway {
  id: number;
  name: string;
}

interface ShopSettings {
  id?: number;
  shop_name: string;
  logo: string | File | null;
  logoPreview?: string;
  phone: string;
  address: string;
  description: string;
  min_order_amount: number;
  is_active: boolean;
  shipping_methods: ShippingMethod[];
  payment_gateways: PaymentGateway[];
}

const toastConfig = {
  position: "top-right" as ToastPosition,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  rtl: true,
  theme: "light" as const,
};

const emptyLogo = "";
const Settings: React.FC = () => {
  const [shopSettings, setShopSettings] = useState<ShopSettings>({
    shop_name: "",
    logo: null,
    phone: "",
    address: "",
    description: "",
    min_order_amount: 100000,
    is_active: true,
    shipping_methods: [],
    payment_gateways: []
  });

  const [newShippingMethod, setNewShippingMethod] = useState("");
  const [newPaymentGateway, setNewPaymentGateway] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAuthHeaders = () => {
    const access_token = localStorage.getItem('access_token');
    return {
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
      }
    };
  };

  const getAuthHeadersFormData = () => {
    const access_token = localStorage.getItem("access_token");
    return {
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "multipart/form-data",
      }
    };
  };

  useEffect(() => {
    fetchShopSettings();
    return () => {
      if (shopSettings.logoPreview) {
        URL.revokeObjectURL(shopSettings.logoPreview);
      }
    };
  }, []);

  const fetchShopSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8000/api/sellers/settings/", getAuthHeaders());
      
      const data = response.data || {};
      setShopSettings({
        shop_name: data.shop_name || "",
        logo: data.logo || null,
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        min_order_amount: data.min_order_amount || 100000,
        is_active: data.is_active !== undefined ? data.is_active : true,
        shipping_methods: data.shipping_methods || [],
        payment_gateways: data.payment_gateways || []
      });
    } catch (error) {
      console.error("Error fetching shop settings:", error);
      toast.error("خطا در دریافت تنظیمات فروشگاه", toastConfig);
    } finally {
      setIsLoading(false);
    }
  };

  const getLogoUrl = () => {
    if (shopSettings.logoPreview) {
      return shopSettings.logoPreview;
    }
    
    if (typeof shopSettings.logo === 'string' && shopSettings.logo) {
      return shopSettings.logo.includes('http') 
        ? `${shopSettings.logo}?t=${new Date().getTime()}`
        : shopSettings.logo;
    }
    
    return emptyLogo;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShopSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setShopSettings(prev => ({ ...prev, [name]: numValue }));
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (shopSettings.logoPreview) {
        URL.revokeObjectURL(shopSettings.logoPreview);
      }

      if (!file.type.match('image.*')) {
        toast.error("لطفا فقط تصویر آپلود کنید", toastConfig);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("حجم تصویر نباید بیشتر از 2 مگابایت باشد", toastConfig);
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      setShopSettings(prev => ({ 
        ...prev, 
        logo: file,
        logoPreview: previewUrl
      }));

      resetFileInput();
      toast.success("تصویر با موفقیت انتخاب شد", toastConfig);
    }
  };

  const removeLogo = () => {
    if (shopSettings.logoPreview) {
      URL.revokeObjectURL(shopSettings.logoPreview);
    }
    setShopSettings(prev => ({ ...prev, logo: null, logoPreview: undefined }));
    resetFileInput();
    toast.info("تصویر لوگو حذف شد", toastConfig);
  };


  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };
  

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();

      if (shopSettings.logo instanceof File) {
        formData.append("logo", shopSettings.logo);
      }

      formData.append("shop_name", shopSettings.shop_name);
      formData.append("phone", shopSettings.phone);
      formData.append("address", shopSettings.address);
      formData.append("description", shopSettings.description);
      formData.append("min_order_amount", shopSettings.min_order_amount.toString());
      formData.append("is_active", shopSettings.is_active.toString());

      const response = await axios.put(
        "http://localhost:8000/api/sellers/settings/",
        formData,
        {
          ...getAuthHeadersFormData(),
          headers: {
            ...getAuthHeadersFormData().headers,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      toast.success("تنظیمات با موفقیت ذخیره شد!", toastConfig);
      await fetchShopSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("خطا در ذخیره تنظیمات", toastConfig);
    } finally {
      setIsSaving(false);
    }
  };



  const toggleShopStatus = () => {
    setShopSettings(prev => ({ ...prev, is_active: !prev.is_active }));
  };

  const addShippingMethod = async () => {
    if (!newShippingMethod.trim()) {
      toast.warning("لطفا نام روش ارسال را وارد کنید", toastConfig);
      return;
    }

    const isDuplicate = shopSettings.shipping_methods.some(
      method => method.name.toLowerCase() === newShippingMethod.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.warning("این روش ارسال قبلاً ثبت شده است", toastConfig);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/sellers/shipping-methods/", {
        name: newShippingMethod.trim()
      }, getAuthHeaders());

      setShopSettings(prev => ({
        ...prev,
        shipping_methods: [...prev.shipping_methods, response.data]
      }));
      setNewShippingMethod("");
      toast.success("روش ارسال با موفقیت اضافه شد", toastConfig);
    } catch (error) {
      console.error("Error adding shipping method:", error);
      toast.error("خطا در افزودن روش ارسال", toastConfig);
    }
  };

  const removeShippingMethod = async (id: number) => {
    try {
      if (shopSettings.shipping_methods.length <= 1) {
        toast.warning("حداقل باید یک روش ارسال وجود داشته باشد", toastConfig);
        return;
      }

      await axios.delete(`http://localhost:8000/api/sellers/shipping-methods/${id}/`, getAuthHeaders());
      setShopSettings(prev => ({
        ...prev,
        shipping_methods: prev.shipping_methods.filter(method => method.id !== id)
      }));
      toast.success("روش ارسال با موفقیت حذف شد", toastConfig);
    } catch (error) {
      console.error("Error removing shipping method:", error);
      toast.error("خطا در حذف روش ارسال", toastConfig);
    }
  };

  const addPaymentGateway = async () => {
    if (!newPaymentGateway.trim()) {
      toast.warning("لطفا نام درگاه پرداخت را وارد کنید", toastConfig);
      return;
    }

    const isDuplicate = shopSettings.payment_gateways.some(
      gateway => gateway.name.toLowerCase() === newPaymentGateway.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.warning("این درگاه پرداخت قبلاً ثبت شده است", toastConfig);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/sellers/payment-gateways/", {
        name: newPaymentGateway.trim()
      }, getAuthHeaders());

      setShopSettings(prev => ({
        ...prev,
        payment_gateways: [...prev.payment_gateways, response.data]
      }));
      setNewPaymentGateway("");
      toast.success("درگاه پرداخت با موفقیت اضافه شد", toastConfig);
    } catch (error) {
      console.error("Error adding payment gateway:", error);
      toast.error("خطا در افزودن درگاه پرداخت", toastConfig);
    }
  };

  const removePaymentGateway = async (id: number) => {
    try {
      if (shopSettings.payment_gateways.length <= 1) {
        toast.warning("حداقل باید یک درگاه پرداخت وجود داشته باشد", toastConfig);
        return;
      }

      await axios.delete(`http://localhost:8000/api/sellers/payment-gateways/${id}/`, getAuthHeaders());
      setShopSettings(prev => ({
        ...prev,
        payment_gateways: prev.payment_gateways.filter(gateway => gateway.id !== id)
      }));
      toast.success("درگاه پرداخت با موفقیت حذف شد", toastConfig);
    } catch (error) {
      console.error("Error removing payment gateway:", error);
      toast.error("خطا در حذف درگاه پرداخت", toastConfig);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00509D]"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6" style={{ direction: 'rtl' }}>
      <ToastContainer {...toastConfig} />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FiSettings className="ml-2 text-indigo-600" size={28} />
              تنظیمات فروشگاه
            </h1>
            <p className="text-gray-500 mt-2">
              مدیریت کامل تنظیمات و ویژگی‌های فروشگاه اینترنتی خود را در این بخش انجام دهید
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-[#00509D]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1e293b] flex items-center">
                  <FiShoppingBag className="ml-2 text-[#00509D]" size={20} />
                  اطلاعات فروشگاه
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">نام فروشگاه <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="shop_name"
                    value={shopSettings.shop_name}
                    onChange={handleChange}
                    className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#00509D] focus:border-transparent text-[#334155]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">تلفن <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="phone"
                    value={shopSettings.phone}
                    onChange={handleChange}
                    className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#00509D] focus:border-transparent text-[#334155]"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#334155] mb-3">لوگو فروشگاه</label>
                  <div className="flex flex-col items-start space-y-4">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-white">
                        <img 
                          src={getLogoUrl()}
                          alt="لوگو فروشگاه" 
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = IMG;
                            target.onerror = null; 
                          }}
                        />
                      </div>
                      {(shopSettings.logo || shopSettings.logoPreview) && (
                        <button
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
                          title="حذف لوگو"
                        >
                          <FiX size={14} />
                        </button>
                      )}
                    </div>

                    <label className="relative cursor-pointer">
                      <div className="flex items-center justify-center px-4 py-2 bg-[#00509D] text-white rounded-lg hover:bg-[#003F7D] transition-colors">
                        <FiUpload className="ml-2" />
                        <span>{shopSettings.logo || shopSettings.logoPreview ? 'تغییر لوگو' : 'آپلود لوگو'}</span>
                      </div>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        onChange={handleLogoUpload}
                        accept="image/*"
                      />
                    </label>
                    <p className="text-xs text-gray-500">
                      فرمت‌های مجاز: JPG, PNG, SVG (حداکثر 2MB)
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#334155] mb-1">آدرس فروشگاه <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="address"
                    value={shopSettings.address}
                    onChange={handleChange}
                    className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#00509D] focus:border-transparent text-[#334155]"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#334155] mb-1">توضیحات فروشگاه</label>
                  <textarea
                    name="description"
                    value={shopSettings.description}
                    onChange={handleChange}
                    className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#00509D] focus:border-transparent text-[#334155]"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{shopSettings.description.length}/500 کاراکتر</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-4">
                <FiTruck className="ml-2 text-[#00509D]" size={20} />
                روش‌های ارسال
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {shopSettings.shipping_methods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-sm font-medium text-[#334155]">
                      {method.name}
                    </span>
                    <button
                      onClick={() => removeShippingMethod(method.id)}
                      className="text-red-500 hover:text-red-700"
                      title="حذف"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200 border-dashed">
                  <input 
                    type="text" 
                    placeholder="روش جدید..." 
                    className="bg-transparent w-full focus:outline-none text-sm text-[#64748b]"
                    value={newShippingMethod}
                    onChange={(e) => setNewShippingMethod(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addShippingMethod()}
                  />
                  <button 
                    className="text-[#00509D] hover:text-[#003F7D] text-sm font-medium"
                    onClick={addShippingMethod}
                    disabled={!newShippingMethod.trim()}
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-4">
                <FiCreditCard className="ml-2 text-[#00509D]" size={20} />
                درگاه‌های پرداخت
              </h2>
              <div className="space-y-3">
                {shopSettings.payment_gateways.map((gateway) => (
                  <div key={gateway.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-sm font-medium text-[#334155]">
                      {gateway.name}
                    </span>
                    <button
                      onClick={() => removePaymentGateway(gateway.id)}
                      className="text-red-500 hover:text-red-700"
                      title="حذف"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200 border-dashed">
                  <input 
                    type="text" 
                    placeholder="درگاه جدید..." 
                    className="bg-transparent w-full focus:outline-none text-sm text-[#64748b]"
                    value={newPaymentGateway}
                    onChange={(e) => setNewPaymentGateway(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPaymentGateway()}
                  />
                  <button 
                    className="text-[#00509D] hover:text-[#003F7D] text-sm font-medium"
                    onClick={addPaymentGateway}
                    disabled={!newPaymentGateway.trim()}
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e293b] flex items-center mb-4">
                <FiInfo className="ml-2 text-[#00509D]" size={20} />
                حداقل مبلغ سفارش
              </h2>
              <div className="relative">
                <input
                  type="number"
                  name="min_order_amount"
                  value={shopSettings.min_order_amount}
                  onChange={handleNumberChange}
                  min="0"
                  className="p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#00509D] focus:border-transparent text-[#334155] pl-12"
                />
                <span className="absolute left-3 top-2.5 text-[#64748b]">تومان</span>
              </div>
              <p className="text-xs text-[#64748b] mt-2">
                سفارش‌هایی با مبلغ کمتر از این مقدار قابل پردازش نخواهند بود
              </p>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSaving || !shopSettings.shop_name || !shopSettings.phone || !shopSettings.address}
              className="w-full flex items-center justify-center bg-gradient-to-r from-[#00509D] to-[#003F7D] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال ذخیره...
                </span>
              ) : (
                <>
                  <FiSave className="ml-2" />
                  ذخیره تنظیمات
                </>
              )}
            </button>

            <div className="bg-[#fffbeb] border border-[#fcd34d] rounded-2xl p-4">
              <h3 className="font-medium text-[#92400e] mb-2">نکات مهم</h3>
              <ul className="text-sm text-[#92400e] space-y-2">
                <li className="flex items-start">
                  <span className="text-[#d97706] mr-2">•</span>
                  <span>تغییرات پس از ذخیره تنظیمات اعمال خواهند شد</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d97706] mr-2">•</span>
                  <span>در صورت غیرفعال کردن فروشگاه، کاربران قادر به مشاهده آن نخواهند بود</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d97706] mr-2">•</span>
                  <span>حداقل باید یک روش ارسال و یک درگاه پرداخت وجود داشته باشد</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d97706] mr-2">•</span>
                  <span>فیلدهای ستاره‌دار الزامی هستند</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d97706] mr-2">•</span>
                  <span>امکان ثبت روش ارسال یا درگاه پرداخت تکراری وجود ندارد</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;