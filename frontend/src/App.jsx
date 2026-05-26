import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
// Hardcoded user ID for assignment purposes
const USER_ID = 'user123';

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
    const newItem = { productId: 'p1', name: 'Product 1', price: 100, quantity: 1 };
    const newItems = [...cart.items, newItem];
    const newTotal = cart.total + 100;
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
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
      <h2>1. Giỏ Hàng (Cart)</h2>
      <button onClick={addItem}>Add Dummy Product ($100)</button>
      <button onClick={clearCart}>Clear Cart</button>
      
      <ul>
        {cart.items.map((item, idx) => (
          <li key={idx}>{item.name} - ${item.price} x {item.quantity}</li>
        ))}
      </ul>
      <p>Total: ${cart.total}</p>
      
      {cart.items.length > 0 && (
        <button onClick={() => onCheckout(cart)}>Proceed to Checkout</button>
      )}
    </div>
  );
}

function Checkout({ cart, onOrderPlaced }) {
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
        paymentMethod: 'COD' // Forced COD
      };
      await axios.post(`${API_URL}/orders`, orderData);
      alert('Order placed successfully via COD!');
      onOrderPlaced();
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
      <h2>2. Thanh Toán (Checkout)</h2>
      <form onSubmit={handleCheckout}>
        <div>
          <label>Address: </label>
          <input required value={address} onChange={e => setAddress(e.target.value)} />
        </div>
        <div>
          <label>Phone: </label>
          <input required value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div>
          <label>Payment Method: </label>
          <input type="text" value="COD" disabled />
          <small> (Bắt buộc là COD)</small>
        </div>
        <button type="submit">Place Order</button>
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
      alert('Cancel action triggered.');
    } catch (err) {
      alert(err.response?.data?.error || 'Error canceling order');
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
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h2>3. Theo dõi Đơn Hàng (Order Tracking)</h2>
      <button onClick={fetchOrders}>Refresh Orders</button>
      
      {orders.map(order => (
        <div key={order._id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '10px' }}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.totalAmount}</p>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
             {/* Simulate admin changing status for testing */}
             <select value={order.status} onChange={e => changeStatus(order._id, e.target.value)}>
               <option value="New">1. New</option>
               <option value="Confirmed">2. Confirmed</option>
               <option value="Preparing">3. Preparing</option>
               <option value="Shipping">4. Shipping</option>
               <option value="Delivered">5. Delivered</option>
               <option value="Canceled">6. Canceled</option>
               <option value="Cancel Requested">Cancel Requested</option>
             </select>

             <button onClick={() => cancelOrder(order._id, order.status)}>
                Cancel Order
             </button>
          </div>
        </div>
      ))}
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
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>BÀI TẬP CÁ NHÂN 05 - E-Commerce App</h1>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setView('cart')}>Cart & Checkout</button>
        <button onClick={() => setView('orders')}>Order History</button>
      </div>

      {view === 'cart' && <Cart onCheckout={goToCheckout} />}
      {view === 'checkout' && <Checkout cart={checkoutCart} onOrderPlaced={handleOrderPlaced} />}
      {view === 'orders' && <OrderHistory />}
    </div>
  );
}

export default App;
