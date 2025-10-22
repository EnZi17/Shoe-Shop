// ...existing code...
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  const [shoes, setShoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const shoesPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/shoes?search=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${shoesPerPage}`;
        const res = await fetch(url);
        const data = await res.json();
        // backend trả về object { shoes, totalPages, currentPage, totalItems }
        if (data.shoes) {
          setShoes(data.shoes);
          setTotalPages(data.totalPages || 1);
        } else {
          // nếu backend cũ trả về array trực tiếp
          setShoes(Array.isArray(data) ? data : []);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching shoes:', error);
      }
    };

    fetchData();
  }, [searchTerm, currentPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="container">
      <main>
        <section className="featured-shoes">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control search-input mb-4"
          />
          <div className="row d-flex">
            {shoes.map(shoe => (
              <div key={shoe._id} className="col-md-3">
                <div className="card mb-4">
                  <Link to={`/shoes/${shoe._id}`}>
                    <img src={shoe.thum} className="card-img-top" alt={shoe.name} />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title shoe-name">{shoe.name}</h5>
                    <p className="card-text">Price: ${shoe.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(currentPage - 1)}>Previous</button>
              </li>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => goToPage(pageNum)}>{pageNum}</button>
                  </li>
                );
              })}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(currentPage + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </section>
      </main>
    </div>
  );
}

export default Home;
// ...existing code...