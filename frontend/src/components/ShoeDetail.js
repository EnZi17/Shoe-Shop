import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ShoeDetail.css';
import axios from 'axios';

function ShoeDetail() {
  const { id } = useParams(); 
  const [shoe, setShoe] = useState(null);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shoes/${id}`)
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

const addToCart = async () => {
    // 1. Kiểm tra đăng nhập
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.id) {
      alert("Please Login to order!");
      navigate('/login');
      return;
    }

    // 2. Gọi API lưu vào Database
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cart`, {
        userId: user.id,
        productId: shoe._id,
        quantity: 1
      });
      
      alert(`${shoe.name} đã được thêm vào giỏ hàng thành công!`);
    } catch (error) {
      console.error("Lỗi khi thêm vào database:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };
  if (!shoe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container shoe-detail">
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
          <p><strong>Quantity:</strong> {shoe.quantity}</p> {}
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

export default ShoeDetail;
