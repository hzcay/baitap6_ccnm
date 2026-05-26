import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Package, CreditCard, ChevronRight, X, Clock, CheckCircle2, Truck, Box, Ban } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';
const USER_ID = 'user123';

const StatusBadge = ({ status }) => {
  const styles = {
    'New': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Confirmed': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'Preparing': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Shipping': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Delivered': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Canceled': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Cancel Requested': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
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
    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center w-fit ${style}`}>
      {icons[status] || icons['New']}
      {status}
    </span>
  );
};

function Cart({ onCheckout }) {
  const [cart, setCart] = useState({ items: [], total: 0 });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/cart/${USER_ID}`);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = async () => {
    const newItem = { productId: 'p' + Date.now(), name: 'Premium Wireless Headphones', price: 299, quantity: 1 };
    const newItems = [...cart.items, newItem];
    const newTotal = cart.total + newItem.price;
    try {
      await axios.post(`${API_URL}/cart/${USER_ID}`, { items: newItems, total: newTotal });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/cart/${USER_ID}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
          <ShoppingCart className="text-indigo-400" size={32} />
          Your Cart
        </h2>
        <div className="space-x-3">
          <button onClick={addItem} className="btn-secondary text-sm">Add Demo Item</button>
          <button onClick={clearCart} className="btn-secondary text-sm text-rose-400 hover:text-rose-300">Clear</button>
        </div>
      </div>
      
      {cart.items.length === 0 ? (
        <div className="text-center py-12 text-slate-400 flex flex-col items-center">
          <ShoppingCart size={48} className="mb-4 opacity-20" />
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-3">
            {cart.items.map((item, idx) => (
              <li key={idx} className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                    <Package size={20} className="text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-200">{item.name}</h3>
                    <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="font-semibold text-lg text-indigo-300">
                  ${item.price.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
          <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-slate-400 mb-1">Total Amount</p>
              <p className="text-4xl font-bold text-white">${cart.total.toFixed(2)}</p>
            </div>
            <button onClick={() => onCheckout(cart)} className="btn-primary flex items-center gap-2 py-3 px-6 text-lg">
              Checkout <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Checkout({ cart, onOrderPlaced, onCancel }) {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        userId: USER_ID,
        items: cart.items,
        totalAmount: cart.total,
        shippingDetails: { address, phone },
        paymentMethod: 'COD'
      };
      await axios.post(`${API_URL}/orders`, orderData);
      alert('Order placed successfully!');
      onOrderPlaced();
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
          <CreditCard className="text-indigo-400" size={32} />
          Checkout
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} className="text-slate-400" />
        </button>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-8 flex items-start gap-4">
        <div className="bg-indigo-500/20 p-2 rounded-lg mt-1">
          <Truck size={20} className="text-indigo-400" />
        </div>
        <div>
          <h4 className="font-medium text-indigo-300">Payment Method</h4>
          <p className="text-sm text-slate-300 mt-1">
            Cash on Delivery (COD) is strictly enforced for this transaction. You will pay when the order arrives.
          </p>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Shipping Address</label>
          <input 
            required 
            value={address} 
            onChange={e => setAddress(e.target.value)} 
            className="glass-input w-full"
            placeholder="123 Example Street, City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
          <input 
            required 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            className="glass-input w-full"
            placeholder="+1 234 567 8900"
          />
        </div>
        
        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-sm">Amount to pay</p>
            <p className="text-2xl font-bold text-white">${cart.total.toFixed(2)}</p>
          </div>
          <button type="submit" className="btn-primary py-3 px-8">
            Confirm Order
          </button>
        </div>
      </form>
    </div>
  );
}

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/${USER_ID}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelOrder = async (orderId, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'Canceled' });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Error canceling order');
      fetchOrders();
    }
  };

  const changeStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating status');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center gap-3">
          <Package className="text-emerald-400" size={32} />
          Order History
        </h2>
        <button onClick={fetchOrders} className="btn-secondary text-sm flex items-center gap-2">
           Refresh
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>You have no orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white/5 border border-white/10 rounded-xl p-6 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 font-mono mb-1">ID: {order._id}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-semibold text-white">${order.totalAmount.toFixed(2)}</p>
                    <span className="text-slate-500 text-sm">&bull;</span>
                    <p className="text-sm text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Truck size={16} />
                  <span>{order.shippingDetails.address}</span>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="relative group">
                    <select 
                      value={order.status} 
                      onChange={e => changeStatus(order._id, e.target.value)}
                      className="glass-input text-sm py-1.5 appearance-none pr-8 bg-transparent text-slate-300"
                    >
                      <option className="bg-slate-800" value="New">1. New</option>
                      <option className="bg-slate-800" value="Confirmed">2. Confirmed</option>
                      <option className="bg-slate-800" value="Preparing">3. Preparing</option>
                      <option className="bg-slate-800" value="Shipping">4. Shipping</option>
                      <option className="bg-slate-800" value="Delivered">5. Delivered</option>
                      <option className="bg-slate-800" value="Canceled">6. Canceled</option>
                      <option className="bg-slate-800" value="Cancel Requested">Cancel Requested</option>
                    </select>
                    <div className="absolute top-0 right-0 h-full flex items-center pr-2 pointer-events-none text-slate-400 group-hover:text-white transition-colors">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>

                  {!['Canceled', 'Delivered', 'Cancel Requested'].includes(order.status) && (
                    <button 
                      onClick={() => cancelOrder(order._id, order.status)}
                      className="btn-danger text-sm py-1.5 px-4 flex items-center gap-2"
                    >
                      <Ban size={14} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [view, setView] = useState('cart');
  const [checkoutCart, setCheckoutCart] = useState(null);

  const goToCheckout = (cart) => {
    setCheckoutCart(cart);
    setView('checkout');
  };

  const handleOrderPlaced = () => {
    setView('orders');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-slate-200">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">NexusCommerce</h1>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setView('cart')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                (view === 'cart' || view === 'checkout') 
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Shopping
            </button>
            <button 
              onClick={() => setView('orders')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'orders' 
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              My Orders
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {view === 'cart' && <Cart onCheckout={goToCheckout} />}
        {view === 'checkout' && <Checkout cart={checkoutCart} onOrderPlaced={handleOrderPlaced} onCancel={() => setView('cart')} />}
        {view === 'orders' && <OrderHistory />}
      </main>
    </div>
  );
}

export default App;
