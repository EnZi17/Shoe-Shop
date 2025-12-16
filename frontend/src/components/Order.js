import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Order.css';

function Order() {
  // Đổi tên thành orders (số nhiều) và khởi tạo là mảng rỗng []
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shoesData, setShoesData] = useState({});

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Nếu không có user thì dừng
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserOrders = async () => {
      try {
        // API trả về: [{...}, {...}] (Mảng danh sách đơn hàng)
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/orders/user/${user.id}`,
          { withCredentials: true }
        );

        console.log("Dữ liệu nhận được:", response.data);
        setOrders(response.data); // Lưu mảng vào state

        // Gom tất cả các món hàng trong tất cả đơn hàng để đi lấy thông tin giày
        // .flatMap giúp gộp nhiều mảng items con thành 1 mảng to
        const allItems = response.data.flatMap(order => order.items);
        await fetchShoesData(allItems);

      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Không thể tải lịch sử đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user?.id]); // Chỉ chạy lại khi ID user thay đổi

  const fetchShoesData = async (items) => {
    if (!items || items.length === 0) return;

    // Lọc trùng lặp ID để không gọi API thừa
    const uniqueShoeIds = [...new Set(items.map(item => item.shoeid))];

    const shoesPromises = uniqueShoeIds.map(id => 
       axios.get(`${process.env.REACT_APP_BACKEND_URL}/shoes/${id}`).catch(e => null)
    );

    try {
      const responses = await Promise.all(shoesPromises);
      const shoesInfo = responses.reduce((acc, response) => {
        if(response && response.data) {
             acc[response.data._id] = response.data;
        }
        return acc;
      }, {});
      
      // Gộp với dữ liệu cũ (nếu có)
      setShoesData(prev => ({...prev, ...shoesInfo}));
    } catch (error) {
      console.error('Error fetching shoes data:', error);
    }
  };

  // Hàm tính tổng tiền cho MỘT đơn hàng cụ thể
  const calculateOrderTotal = (singleOrder) => {
    if (!singleOrder.items) return 0;
    return singleOrder.items.reduce((total, item) => 
        total + ((shoesData[item.shoeid]?.price || 0) * item.quantity), 0
    ).toFixed(2);
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Lịch sử đơn hàng</h1>
      
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : orders.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Mã đơn</th>
                <th>SĐT & Địa chỉ</th>
                <th>Tổng tiền</th>
                <th>Sản phẩm</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {/* QUAN TRỌNG: Dùng .map() để duyệt qua từng đơn hàng trong mảng */}
              {orders.map((singleOrder) => (
                <tr key={singleOrder._id}>
                  <td>{singleOrder._id.slice(-6).toUpperCase()}</td>
                  <td>
                    <div><strong>SĐT:</strong> {singleOrder.phone}</div>
                    <div><strong>ĐC:</strong> {singleOrder.address}</div>
                  </td>
                  
                  {/* Tính tiền cho từng đơn hàng */}
                  <td className="fw-bold text-success">
                    ${calculateOrderTotal(singleOrder)}
                  </td>

                  <td>
                    {singleOrder.items.map((item, idx) => (
                      <div key={idx} className="d-flex align-items-center mb-2 border-bottom pb-1">
                        {shoesData[item.shoeid] ? (
                          <>
                            <img 
                              src={shoesData[item.shoeid].thum} 
                              alt="" 
                              style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }} 
                            />
                            <small>
                                {shoesData[item.shoeid].name} <br/>
                                <span className="text-muted">
                                    ${shoesData[item.shoeid].price} x {item.quantity}
                                </span>
                            </small>
                          </>
                        ) : (
                          <small>Đang tải giày...</small>
                        )}
                      </div>
                    ))}
                  </td>
                  
                  <td>{new Date(singleOrder.createdAt).toLocaleDateString()}</td>
                  
                  <td>
                    {singleOrder.shippingCode ? 
                        <span className="badge bg-success">Đã giao</span> : 
                        <span className="badge bg-warning text-dark">Đang xử lý</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">Bạn chưa có đơn hàng nào.</div>
      )}
    </div>
  );
}

export default Order;