import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../css/Modal.css';

function EditShoeModal({ show, onClose, shoe, onSave }) {
  const [editedShoe, setEditedShoe] = useState({});

  useEffect(() => {
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
    axios.put(`https://shoe-shop-backend-qm9w.onrender.com/api/shoes/${editedShoe._id}`, editedShoe)
      .then(response => {
        onSave(response.data); 
        onClose();
      })
      .catch(error => console.error('Error updating shoe:', error));
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Edit Shoe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
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
            </Col>
            <Col md={6}>
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
            </Col>
          </Row>

          <Row>
            <Col md={6}>
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
            </Col>
            <Col md={6}>
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
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              type="text" 
              name="description"
              placeholder="Enter description" 
              value={editedShoe.description || ''} 
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
