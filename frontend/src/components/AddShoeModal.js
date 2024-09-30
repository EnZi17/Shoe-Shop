import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import '../css/AddShoeModal.css';

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
    axios.post('https://shoe-shop-backend-qm9w.onrender.com/shoes', newShoe)
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
      <Modal.Body className="modal-body">
        <h5 className="modal-title">Add New Shoe</h5>
        <Form>
          {['name', 'thum', 'price', 'quantity'].map((field, index) => (
            <Form.Group key={index} className="form-group">
              <Form.Label>{field === 'thum' ? 'Thumbnail URL' : field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                type={field === 'price' || field === 'quantity' ? 'number' : 'text'}
                placeholder={`Enter ${field}`}
                value={newShoe[field]}
                onChange={e => setNewShoe({ ...newShoe, [field]: e.target.value })}
                required
                className="form-control"
              />
            </Form.Group>
          ))}
          <Form.Group className="form-group">
            <Form.Label>Picture URLs</Form.Label>
            {['pic1', 'pic2', 'pic3', 'pic4', 'pic5'].map((pic, index) => (
              <Form.Control
                key={index}
                type="text"
                placeholder={`Enter picture ${index + 1} URL`}
                value={newShoe[pic]}
                onChange={e => setNewShoe({ ...newShoe, [pic]: e.target.value })}
                className="form-control mb-2"
              />
            ))}
          </Form.Group>
        </Form>
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={handleAddShoe}>Save Changes</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddShoeModal;
