import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/Header.css';

function Header() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const updateCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(cartItems);
  };

  const handleLogout = () =>{
    localStorage.removeItem('user');
    localStorage.removeItem('orderId');
    navigate('/login');
    window.location.reload();
    alert(` Người dùng ${user.fullName || user.username} đã đăng xuất`);
  }

  useEffect(() => {
    updateCart();
    window.addEventListener('storage', updateCart);
    return () => {
      window.removeEventListener('storage', updateCart);
    };
  }, []);


  const cartImage = cart.length === 0 ? '/empty-cart.png' : '/cart.png';

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">ShoeShop</Link>
          <div className="navbar-nav ms-auto"> 
            {/* {user (...) : (...)} toán tử 3 ngôi */}
            {user ? (
              <>
              <span className='nav-link text-primary fw-bold'>{user.fullName}</span>
              <Link className="nav-link" to="/order">Order</Link>
              <button 
                  className="btn btn-link nav-link" 
                  onClick={handleLogout}
                  style={{ textDecoration: 'none' }}
                >
                  Logout
                </button>
              <Link className="nav-link" to="/cart">
              <img src={cartImage} alt="Cart" style={{ width: '24px', height: '24px' }} />
            </Link> 
              </>
            ) : (
              <>
              <Link className="nav-link" to="/login">Login</Link>
                <Link className="nav-link" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
