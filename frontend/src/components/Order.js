import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Order.css';

function Order() {
  const [orderId, setOrderId] = useState(localStorage.getItem('orderId')); // Lấy orderId từ localStorage
  const [order, setOrder] = useState(null); // State để lưu trữ thông tin đơn hàng
  const [loading, setLoading] = useState(true); // State để hiển thị trạng thái loading
  const [error, setError] = useState(null); // State để hiển thị lỗi nếu có
  const [shoesData, setShoesData] = useState({}); // State để lưu trữ thông tin giày

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`https://shoe-shop-backend-qm9w.onrender.com/orders/${orderId}`); // Lấy đơn hàng dựa trên orderId
        setOrder(response.data); // Lưu dữ liệu đơn hàng vào state
        await fetchShoesData(response.data.items); // Gọi hàm để lấy dữ liệu giày
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to fetch order.'); // Cập nhật thông báo lỗi
      } finally {
        setLoading(false); // Đặt loading thành false khi hoàn thành
      }
    };

    if (orderId) {
      fetchOrder(); // Gọi hàm lấy đơn hàng nếu có orderId
    } else {
      setLoading(false); // Nếu không có orderId, đặt loading thành false
    }
  }, [orderId]);

  // Hàm để lấy thông tin giày từ server
  const fetchShoesData = async (items) => {
    const shoesPromises = items.map(item => axios.get(`https://shoe-shop-backend-qm9w.onrender.com/shoes/${item.shoeid}`));
    try {
      const responses = await Promise.all(shoesPromises);
      const shoesInfo = responses.reduce((acc, response) => {
        acc[response.data._id] = response.data; // Lưu thông tin giày theo shoeId
        return acc;
      }, {});
      setShoesData(shoesInfo); // Cập nhật state với thông tin giày
    } catch (error) {
      console.error('Error fetching shoes data:', error);
    }
  };

  // Tính tổng tiền từ items
  const calculateTotalPrice = () => {
    if (!order || !order.items) return 0; // Nếu không có đơn hàng hoặc không có items
    return order.items.reduce((total, item) => total + (shoesData[item.shoeid]?.price * item.quantity || 0), 0).toFixed(2);
  };

  // Hàm để xác định trạng thái xử lý
  const getProcessingStatus = () => {
    return order.shippingCode ? 'Processed' : 'Processing'; // Kiểm tra shippingCode
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Order Details</h1>
      {loading ? (
        <p>Loading...</p> // Hiển thị trạng thái loading
      ) : error ? (
        <p className="text-danger">{error}</p> // Hiển thị thông báo lỗi nếu có
      ) : order ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Phone</th>
                <th>Address</th>
                <th>Total Price</th>
                <th>Items</th>
                <th>Date</th>
                <th>Shipping Code</th> {/* Thêm cột Shipping Code */}
                <th>Status</th> {/* Thêm cột Status */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{order.phone}</td>
                <td>{order.address}</td>
                <td>${calculateTotalPrice()}</td> {/* Tính tổng tiền từ items */}
                <td>
                  <div>
                    {order.items && order.items.map(item => (
                      <div key={item.shoeid}>
                        {shoesData[item.shoeid] && ( // Kiểm tra xem dữ liệu giày có tồn tại không
                          <>
                            <img 
                              src={shoesData[item.shoeid].thum} 
                              alt={shoesData[item.shoeid].name} 
                              style={{ width: '50px', marginRight: '10px' }} 
                            />
                            {shoesData[item.shoeid].name} 
                            (Quantity: {item.quantity}, Price: ${shoesData[item.shoeid].price})
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td> {/* Sử dụng createdAt để hiển thị ngày giờ */}
                <td>{order.shippingCode || 'N/A'}</td> {/* Hiển thị shippingCode hoặc 'N/A' nếu không có */}
                <td>{getProcessingStatus()}</td> {/* Hiển thị trạng thái xử lý */}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>No order found.</p> // Nếu không tìm thấy đơn hàng
      )}
    </div>
  );
}

export default Order;
