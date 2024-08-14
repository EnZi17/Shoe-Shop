import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import '../css/AddShoeModal.css'; // Đảm bảo CSS đã được tạo

function AddShoeModal({ show, onClose, onAddShoe }) {
  const [newShoe, setNewShoe] = useState({
    name: '',
    thum: '',
    price: '',
    quantity: '',
    pic1: '',
    pic2: '',
    pic3: '',
    pic4: '',
    pic5: '',
  });

  const handleAddShoe = () => {
    axios.post('http://localhost:9000/api/shoes', newShoe)
      .then(response => {
        onAddShoe(response.data);
        onClose();
        setNewShoe({
          name: '',
          thum: '',
          price: '',
          quantity: '',
          pic1: '',
          pic2: '',
          pic3: '',
          pic4: '',
          pic5: '',
        });
      })
      .catch(error => console.error('Error adding shoe:', error));
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add New Shoe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Shoe Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter shoe name" 
              value={newShoe.name} 
              onChange={e => setNewShoe({ ...newShoe, name: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Thumbnail URL</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter thumbnail URL" 
              value={newShoe.thum} 
              onChange={e => setNewShoe({ ...newShoe, thum: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Enter price" 
              value={newShoe.price} 
              onChange={e => setNewShoe({ ...newShoe, price: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Enter quantity" 
              value={newShoe.quantity} 
              onChange={e => setNewShoe({ ...newShoe, quantity: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Picture URLs</Form.Label>
            {['pic1', 'pic2', 'pic3', 'pic4', 'pic5'].map((pic, index) => (
              <Form.Control 
                key={index} 
                type="text" 
                placeholder={`Enter picture ${index + 1} URL`} 
                value={newShoe[pic]} 
                onChange={e => setNewShoe({ ...newShoe, [pic]: e.target.value })}
                className="mb-2"
              />
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={handleAddShoe}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddShoeModal;
