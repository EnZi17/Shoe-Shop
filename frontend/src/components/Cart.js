import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../css/Cart.css';

function Cart() {
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(cartItems);
  }, []);

  const removeFromCart = (id) => {
    let updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleSubmit = () => {
    const orderData = {
      items: cart.map(item => ({ shoeid: item._id, quantity: item.quantity })),
      phone,
      address,
      shippingCode: '',
    };
  
    axios.post('https://shoe-shop-backend-qm9w.onrender.com/orders', orderData)
      .then(response => {
        
        
        const orderId = response.data.orderid;
        const createdAt = response.data.createdAt; // Nhận ngày giờ tạo đơn hàng từ server
        localStorage.setItem('orderId', orderId); 
        localStorage.setItem('orderCreatedAt', createdAt); // Lưu ngày giờ tạo vào localStorage
        
        setShowModal(false);
        localStorage.removeItem('cart');
        setCart([]);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  

  return (
    <div className="container my-4">
      <h1 className="mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="row">
          {cart.map(item => (
            <div key={item._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="image-container">
                  <img src={item.thum} alt={item.name} className="card-img-top" />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">Price: ${item.price.toFixed(2)}</p>
                  <p className="card-text">Quantity: {item.quantity}</p>
                  <button className="btn btn-danger" onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <div className="col-12 mt-4">
            <h3 className="text-end">Total: ${getTotalPrice()}</h3>
            <button className="btn btn-success mt-2" onClick={() => setShowModal(true)}>Proceed to Checkout</button>
          </div>
        </div>
      )}

      {/* Modal để nhập số điện thoại và địa chỉ */}
      {showModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Your Details</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
