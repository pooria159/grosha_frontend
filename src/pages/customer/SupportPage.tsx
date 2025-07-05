import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSync, FaTimes, FaUserShield, FaUser, FaPaperclip, FaTicketAlt } from "react-icons/fa";
import { BsFillSendFill, BsQuestionCircleFill } from "react-icons/bs";
import { FiMessageSquare } from "react-icons/fi";

interface User {
  id: number;
  username: string;
  is_staff: boolean;
  first_name: string;
  last_name: string;
}

interface TicketReply {
  id: number;
  user: User | null;
  message: string;
  is_staff_reply: boolean;
  created_at: string;
  updated_at: string;
}

interface Ticket {
  id: number;
  user: User;
  subject: string;
  message: string;
  status: string;
  status_display: string | null;
  priority: string;
  priority_display: string;
  category: string;
  category_display: string;
  order_id: string | null;
  admin_notes: string | null;
  replies: TicketReply[];
  created_at: string;
  updated_at: string;
}

const SupportPage: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("technical");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState({
    fetching: false,
    submitting: false,
    replying: false,
    updatingStatus: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('fa-IR');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 10));
  };

  const fetchTickets = async () => {
    const token = localStorage.getItem("access_token");
    try {
      addLog("دریافت تیکت‌ها از سرور");
      setLoading(prev => ({ ...prev, fetching: true }));

      const res = await axios.get("http://localhost:8000/api/tickets/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(res.data.results);
      addLog(`دریافت ${res.data.results.length} تیکت با موفقیت انجام شد`);
    } catch (err) {
      handleError(err, "دریافت تیکت‌ها");
    } finally {
      setLoading(prev => ({ ...prev, fetching: false }));
    }
  };

  const handleError = (err: any, action: string) => {
    const errorMessage = axios.isAxiosError(err)
      ? err.response?.data?.message || "خطای نامشخص"
      : "خطا در ارتباط با سرور";

    setError(`خطا در ${action}: ${errorMessage}`);
    addLog(`خطا در ${action}: ${errorMessage}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!subject.trim() || !message.trim()) {
      setError("لطفاً موضوع و متن پیام را وارد کنید");
      addLog("ارسال تیکت ناموفق: فیلدهای الزامی پر نشده‌اند");
      return;
    }

    try {
      addLog("شروع ارسال تیکت جدید");
      setLoading(prev => ({ ...prev, submitting: true }));

      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('category', category);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const response = await axios.post(
        "http://localhost:8000/api/tickets/",
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      setSubject("");
      setMessage("");
      setCategory("technical");
      setAttachment(null);
      setError("");
      setSuccess("تیکت با موفقیت ارسال شد");
      addLog(`تیکت با شناسه ${response.data.id} با موفقیت ارسال شد`);

      await fetchTickets();
    } catch (err) {
      handleError(err, "ارسال تیکت");
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!replyMessage.trim() || !selectedTicket) {
      setError("لطفاً متن پاسخ را وارد کنید");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, replying: true }));
      addLog(`شروع ارسال پاسخ به تیکت ${selectedTicket.id}`);

      const formData = new FormData();
      formData.append('message', replyMessage);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      await axios.post(
        `http://localhost:8000/api/tickets/${selectedTicket.id}/reply/`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      const updatedTicketResponse = await axios.get(
        `http://localhost:8000/api/tickets/${selectedTicket.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelectedTicket(updatedTicketResponse.data);
      setTickets(tickets.map(t => t.id === updatedTicketResponse.data.id ? updatedTicketResponse.data : t));

      setReplyMessage("");
      setAttachment(null);
      setSuccess("پاسخ با موفقیت ارسال شد");
      addLog(`پاسخ به تیکت ${selectedTicket.id} ارسال شد`);
      
    } catch (err) {
      handleError(err, "ارسال پاسخ");
    } finally {
      setLoading(prev => ({ ...prev, replying: false }));
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const updateTicketStatus = async (ticketId: number, status: string) => {
    const token = localStorage.getItem("access_token");
    try {
      setLoading(prev => ({ ...prev, updatingStatus: true }));
      addLog(`به‌روزرسانی وضعیت تیکت ${ticketId} به ${status}`);

      await axios.patch(
        `http://localhost:8000/api/tickets/${ticketId}/`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("وضعیت تیکت با موفقیت به‌روزرسانی شد");
      addLog(`وضعیت تیکت ${ticketId} با موفقیت به‌روزرسانی شد`);
      await fetchTickets();

      if (selectedTicket && selectedTicket.id === ticketId) {
        const updatedTicketResponse = await axios.get(
          `http://localhost:8000/api/tickets/${ticketId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSelectedTicket(updatedTicketResponse.data);
      }
    } catch (err) {
      handleError(err, "به‌روزرسانی وضعیت تیکت");
    } finally {
      setLoading(prev => ({ ...prev, updatingStatus: false }));
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'answered': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'financial': return 'bg-blue-100 text-blue-800';
      case 'order': return 'bg-orange-100 text-orange-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserDisplayName = (user: User | null) => {
    if (!user) {
      return "سیستم";
    }
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username;
  };

  useEffect(() => {
    addLog("کامپوننت صفحه پشتیبانی بارگذاری شد");
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      setNewStatus(selectedTicket.status);
    }
  }, [selectedTicket]);

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] min-h-screen p-4 md:p-8" style={{ direction: 'rtl' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] flex items-center justify-center">
            <FiMessageSquare className="ml-2 text-[#3b82f6]" size={32} />
            پشتیبانی آنلاین
          </h1>
          <p className="text-[#64748b] mt-3 max-w-2xl mx-auto">
            در این بخش می‌توانید تیکت‌های پشتیبانی خود را ایجاد و پیگیری کنید
          </p>
        </div>

        <div className="fixed top-4 right-4 left-4 md:left-auto max-w-md mx-auto z-50">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-sm flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-red-700 hover:text-red-900">
                <FaTimes />
              </button>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl shadow-sm flex justify-between items-center">
              <span>{success}</span>
              <button onClick={() => setSuccess("")} className="text-green-700 hover:text-green-900">
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-[#3b82f6]">
              <h2 className="text-xl font-bold text-[#1e293b] mb-4 flex items-center">
                <BsFillSendFill className="ml-2 text-[#3b82f6]" size={20} />
                ایجاد تیکت جدید
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">موضوع</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={loading.submitting}
                    placeholder="موضوع تیکت خود را وارد کنید"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">دسته‌بندی</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading.submitting}
                  >
                    <option value="technical">فنی</option>
                    <option value="financial">مالی</option>
                    <option value="order">سفارش</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">پیام</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading.submitting}
                    placeholder="متن کامل تیکت خود را وارد کنید"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    پیوست (اختیاری)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center">
                      <FaPaperclip className="text-gray-500 mb-2" size={24} />
                      <p className="text-sm text-gray-500">
                        {attachment ? attachment.name : 'فایل خود را اینجا رها کنید یا برای انتخاب کلیک کنید'}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af] text-white px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center w-full shadow-md"
                  disabled={loading.submitting}
                >
                  {loading.submitting ? (
                    <>
                      <FaSync className="animate-spin ml-2" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <BsFillSendFill className="ml-2" />
                      ارسال تیکت
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-4 flex items-center">
                <BsQuestionCircleFill className="ml-2 text-[#3b82f6]" size={20} />
                راهنمای پشتیبانی
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">دسته‌بندی فنی</h3>
                  <p className="text-sm text-blue-700">مشکلات مربوط به سایت، اپلیکیشن و فناوری</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-purple-800 mb-2">دسته‌بندی مالی</h3>
                  <p className="text-sm text-purple-700">مشکلات پرداخت، استرداد وجه و تراکنش‌ها</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-medium text-orange-800 mb-2">دسته‌بندی سفارش</h3>
                  <p className="text-sm text-orange-700">پیگیری سفارشات، مرجوعی و مشکلات ارسال</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">سایر موارد</h3>
                  <p className="text-sm text-gray-700">سوالات عمومی و سایر درخواست‌های شما</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#1e293b] flex items-center">
                <FaTicketAlt className="ml-2 text-[#3b82f6]" size={20} />
                تیکت‌های من
              </h2>
              <button
                onClick={fetchTickets}
                disabled={loading.fetching}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-xl flex items-center transition-colors"
              >
                {loading.fetching ? (
                  <FaSync className="animate-spin ml-1" />
                ) : (
                  <FaSync className="ml-1" />
                )}
                بروزرسانی
              </button>
            </div>

            {loading.fetching && tickets.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3b82f6]"></div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>هیچ تیکتی یافت نشد</p>
                <p className="text-sm mt-2">می‌توانید تیکت جدید ارسال کنید</p>
              </div>
            ) : (
              <div className="space-y-3" style={{ maxHeight: "600px", overflowY: "auto" }}>
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all ${selectedTicket?.id === ticket.id ? 'ring-2 ring-[#3b82f6]' : ''} ${ticket.status === 'closed' ? 'bg-gray-50 opacity-90' : 'bg-white'}`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800">
                        #{ticket.id} - {ticket.subject}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status_display}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)} mr-2`}>
                        {ticket.priority_display}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(ticket.category)}`}>
                        {ticket.category_display}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                      <span>تاریخ ایجاد: {new Date(ticket.created_at).toLocaleString('fa-IR')}</span>
                      <span className="flex items-center">
                        {ticket.replies.length}
                        <FiMessageSquare className="mr-1" size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="border-b p-4 flex justify-between items-center bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold">
                  تیکت #{selectedTicket.id}: {selectedTicket.subject}
                </h3>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full bg-white/20 mr-2`}>
                    {selectedTicket.status_display}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-white/20 mr-2`}>
                    {selectedTicket.priority_display}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-white/20`}>
                    {selectedTicket.category_display}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/10"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-grow">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                      {selectedTicket.user?.is_staff ? (
                        <FaUserShield size={16} />
                      ) : (
                        <FaUser size={16} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{getUserDisplayName(selectedTicket.user)}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(selectedTicket.created_at).toLocaleString('fa-IR')}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    پیام اصلی
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
                  <p className="whitespace-pre-line text-gray-800">{selectedTicket.message}</p>
                </div>
              </div>

              <div className="space-y-6">
              {selectedTicket.replies.map((reply) => (
                <div 
                  key={reply.id} 
                  className={`${reply.is_staff_reply || !reply.user ? 'pr-6' : 'pl-6'}`}
                >
                  <div className={`flex items-center justify-between mb-3 ${reply.is_staff_reply || !reply.user ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center">
                      <div className={`${reply.is_staff_reply || !reply.user ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} w-8 h-8 rounded-full flex items-center justify-center mr-2`}>
                        {reply.is_staff_reply || !reply.user ? (
                          <FaUserShield size={16} />
                        ) : (
                          <FaUser size={16} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{getUserDisplayName(reply.user)}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.created_at).toLocaleString('fa-IR')}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${reply.is_staff_reply || !reply.user ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {reply.is_staff_reply || !reply.user ? 'پاسخ پشتیبانی' : 'پاسخ کاربر'}
                    </span>
                  </div>
                  <div className={`p-4 rounded-lg border mt-2 ${reply.is_staff_reply || !reply.user ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                    <p className="whitespace-pre-line text-gray-800">{reply.message}</p>
                  </div>
                </div>
              ))}
              </div>
            </div>

            <div className="border-t p-4 bg-gray-50 rounded-b-2xl">
              {selectedTicket.user?.is_staff && (
                <div className="mb-4 flex items-center">
                  <label className="block text-sm font-medium text-gray-700 ml-3">تغییر وضعیت:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => {
                      setNewStatus(e.target.value);
                      updateTicketStatus(selectedTicket.id, e.target.value);
                    }}
                    disabled={loading.updatingStatus}
                    className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-[#3b82f6] focus:border-blue-500"
                  >
                    <option value="open">باز</option>
                    <option value="in_progress">در حال بررسی</option>
                    <option value="answered">پاسخ داده شده</option>
                    <option value="closed">بسته شده</option>
                  </select>
                  {loading.updatingStatus && (
                    <FaSync className="animate-spin ml-2 text-blue-500" />
                  )}
                </div>
              )}

              <form onSubmit={handleReplySubmit}>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">پاسخ شما</label>
                  <textarea
                    className={`w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent ${selectedTicket.status === 'closed' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    rows={3}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    disabled={loading.replying || selectedTicket.status === 'closed'}
                    placeholder={selectedTicket.status === 'closed' ? 'این تیکت بسته شده و امکان ارسال پاسخ وجود ندارد' : 'متن پاسخ خود را وارد کنید...'}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                        disabled={selectedTicket.status === 'closed'}
                      />
                      <span className={`p-2 rounded-lg ${selectedTicket.status === 'closed' ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <FaPaperclip size={18} />
                      </span>
                    </label>
                    {attachment && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg mr-2">
                        {attachment.name}
                        <button 
                          onClick={() => setAttachment(null)} 
                          className="text-gray-500 hover:text-gray-700 mr-1"
                        >
                          <FaTimes size={12} />
                        </button>
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={`${selectedTicket.status === 'closed' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af]'} text-white px-6 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center shadow-md`}
                    disabled={loading.replying || !replyMessage.trim() || selectedTicket.status === 'closed'}
                  >
                    {loading.replying ? (
                      <>
                        <FaSync className="animate-spin ml-2" />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <BsFillSendFill className="ml-2" />
                        {selectedTicket.status === 'closed' ? 'تیکت بسته شده' : 'ارسال پاسخ'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;