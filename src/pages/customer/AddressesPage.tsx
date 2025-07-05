import React, { useEffect, useState } from "react";
import { FiHome, FiBriefcase, FiMapPin, FiEdit2, FiTrash2, FiCheckCircle, FiPlus, FiXCircle } from "react-icons/fi";

interface Address {
  id: number;
  title: string;
  address_line: string;
  is_default: boolean;
  created_at: string;
}

const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const token = localStorage.getItem("access_token");

  const fetchAddresses = () => {
    fetch("http://localhost:8000/api/users/addresses/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(setAddresses)
      .catch(err => {
        console.error("Error fetching addresses:", err);
        setErrorMessage("خطا در دریافت آدرس‌ها.");
      });
  };

  useEffect(() => {
    if (!token) {
      setErrorMessage("لطفاً ابتدا وارد حساب خود شوید.");
      return;
    }
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setNewTitle('');
    setNewAddress('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = () => {
    if (!newAddress.trim() || !newTitle.trim()) {
      setErrorMessage("عنوان و آدرس نمی‌توانند خالی باشند.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId 
      ? `http://localhost:8000/api/users/addresses/${editingId}/`
      : "http://localhost:8000/api/users/addresses/";

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newTitle,
        address_line: newAddress,
        is_default: addresses.length === 0 && !editingId
      })
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => {
        if (editingId) {
          setAddresses(prev => prev.map(a => (a.id === data.id ? data : a)));
          setSuccessMessage("آدرس با موفقیت به‌روزرسانی شد.");
        } else {
          setAddresses(prev => [...prev, data]);
          setSuccessMessage("آدرس با موفقیت اضافه شد.");
        }
        resetForm();
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(err => {
        console.error(editingId ? "Error updating address:" : "Error adding address:", err);
        setErrorMessage(editingId ? "به‌روزرسانی آدرس انجام نشد." : "ثبت آدرس انجام نشد.");
      });
  };

  const handleEdit = (id: number) => {
    const address = addresses.find(a => a.id === id);
    if (address) {
      setNewTitle(address.title);
      setNewAddress(address.address_line);
      setEditingId(id);
      setIsFormOpen(true);
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("آیا از حذف این آدرس مطمئن هستید؟")) return;

    fetch(`http://localhost:8000/api/users/addresses/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) {
          setAddresses(prev => prev.filter(a => a.id !== id));
          setSuccessMessage("آدرس حذف شد.");
          setErrorMessage('');
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          return res.text().then(text => {
            throw new Error(text);
          });
        }
      })
      .catch(err => {
        console.error("Error deleting address:", err);
        setErrorMessage("حذف آدرس انجام نشد.");
      });
  };

  const setAsDefault = (id: number) => {
    fetch(`http://localhost:8000/api/users/addresses/${id}/set_default/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(updated => {
        setAddresses(prev =>
          prev.map(a => ({
            ...a,
            is_default: a.id === updated.id
          }))
        );
        setSuccessMessage("آدرس پیش‌فرض تغییر کرد.");
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(err => {
        console.error("Error setting default address:", err);
        setErrorMessage("تغییر آدرس پیش‌فرض انجام نشد.");
      });
  };

  const getAddressIcon = (title: string) => {
    if (title.includes('خانه') || title.includes('منزل')) return <FiHome className="text-blue-500" />;
    if (title.includes('کار') || title.includes('دفتر')) return <FiBriefcase className="text-green-500" />;
    return <FiMapPin className="text-purple-500" />;
  };

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen p-4 md:p-8" style={{ direction: 'rtl' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] flex items-center justify-center">
            <FiMapPin className="ml-2 text-[#00509D]" size={32} />
            مدیریت آدرس‌ها
          </h1>
          <p className="text-[#64748b] mt-3">آدرس‌های خود را مدیریت و سازماندهی کنید</p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FiCheckCircle className="ml-2" size={20} />
              <p>{successMessage}</p>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FiXCircle className="ml-2" size={20} />
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <div className={`bg-white rounded-2xl shadow-sm overflow-hidden mb-8 transition-all duration-300 ${isFormOpen ? 'border border-blue-200' : 'border border-transparent'}`}>
          <div 
            className={`p-5 cursor-pointer flex justify-between items-center ${isFormOpen ? 'border-b border-gray-200' : ''}`}
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            <h3 className="font-bold text-lg text-[#1e293b] flex items-center">
              <FiPlus className="ml-2" />
              {editingId ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
            </h3>
            <div className={`transform transition-transform ${isFormOpen ? 'rotate-45' : ''}`}>
              <FiPlus />
            </div>
          </div>

          {isFormOpen && (
            <div className="p-5 pt-0">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">عنوان آدرس</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="مثال: خانه، محل کار، ویلا"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">نشانی کامل</label>
                <textarea
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  placeholder="نشانی دقیق به همراه کد پستی و توضیحات لازم"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="bg-[#00509D] hover:bg-[#003F7D] text-white px-6 py-2 rounded-lg font-medium transition duration-300 flex items-center"
                >
                  {editingId ? 'ذخیره تغییرات' : 'افزودن آدرس'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition duration-300"
                >
                  انصراف
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <FiMapPin className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">هنوز آدرسی ثبت نکرده‌اید</h3>
              <p className="text-gray-500 mt-2">برای افزودن آدرس جدید روی دکمه بالا کلیک کنید</p>
            </div>
          ) : (
            addresses.map(addr => (
              <div
                key={addr.id}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${
                  addr.is_default ? 'border-2 border-green-500' : 'border border-gray-200'
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${addr.is_default ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {getAddressIcon(addr.title)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-gray-800">{addr.title}</h3>
                          {addr.is_default && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              پیش‌فرض
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-2">{addr.address_line}</p>
                        <p className="text-sm text-gray-400 mt-3">
                          ثبت شده در {new Date(addr.created_at).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
                    {!addr.is_default && (
                      <button
                        onClick={() => setAsDefault(addr.id)}
                        className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 flex items-center gap-1"
                      >
                        <FiCheckCircle size={16} />
                        انتخاب به عنوان پیش‌فرض
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(addr.id)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 flex items-center gap-1"
                    >
                      <FiEdit2 size={16} />
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 flex items-center gap-1"
                    >
                      <FiTrash2 size={16} />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;