import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo rằng Bootstrap được import

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(cartItems);
  }, []);

  const removeFromCart = (id) => {
    // Lọc các sản phẩm không có id giống với id của sản phẩm cần xóa
    let updatedCart = cart.filter(item => item._id !== id);
    
    // Cập nhật trạng thái giỏ hàng
    setCart(updatedCart);
    
    // Lưu giỏ hàng đã cập nhật vào localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
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
                <img src={item.thum} alt={item.name} className="card-img-top" style={{ maxHeight: '200px', objectFit: 'cover' }} />
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
            <button className="btn btn-success mt-2">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
