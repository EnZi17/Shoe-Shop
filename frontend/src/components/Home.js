import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

// Danh sách ảnh slide
const images = ['1.jpg', '3.jpg', '4.jpg', '5.jpg'];

function Home() {
  // 1. LOGIC SLIDE (Giữ nguyên)
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // 2. STATE DỮ LIỆU
  const [shoes, setShoes] = useState([]); // Dữ liệu chính (có phân trang)
  const [bestShoes, setBestShoes] = useState([]); // Dữ liệu Best Product (cố định)
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const shoesPerPage = 8;

  // --- EFFECT 1: Lấy Best Product (CHỈ CHẠY 1 LẦN) ---
  useEffect(() => {
    // Gọi API lấy 5 đôi đầu tiên làm Best Product
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shoes?limit=5`)
      .then(res => res.json())
      .then(data => {
        if (data.shoes) setBestShoes(data.shoes);
      })
      .catch(err => console.error(err));
  }, []); // [] rỗng => Chỉ chạy đúng 1 lần khi vào web

  // --- EFFECT 2: Lấy danh sách chính (CHẠY KHI ĐỔI TRANG/SEARCH) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/shoes?search=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${shoesPerPage}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.shoes) {
          setShoes(data.shoes);
          setTotalPages(data.totalPages || 1);
        } else {
          setShoes([]);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [searchTerm, currentPage]);

  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <>
      {/* SLIDESHOW */}
      <div className='container-1'>
        <div id='slide'>
          {images.map((img, i) => (
            <div key={i} className="item" style={{ backgroundImage: `url(${img})`, opacity: i === index ? 1 : 0, zIndex: i === index ? 1 : 0 }}></div>
          ))}
          <div className='buttons'>
            <button id='prev' onClick={prevSlide}><i className="fa-solid fa-angle-left"></i></button>
            <button id='next' onClick={nextSlide}><i className="fa-solid fa-angle-right"></i></button>
          </div>
        </div>
      </div>

      {/* PHẦN BEST PRODUCT (Dùng biến bestShoes) */}
      <div className="container">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm} 
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          className="form-control search-input mb-4" 
        />
        
        <h2 className='title-blog'>Best Product</h2>
        <section className="featured-shoes">
          <div className="row d-flex flex-nowrap ">
            {/* Map từ bestShoes (Luôn cố định) */}
            {bestShoes.map(shoe => (
              <div key={shoe._id} className="col-auto">
                <div className="card mb-4" style={{ width: '250px', minWidth: '250px' }}>
                  <Link to={`/shoes/${shoe._id}`}>
                    <img src={shoe.thum} className="card-img" alt={shoe.name} />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title shoe-name">{shoe.name}</h5>
                    <p className='card-text'>{shoe.price}<sup>$</sup></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* PHẦN ALL PRODUCTS (Dùng biến shoes - thay đổi theo trang) */}
      <div className="container">
        <main>
          <h2 className='title-blog'>All Products</h2>
          <section className="featured-shoes">
            <div className="row d-flex">
              {shoes.map(shoe => (
                <div key={shoe._id} className="col-md-3">
                  <div className="card mb-4">
                    <Link to={`/shoes/${shoe._id}`}>
                      <img src={shoe.thum} className="card-img-top" alt={shoe.name} />
                    </Link>
                    <div className="card-body">
                      <h5 className="card-title shoe-name">{shoe.name}</h5>
                      <p className="card-text">${shoe.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage - 1)}>Previous</button>
                </li>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <li key={idx + 1} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => goToPage(idx + 1)}>{idx + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </section>
        </main>
      </div>
    </>
  );
}

export default Home;