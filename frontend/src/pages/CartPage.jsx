import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { ShoppingCart, Package, CreditCard, ChevronRight, X, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';

function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [view, setView] = useState('cart');
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/cart');
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12 mt-4">
        {view === 'cart' && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingCart className="text-indigo-600" size={32} />
                Giỏ Hàng
              </h2>
              <div className="space-x-3">
                <button onClick={clearCart} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition font-semibold text-sm">Xóa Giỏ</button>
              </div>
            </div>
            
            {cart.items.length === 0 ? (
              <div className="text-center py-12 text-gray-400 flex flex-col items-center">
                <ShoppingCart size={48} className="mb-4 text-gray-300" />
                <p>Giỏ hàng của bạn đang trống.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <ul className="space-y-3">
                  {cart.items.map((item, idx) => (
                    <li key={idx} className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                          <Package size={20} className="text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="font-black text-lg text-indigo-600">
                        ${item.price.toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-end">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Tổng tiền</p>
                    <p className="text-4xl font-black text-gray-900">${cart.total.toFixed(2)}</p>
                  </div>
                  <button onClick={() => setView('checkout')} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-md flex items-center gap-2 py-3 px-6 text-base font-bold transition-all hover:scale-105">
                    Thanh Toán <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {view === 'checkout' && (
          <Checkout 
            cart={cart} 
            token={token} 
            onOrderPlaced={() => navigate('/orders')} 
            onCancel={() => setView('cart')} 
          />
        )}
      </main>
    </div>
  );
}

function Checkout({ cart, token, onOrderPlaced, onCancel }) {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        items: cart.items,
        totalAmount: cart.total,
        shippingDetails: { address, phone },
        paymentMethod: 'COD'
      };
      await axios.post('/orders', orderData);
      alert('Order placed successfully!');
      onOrderPlaced();
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 max-w-2xl mx-auto border border-gray-100 shadow-sm mt-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CreditCard className="text-indigo-600" size={32} />
          Thanh Toán
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} className="text-gray-400" />
        </button>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-8 flex items-start gap-4">
        <div className="bg-indigo-100 p-2 rounded-xl mt-1">
          <Truck size={20} className="text-indigo-600" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900">Phương thức thanh toán</h4>
          <p className="text-sm text-indigo-700/80 mt-1">
            Hệ thống chỉ hỗ trợ thanh toán khi nhận hàng (COD). Bạn sẽ trả tiền khi shipper giao hàng tới.
          </p>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="space-y-6 text-left">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ giao hàng</label>
          <input 
            required 
            value={address} 
            onChange={e => setAddress(e.target.value)} 
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all outline-none"
            placeholder="Số nhà, Tên đường, Quận, Thành phố"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại</label>
          <input 
            required 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all outline-none"
            placeholder="0987 654 321"
          />
        </div>
        
        <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm font-medium">Tổng thanh toán</p>
            <p className="text-3xl font-black text-gray-900">${cart.total.toFixed(2)}</p>
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl py-3 px-8 font-bold shadow-md transition-all hover:scale-105">
            Xác nhận Đặt hàng
          </button>
        </div>
      </form>
    </div>
  );
}

export default CartPage;
