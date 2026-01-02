import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Dùng axios cho đồng bộ với cả dự án
import { Button, Table, Form } from 'react-bootstrap';
import AddShoeModal from './AddShoeModal';
import EditShoeModal from './EditShoeModal';
import ConfirmationModal from './ConfirmationModal';

function ShoeAdmin() {
  const [shoes, setShoes] = useState([]);
  const [orders, setOrders] = useState([]); // State lưu đơn hàng
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [editShoe, setEditShoe] = useState(null);
  const [shoeToDelete, setShoeToDelete] = useState(null);

  // State xử lý nhập mã vận đơn
  const [shippingCode, setShippingCode] = useState('');

  //GỌI API LẤY DỮ LIỆU

  // Hàm lấy giày
  const loadShoes = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/shoes`);
      // Kiểm tra dữ liệu trả về để set state an toàn
      const data = res.data;
      if (data.shoes && Array.isArray(data.shoes)) {
        setShoes(data.shoes);
      } else if (Array.isArray(data)) {
        setShoes(data);
      } else {
        setShoes([]);
      }
    } catch (error) {
      console.error('Error loading shoes:', error);
    }
  };

  // Hàm lấy đơn hàng 
  const loadOrders = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  // Chạy khi trang vừa mở
  useEffect(() => {
    loadShoes();
    loadOrders();
  }, []);

  //CÁC HÀM XỬ LÝ GIÀY (SHOES)

  const handleAddShoe = async (newShoe) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/shoes`, newShoe);
      loadShoes(); // Load lại danh sách sau khi thêm
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding shoe:', error);
    }
  };

  const handleEditShoe = async (updatedShoe) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/shoes/${updatedShoe._id}`, updatedShoe);
      loadShoes(); // Load lại danh sách
      setShowEditModal(false);
    } catch (error) {
      console.error('Error editing shoe:', error);
    }
  };

  const handleDeleteShoe = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/shoes/${shoeToDelete}`);
      loadShoes();
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error deleting shoe:', error);
    }
  };

  //CÁC HÀM XỬ LÝ ĐƠN HÀNG (ORDERS)

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/orders/${orderId}`);
      loadOrders(); // Load lại bảng order
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleConfirmShippingCode = async (orderId) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/orders/${orderId}`, { shippingCode });
      loadOrders();
      setShippingCode(''); // Reset ô nhập
      alert("Cập nhật vận đơn thành công!");
    } catch (error) {
      console.error('Error updating shipping code:', error);
    }
  };

  //GIAO DIỆN (RENDER)
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
        Add New Shoe
      </Button>

      {/* BẢNG 1: QUẢN LÝ GIÀY */}
      <h3>Product Management</h3>
      <Table striped bordered hover>
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
              <td>
                {shoe.quantity === 0 ? (
                  <span className="badge bg-danger">HẾT HÀNG</span>
                ) : shoe.quantity < 5 ? (
                  <span className="text-danger fw-bold">{shoe.quantity} (Sắp hết)</span>
                ) : (
                  <span className="text-success fw-bold">{shoe.quantity}</span>
                )}
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => {
                  setEditShoe(shoe);
                  setShowEditModal(true);
                }}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => {
                  setShoeToDelete(shoe._id);
                  setShowConfirmModal(true);
                }}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* BẢNG 2: QUẢN LÝ ĐƠN HÀNG*/}
      <h3 className="mt-5">Order Management</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Info</th>
            <th>Items</th>
            <th>Shipping Code</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td><small>{order._id}</small></td>
              <td>
                <div><strong>Phone:</strong> {order.phone}</div>
                <div><strong>Addr:</strong> {order.address}</div>
              </td>

              {/* Hiển thị chi tiết sản phẩm trong đơn */}
              <td>
                {order.items.map((item, idx) => {
                  // Tìm thông tin giày trong list shoes để hiện tên/ảnh
                  const shoeInfo = shoes.find(s => s._id === item.shoeid);
                  return (
                    <div key={idx} className="d-flex align-items-center mb-1">
                      {shoeInfo && (
                        <img src={shoeInfo.thum} alt="" style={{ width: '30px', marginRight: '5px' }} />
                      )}
                      <small>
                        {shoeInfo ? shoeInfo.name : 'Unknown Shoe'}
                        <span className="fw-bold"> (x{item.quantity})</span>
                      </small>
                    </div>
                  );
                })}
              </td>

              {/* Cột nhập mã vận đơn */}
              <td>
                {order.shippingCode ? (
                  <span className="text-success fw-bold">{order.shippingCode}</span>
                ) : (
                  <div className="d-flex">
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Code..."
                      onChange={(e) => setShippingCode(e.target.value)}
                    />
                    <Button size="sm" variant="success" className="ms-1"
                      onClick={() => handleConfirmShippingCode(order._id)}>
                      OK
                    </Button>
                  </div>
                )}
              </td>

              <td><small>{new Date(order.createdAt).toLocaleDateString()}</small></td>

              <td>
                <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order._id)}>
                  Del
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* CÁC MODAL */}
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