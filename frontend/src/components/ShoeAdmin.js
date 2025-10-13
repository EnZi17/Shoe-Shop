import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Form } from 'react-bootstrap';
import AddShoeModal from './AddShoeModal'; 
import EditShoeModal from './EditShoeModal'; 
import ConfirmationModal from './ConfirmationModal'; 

function ShoeAdmin() {
  const [shoes, setShoes] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editShoe, setEditShoe] = useState(null);
  const [shoeToDelete, setShoeToDelete] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [shippingCode, setShippingCode] = useState(''); 

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/shoes`)
      .then(response => setShoes(response.data))
      .catch(error => console.error('Error fetching shoes:', error));
  }, []);

  useEffect(() => {
    fetchOrders(); 
  }, []);

  const fetchOrders = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/orders`) 
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));
  };

  const handleAddShoe = (shoe) => {
    setShoes([...shoes, shoe]);
  };

  const handleEditShoe = () => {
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/shoes/${editShoe._id}`, editShoe)
      .then(response => {
        setShoes(shoes.map(shoe => (shoe._id === response.data._id ? response.data : shoe)));
        setShowEditModal(false);
        setEditShoe(null);
      })
      .catch(error => console.error('Error updating shoe:', error));
  };

  const handleDeleteShoe = () => {
    if (shoeToDelete) {
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/shoes/${shoeToDelete}`)
        .then(() => {
          setShoes(shoes.filter(shoe => shoe._id !== shoeToDelete));
          setShoeToDelete(null);
          setShowConfirmModal(false);
        })
        .catch(error => console.error('Error deleting shoe:', error));
    }
  };

  const handleDeleteOrder = (orderId) => {
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/orders/${orderId}`)
      .then(() => {
        setOrders(orders.filter(order => order._id !== orderId));
      })
      .catch(error => console.error('Error deleting order:', error));
  };

  const handleConfirmShippingCode = (orderId) => {
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/orders/${orderId}`, { shippingCode })
      .then(response => {
        fetchOrders(); 
        setShippingCode(''); 
      })
      .catch(error => console.error('Error updating tracking number:', error));
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

      <h2 className="mt-4">Orders</h2>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Items</th>
            <th>Tracking Number</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.phone}</td>
              <td>{order.address}</td>
              <td>
                {order.items.map(item => {
                  const shoe = shoes.find(shoe => shoe._id === item.shoeid);
                  return (
                    <div key={item.shoeid}>
                      {shoe ? <img src={shoe.thum} alt={shoe.name} style={{ width: '50px', marginRight: '5px' }} /> : null}
                      {shoe ? shoe.name : 'Unknown'} (Quantity: {item.quantity})
                    </div>
                  );
                })}
              </td>
              <td>
                <Form.Control 
                  type="text" 
                  placeholder="Enter tracking number" 
                  value={order.shippingCode || shippingCode} 
                  onChange={(e) => setShippingCode(e.target.value)} 
                />
                <Button variant="success" onClick={() => handleConfirmShippingCode(order._id)}>Confirm</Button>
              </td>
              <td>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </td>
              <td>
                <span>{order.shippingCode ? 'Processed' : 'Unprocessed'}</span>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteOrder(order._id)}>Delete Order</Button>
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
