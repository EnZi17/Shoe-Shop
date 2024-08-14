import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail'; // Import component mới
import './App.css'

function App() {
  return (
    <Router>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">ShoeShop</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav navbar-nav-left">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">Contact</Link>
                </li>
              </ul>

              <ul className="navbar-nav navbar-nav-right">
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    <img src="/cart.png" alt="Cart" style={{ width: '24px', height: '24px' }} />
                  </Link>
                </li>
              </ul>

            </div>
          </div>
        </nav>
      </header>

      <main id="root">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="product/:id" element={<ProductDetail />} /> {/* Route cho chi tiết sản phẩm */}
        </Routes>
      </main>

      <footer className="bg-dark text-light py-4 mt-auto">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>About Us</h5>
              <p>ShoeShop is your go-to place for high-quality footwear with a wide range of styles for every occasion.</p>
            </div>
            <div className="col-md-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-light">Home</Link></li>
                <li><Link to="/contact" className="text-light">Contact</Link></li>
                <li><Link to="/privacy" className="text-light">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Contact Us</h5>
              <p>Email: info@shoeshop.com</p>
              <p>Phone: +84 123 456 789</p>
              <p>Address: 123 Street, City, Country</p>
            </div>
          </div>
          <div className="text-center pt-3">
            <p className="mb-0">© 2024 ShoeShop. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </Router>
  );
}

export default App;
