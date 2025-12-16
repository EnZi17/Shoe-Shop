import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Cart.css';

function Cart() {
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Lấy giỏ hàng từ database nếu user đã đăng nhập
    if (!user) {
      alert("Vui lòng đăng nhập");
      navigate('/login');
      return;
    }

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/cart/${user.id}`)
      .then(response => {
        const formattedCart = response.data.map(item => {
          if (!item.productId) return null;

          return {
            _id: item._id,
            shoeId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            thum: item.productId.thum,
            quantity: item.quantity
          };
        }).filter(item => item !== null);

        setCart(formattedCart);
      })
      .catch(error => {
        console.log('Lỗi lấy giỏ hàng:', error);
      });
  }, [user, navigate]);



  const removeFromCart = (id) => {
    //Gọi Server để xóa
    if (user) {
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/cart/${id}`)
        .then(response => {
          //Server xóa xong thì cập nhật giao diện
          //filter(array): lọc sản phẩm, đủ điều kiện thì cho vào mảng mới
          let updatedCart = cart.filter(item => item._id !== id);
          setCart(updatedCart);
        })
        .catch(error => {
          console.log('Lỗi xóa từ database:', error);
          alert("Có lỗi xảy ra, không thể xóa sản phẩm");
        });
    }

  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleSubmit = () => {
    const orderData = {
      userId: user.id,
      items: cart.map(item => ({ shoeid: item.shoeId, quantity: item.quantity })),
      phone,
      address,
      shippingCode: '',
    };

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/orders`, orderData)
      .then(response => {
        const orderId = response.data.orderid;
        const createdAt = response.data.createdAt;
        localStorage.setItem('orderId', orderId);
        localStorage.setItem('orderCreatedAt', createdAt);

        setShowModal(false);
        setCart([]); //xóa giao diện?
        alert("Đặt hàng thành công");
        navigate('/order');
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Đặt hàng thất bại")
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

      { }
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
