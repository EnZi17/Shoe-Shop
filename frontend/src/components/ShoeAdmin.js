import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import AddShoeModal from './AddShoeModal'; 
import EditShoeModal from './EditShoeModal'; 
import ConfirmationModal from './ConfirmationModal'; 

function ShoeAdmin() {
  const [shoes, setShoes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editShoe, setEditShoe] = useState(null);
  const [shoeToDelete, setShoeToDelete] = useState(null);

  useEffect(() => {
    axios.get('https://shoe-shop-backend-qm9w.onrender.com/api/shoes')
      .then(response => setShoes(response.data))
      .catch(error => console.error('Error fetching shoes:', error));
  }, []);

  const handleAddShoe = (shoe) => {
    setShoes([...shoes, shoe]);
  };

  const handleEditShoe = () => {
    axios.get(`https://shoe-shop-backend-qm9w.onrender.com/api/shoes/${editShoe._id}`, editShoe)
      .then(response => {
        setShoes(shoes.map(shoe => (shoe._id === response.data._id ? response.data : shoe)));
        setShowEditModal(false);
        setEditShoe(null);
        
      })
      .catch(error => console.error('Error updating shoe:', error));
  };

  const handleDeleteShoe = () => {
    if (shoeToDelete) {
      axios.delete(`https://shoe-shop-backend-qm9w.onrender.com/api/shoes/${shoeToDelete}`)
        .then(() => {
          setShoes(shoes.filter(shoe => shoe._id !== shoeToDelete));
          setShoeToDelete(null);
          setShowConfirmModal(false);
        })
        .catch(error => console.error('Error deleting shoe:', error));
    }
  };

  return (
    <div className="container mt-4">
      <h1>Manage Shoes</h1>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>Add New Shoe</Button>
      
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shoes.map(shoe => (
            <tr key={shoe._id}>
              <td>{shoe.name}</td>
              <td>${shoe.price}</td>
              <td>{shoe.quantity}</td>
              <td>
                <Button variant="warning" onClick={() => {
                  setEditShoe(shoe);
                  setShowEditModal(true);
                }}>Edit</Button>
                <Button variant="danger" className="ms-2" onClick={() => {
                  setShoeToDelete(shoe._id);
                  setShowConfirmModal(true);
                }}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AddShoeModal show={showAddModal} onClose={() => setShowAddModal(false)} onAddShoe={handleAddShoe} />

      {showEditModal && (
        <EditShoeModal 
          show={showEditModal} 
          onClose={() => setShowEditModal(false)} 
          shoe={editShoe} 
          onSave={handleEditShoe} 
        />
      )}

      <ConfirmationModal 
        show={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)} 
        onConfirm={handleDeleteShoe} 
      />
    </div>
  );
}

export default ShoeAdmin;
