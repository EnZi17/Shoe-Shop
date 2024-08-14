import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  const [shoes, setShoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch danh sách giày từ API với từ khóa tìm kiếm
    fetch(`http://localhost:9000/api/shoes?search=${searchTerm}`)
      .then(response => response.json())
      .then(data => setShoes(data))
      .catch(error => console.error('Error fetching shoes:', error));
  }, [searchTerm]); // Gọi lại khi từ khóa tìm kiếm thay đổi

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container">
      <main>
        <section className="featured-products">
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
                  <Link to={`/product/${shoe._id}`}>
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
        </section>
      </main>
    </div>
  );
}

export default Home;
