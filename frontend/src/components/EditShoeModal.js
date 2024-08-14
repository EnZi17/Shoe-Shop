import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

function EditShoeModal({ show, onClose, shoe, onSave }) {
  const [editedShoe, setEditedShoe] = useState({});

  useEffect(() => {
    // Khi modal mở và có dữ liệu mới, cập nhật state
    if (shoe) {
      setEditedShoe(shoe);
    }
  }, [shoe, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setEditedShoe(prevState => ({
      ...prevState,
      [name]: value
    }));
    
  };

  const handleSave = () => {
    
    axios.put(`http://localhost:9000/api/shoes/${editedShoe._id}`, editedShoe)
      .then(response => {
        
        onSave(response.data); // Cập nhật danh sách giày trong component cha
        onClose();
      })
      .catch(error => console.error('Error updating shoe:', error));
      
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Shoe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Shoe Name</Form.Label>
            <Form.Control 
              type="text" 
              name="name"
              placeholder="Enter shoe name" 
              value={editedShoe.name || ''} 
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Thumbnail URL</Form.Label>
            <Form.Control 
              type="text" 
              name="thum"
              placeholder="Enter thumbnail URL" 
              value={editedShoe.thum || ''} 
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control 
              type="number" 
              name="price"
              placeholder="Enter price" 
              value={editedShoe.price || ''} 
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control 
              type="number" 
              name="quantity"
              placeholder="Enter quantity" 
              value={editedShoe.quantity || ''} 
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Picture URLs</Form.Label>
            {['pic1', 'pic2', 'pic3', 'pic4', 'pic5'].map((pic, index) => (
              <Form.Control 
                key={index} 
                type="text" 
                name={pic}
                placeholder={`Enter picture ${index + 1} URL`} 
                value={editedShoe[pic] || ''} 
                onChange={handleChange}
                className="mb-2"
              />
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditShoeModal;
