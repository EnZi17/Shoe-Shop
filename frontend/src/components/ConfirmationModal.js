import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmationModal({ show, onClose, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this shoe?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
