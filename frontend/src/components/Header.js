import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(cartItems);
  }, []);

  const cartImage = cart.length === 0 ? '/empty-cart.png' : '/cart.png'; // Đường dẫn đến ảnh giỏ hàng rỗng

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">ShoeShop</Link>
          
          <Link className="nav-link" to="/cart">
            <img src={cartImage} alt="Cart" style={{ width: '24px', height: '24px' }} />
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
