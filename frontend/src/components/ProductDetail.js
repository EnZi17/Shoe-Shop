import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams(); 
  const [shoe, setShoe] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9000/api/shoes/${id}`)
      .then(response => response.json())
      .then(data => setShoe(data))
      .catch(error => console.error('Error fetching shoe details:', error));
  }, [id]);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item._id === shoe._id);

    if (index !== -1) {
      cart[index].quantity += 1; // Tăng số lượng nếu sản phẩm đã có trong giỏ hàng
    } else {
      cart.push({ ...shoe, quantity: 1 }); // Thêm sản phẩm mới vào giỏ hàng
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${shoe.name} has been added to your cart!`);
  };

  if (!shoe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container product-detail">
      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <div className="col-6 mb-3">
              <img src={shoe.thum} alt={shoe.name} className="img-fluid" onClick={() => openModal(shoe.thum)} />
            </div>
            {shoe.pic1 && (
              <div className="col-6 mb-3">
                <img src={shoe.pic1} alt={`${shoe.name} pic1`} className="img-fluid" onClick={() => openModal(shoe.pic1)} />
              </div>
            )}
          </div>
          <div className="row">
            {shoe.pic2 && (
              <div className="col-6 mb-3">
                <img src={shoe.pic2} alt={`${shoe.name} pic2`} className="img-fluid" onClick={() => openModal(shoe.pic2)} />
              </div>
            )}
            {shoe.pic3 && (
              <div className="col-6 mb-3">
                <img src={shoe.pic3} alt={`${shoe.name} pic3`} className="img-fluid" onClick={() => openModal(shoe.pic3)} />
              </div>
            )}
          </div>
          <div className="row">
            {shoe.pic4 && (
              <div className="col-6 mb-3">
                <img src={shoe.pic4} alt={`${shoe.name} pic4`} className="img-fluid" onClick={() => openModal(shoe.pic4)} />
              </div>
            )}
            {shoe.pic5 && (
              <div className="col-6 mb-3">
                <img src={shoe.pic5} alt={`${shoe.name} pic5`} className="img-fluid" onClick={() => openModal(shoe.pic5)} />
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <h1>{shoe.name}</h1>
          <p><strong>Price:</strong> ${shoe.price}</p>
          <p><strong>Quantity:</strong> {shoe.quantity}</p> {/* Hiển thị số lượng */}
          <p><strong>Description:</strong> {shoe.description}</p>
          <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
        </div>
      </div>

      {selectedImage && (
        <div className="modal fade show" style={{ display: 'block' }} onClick={closeModal}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" aria-label="Close" onClick={closeModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <img src={selectedImage} alt="Selected" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
