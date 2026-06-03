import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Package, Truck, ChevronRight, Ban, Clock, CheckCircle2, Box } from 'lucide-react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';

const StatusBadge = ({ status }) => {
  const styles = {
    'New': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    'Confirmed': 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30',
    'Preparing': 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
    'Shipping': 'bg-purple-500/20 text-purple-600 border-purple-500/30',
    'Delivered': 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
    'Canceled': 'bg-red-500/20 text-red-600 border-red-500/30',
    'Cancel Requested': 'bg-rose-500/20 text-rose-600 border-rose-500/30',
  };
  
  const icons = {
    'New': <Clock size={14} className="mr-1" />,
    'Confirmed': <CheckCircle2 size={14} className="mr-1" />,
    'Preparing': <Box size={14} className="mr-1" />,
    'Shipping': <Truck size={14} className="mr-1" />,
    'Delivered': <CheckCircle2 size={14} className="mr-1" />,
    'Canceled': <Ban size={14} className="mr-1" />,
    'Cancel Requested': <Ban size={14} className="mr-1" />,
  };

  const style = styles[status] || styles['New'];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center w-fit ${style}`}>
      {icons[status] || icons['New']}
      {status}
    </span>
  );
};

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) fetchOrders(page);
  }, [token, page]);

  const fetchOrders = async (currentPage = 1) => {
    try {
      const res = await axios.get(`/orders?page=${currentPage}&limit=5`);
      // check if backend returns paginated object or array (for fallback)
      if (res.data && res.data.data) {
        setOrders(res.data.data);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      } else {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cancelOrder = async (orderId, currentStatus) => {
    try {
      await axios.patch(`/orders/${orderId}/status`, { status: 'Canceled' });
      fetchOrders(page);
    } catch (err) {
      alert(err.response?.data?.error || 'Error canceling order');
      fetchOrders(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12 mt-4">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="text-indigo-600" size={32} />
              Lịch sử mua hàng
            </h2>
            <button onClick={() => fetchOrders(page)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm font-semibold">
              Làm mới
            </button>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Bạn chưa có đơn hàng nào.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-200 text-left">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-mono mb-1">Mã ĐH: {order._id}</p>
                      <div className="flex items-center gap-3">
                        <p className="text-2xl font-black text-gray-900">${order.totalAmount.toFixed(2)}</p>
                        <span className="text-gray-300 text-sm">&bull;</span>
                        <p className="text-sm font-medium text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Truck size={16} className="text-gray-400" />
                      <span>{order.shippingDetails.address}</span>
                    </div>
                    
                    <div className="flex gap-3 items-center">
                      {!['Canceled', 'Delivered', 'Cancel Requested'].includes(order.status) && (
                        <button 
                          onClick={() => cancelOrder(order._id, order.status)}
                          className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 flex items-center gap-2 text-sm font-bold transition-colors shadow-sm"
                        >
                          <Ban size={16} /> Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6 mt-4 border-t border-gray-100">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Trang trước
                  </button>
                  <span className="text-sm font-medium text-gray-500">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default OrderHistoryPage;
