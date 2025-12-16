import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
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
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>Email: vominhthong117@gmail.com
                     leduykhangdng2004@gmail.com
            </p>
             
            <p>Phone: 0357 456 6624</p>
            <p>Address: Trường Đại Học Công Nghệ Thông Tin Và Truyền Thông Việt Hàn - Đà Nẵng</p>
          </div>
        </div>
        <div className="text-center pt-3">
          <p className="mb-0">© 2024 ShoeShop. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
