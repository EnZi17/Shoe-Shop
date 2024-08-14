import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams(); // Lấy id từ URL
  const [shoe, setShoe] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch chi tiết sản phẩm từ API
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

  if (!shoe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container product-detail">
      <div className="row">
        <div className="col-md-6">
          {/* Hiển thị các hình ảnh trong 3 hàng, mỗi hàng 2 cột */}
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
          {/* Thông tin sản phẩm */}
          <h1>{shoe.name}</h1>
          <p><strong>Price:</strong> ${shoe.price}</p>
          <p><strong>Description:</strong> {shoe.description}</p>
          <button className="btn btn-primary">Add to Cart</button>
        </div>
      </div>

      {/* Modal để hiển thị ảnh lớn */}
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
