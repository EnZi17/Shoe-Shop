import React, { useState } from 'react';
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../css/Modal.css';

function AddShoeModal({ show, onClose, onAddShoe }) {
  const [newShoe, setNewShoe] = useState({
    name: '',
    thum: '',
    description: '',
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
        resetForm();
      })
      .catch(error => console.error('Error adding shoe:', error));
  };

  const resetForm = () => {
    setNewShoe({
      name: '',
      thum: '',
      description: '',
      price: '',
      quantity: '',
      pic1: '',
      pic2: '',
      pic3: '',
      pic4: '',
      pic5: '',
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add New Shoe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
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
            </Col>
            <Col md={6}>
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
            </Col>
          </Row>

          <Row>
            <Col md={6}>
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
            </Col>
            <Col md={6}>
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
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={newShoe.description}
              onChange={e => setNewShoe({ ...newShoe, description: e.target.value })}
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
