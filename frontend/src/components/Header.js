import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';

function Header() {
  const [cart, setCart] = useState([]);

  const updateCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(cartItems);
  };

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
          <div className="navbar-nav ms-auto"> {}
            <Link className="nav-link" to="/order">Order</Link>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/cart">
              <img src={cartImage} alt="Cart" style={{ width: '24px', height: '24px' }} />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
