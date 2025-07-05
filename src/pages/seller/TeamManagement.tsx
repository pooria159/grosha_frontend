import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  FiUsers, 
  FiPlus, 
  FiTrash2, 
  FiToggleLeft, 
  FiToggleRight, 
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiUserPlus,
  FiUserX,
  FiUserCheck,
  FiUser
} from "react-icons/fi";

interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface Store {
  id: number;
  name: string;
  address: string;
}

interface StoreRole {
  id: number;
  user: User;
  store: Store;
  role: string;
  is_active: boolean;
  created_at: string;
}

const TeamManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [storeRoles, setStoreRoles] = useState<StoreRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState({
    user: "",
    role: "cashier",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  const getRoleName = (role: string): string => {
    const roleNames: Record<string, string> = {
      cashier: "صندوق دار",
      warehouse: "انباردار",
      support: "پشتیبان",
      manager: "مدیر فروشگاه",
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      cashier: "bg-blue-100 text-blue-800",
      warehouse: "bg-purple-100 text-purple-800",
      support: "bg-green-100 text-green-800",
      manager: "bg-yellow-100 text-yellow-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        
        if (!token) {
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const storeRes = await axios.get("http://localhost:8000/api/stores/", { headers });
        setStore(storeRes.data);

        if (storeRes.data) {
          await fetchStoreRoles(storeRes.data.id, headers);
        }

        const usersRes = await axios.get(
          `http://localhost:8000/api/users/search/?store_id=${storeRes.data?.id || ""}`,
          { headers }
        );
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("خطا در دریافت داده‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const fetchStoreRoles = async (storeId: number, headers: any) => {
    const rolesRes = await axios.get(
      `http://localhost:8000/api/store-roles/`,
      { headers }
    );
    setStoreRoles(rolesRes.data);
  };

  const handleAddRole = async () => {
    if (!newRole.user || !store) {
      toast.warning("لطفاً کاربر را انتخاب کنید");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        `http://localhost:8000/api/store-roles/create/`,
        {
          user: newRole.user,
          role: newRole.role,
        },
        { headers }
      );

      setStoreRoles([...storeRoles, response.data]);
      toast.success("نقش با موفقیت اضافه شد");

      const usersRes = await axios.get(
        `http://localhost:8000/api/users/search/?store_id=${store.id}`,
        { headers }
      );
      setUsers(usersRes.data);

      setNewRole({ user: "", role: "cashier" });
    } catch (error: any) {
      console.error("Error adding role:", error);
      toast.error(error.response?.data?.message || "خطا در اضافه کردن نقش");
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (!window.confirm("آیا از حذف این نقش مطمئن هستید؟")) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/store-roles/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStoreRoles(storeRoles.filter((role) => role.id !== id));
      toast.success("نقش با موفقیت حذف شد");

      const usersRes = await axios.get(
        `http://localhost:8000/api/users/search/?store_id=${store?.id || ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("خطا در حذف نقش");
    }
  };

  const toggleActiveStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.patch(
        `http://localhost:8000/api/store-roles/${id}/toggle-active/`,
        {},
        { headers }
      );

      setStoreRoles(
        storeRoles.map((role) =>
          role.id === id ? { ...role, is_active: !currentStatus } : role
        )
      );
      toast.success(`وضعیت نقش ${!currentStatus ? "فعال" : "غیرفعال"} شد`);
    } catch (error) {
      console.error("Error toggling role status:", error);
      toast.error("خطا در تغییر وضعیت نقش");
    }
  };

  const filteredRoles = storeRoles.filter(role => 
    role.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.user.first_name && role.user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (role.user.last_name && role.user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    role.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">شما هیچ فروشگاهی ندارید</h2>
          <p className="text-gray-600 mb-6">برای مدیریت تیم، ابتدا نیاز به ایجاد یک فروشگاه دارید</p>
          <button 
            onClick={() => navigate("/seller-register")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 flex items-center mx-auto"
          >
            <FiPlus className="ml-2" />
            ایجاد فروشگاه جدید
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6" style={{ direction: 'rtl' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <FiUsers className="ml-2 text-blue-600" size={28} />
            مدیریت تیم فروشگاه
          </h1>
          <p className="text-gray-500 mt-2">
            مدیریت کامل تیم فروشگاه اینترنتی خود را در این بخش انجام دهید
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              فروشگاه: {store.name}
            </h2>
            <p className="text-gray-600">
              آدرس: {store.address}
            </p>
          </div>
          
          <div className="w-full md:w-2/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">جستجو در اعضا</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="جستجو بر اساس نام، نام کاربری یا نقش..."
                className="block w-full p-2.5 pl-10 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiUserPlus className="ml-2 text-green-600" />
          افزودن عضو جدید به تیم
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">انتخاب کاربر</label>
            <select
              value={newRole.user}
              onChange={(e) => setNewRole({ ...newRole, user: e.target.value })}
              className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            >
              <option value="">کاربر را انتخاب کنید</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} {user.first_name && `(${user.first_name} ${user.last_name})`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نقش کاربر</label>
            <select
              value={newRole.role}
              onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
              className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            >
              <option value="cashier">صندوق دار</option>
              <option value="warehouse">انباردار</option>
              <option value="support">پشتیبان</option>
              <option value="manager">مدیر فروشگاه</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={handleAddRole} 
              disabled={!newRole.user}
              className={`flex items-center justify-center w-full py-2.5 px-4 rounded-lg transition duration-300 ${!newRole.user ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              <FiPlus className="ml-2" />
              افزودن به تیم
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiUsers className="ml-2 text-blue-600" />
            اعضای تیم فروشگاه
            <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
              {filteredRoles.length} نفر
            </span>
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredRoles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiUserX className="mx-auto text-4xl mb-3" />
              هیچ عضوی در این فروشگاه وجود ندارد
            </div>
          ) : (
            filteredRoles.map((role) => (
              <div key={role.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-3 mr-3">
                      <FiUser size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {role.user.first_name} {role.user.last_name}
                        <span className="text-gray-500 text-sm mr-2">{role.user.username}</span>
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(role.role)}`}>
                          {getRoleName(role.role)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full mr-2 ${role.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {role.is_active ? 'فعال' : 'غیرفعال'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button 
                      onClick={() => toggleActiveStatus(role.id, role.is_active)}
                      className={`flex items-center p-2 rounded-lg ${role.is_active ? 'bg-gray-100 hover:bg-gray-200' : 'bg-green-50 hover:bg-green-100'}`}
                      title={role.is_active ? 'غیرفعال کردن' : 'فعال کردن'}
                    >
                      {role.is_active ? (
                        <FiToggleLeft className="text-gray-600" size={20} />
                      ) : (
                        <FiToggleRight className="text-green-600" size={20} />
                      )}
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteRole(role.id)}
                      className="flex items-center p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                      title="حذف از تیم"
                    >
                      <FiTrash2 size={18} />
                    </button>
                    
                    <button 
                      onClick={() => setExpandedUser(expandedUser === role.id ? null : role.id)}
                      className="flex items-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      {expandedUser === role.id ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </div>
                
                {expandedUser === role.id && (
                  <div className="mt-4 pl-16 pr-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">ایمیل:</span> {role.user.email || '---'}
                    </div>
                    <div>
                      <span className="font-medium">تاریخ عضویت:</span> {new Date(role.created_at).toLocaleDateString('fa-IR')}
                    </div>
                    <div>
                      <span className="font-medium">وضعیت:</span> {role.is_active ? (
                        <span className="text-green-600">فعال</span>
                      ) : (
                        <span className="text-red-600">غیرفعال</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;