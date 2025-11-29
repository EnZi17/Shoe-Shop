import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import AddShoeModal from './AddShoeModal'; // Giả sử bạn có modal để thêm giày
import EditShoeModal from './EditShoeModal'; // Giả sử bạn có modal để sửa giày
import ConfirmationModal from './ConfirmationModal'; // Giả sử bạn có modal để xác nhận xóa

function ShoeAdmin() {
  const [shoes, setShoes] = useState([]); // Khởi tạo shoes là mảng rỗng
  const [orders, setOrders] = useState([]); // Nếu bạn cần quản lý đơn hàng
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editShoe, setEditShoe] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [shoeToDelete, setShoeToDelete] = useState(null);

  // Hàm để lấy danh sách giày
  const loadShoes = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shoes`);
      const data = await res.json();

      // Kiểm tra và lấy dữ liệu đúng định dạng
      if (Array.isArray(data.shoes)) {
        setShoes(data.shoes); // Nếu backend trả về object { shoes: [...] }
      } else if (Array.isArray(data)) {
        setShoes(data); // Nếu backend trả về array trực tiếp
      } else {
        setShoes([]); // Trường hợp khác, set mảng rỗng
      }
    } catch (error) {
      console.error('Error loading shoes:', error);
      setShoes([]); // Đảm bảo luôn là mảng
    }
  };

  // Hàm để thêm giày
  const handleAddShoe = async (newShoe) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newShoe),
      });
      const addedShoe = await response.json();
      setShoes([...shoes, addedShoe]); // Cập nhật danh sách giày
      setShowAddModal(false); // Đóng modal
    } catch (error) {
      console.error('Error adding shoe:', error);
    }
  };

  // Hàm để sửa giày
  const handleEditShoe = async (updatedShoe) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shoes/${updatedShoe._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedShoe),
      });
      const shoe = await response.json();
      setShoes(shoes.map(s => (s._id === shoe._id ? shoe : s))); // Cập nhật danh sách giày
      setShowEditModal(false); // Đóng modal
    } catch (error) {
      console.error('Error editing shoe:', error);
    }
  };

  // Hàm để xóa giày
  const handleDeleteShoe = async () => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/shoes/${shoeToDelete}`, {
        method: 'DELETE',
      });
      setShoes(shoes.filter(s => s._id !== shoeToDelete)); // Cập nhật danh sách giày
      setShowConfirmModal(false); // Đóng modal
    } catch (error) {
      console.error('Error deleting shoe:', error);
    }
  };

  // Gọi loadShoes khi component mount
  useEffect(() => {
    loadShoes();
  }, []);

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
          {Array.isArray(shoes) && shoes.length > 0 ? (
            shoes.map(shoe => (
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
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No shoes found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal để thêm giày */}
      <AddShoeModal show={showAddModal} onClose={() => setShowAddModal(false)} onAddShoe={handleAddShoe} />

      {/* Modal để sửa giày */}
      {showEditModal && (
        <EditShoeModal 
          show={showEditModal} 
          onClose={() => setShowEditModal(false)} 
          shoe={editShoe} 
          onSave={handleEditShoe} 
        />
      )}

      {/* Modal xác nhận xóa giày */}
      <ConfirmationModal 
        show={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)} 
        onConfirm={handleDeleteShoe} 
      />
    </div>
  );
}

export default ShoeAdmin;