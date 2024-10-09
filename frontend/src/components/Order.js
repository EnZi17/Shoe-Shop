import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Order.css';

function Order() {
  const [orderId, setOrderId] = useState(localStorage.getItem('orderId')); 
  const [order, setOrder] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [shoesData, setShoesData] = useState({}); 

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`https://shoe-shop-backend-qm9w.onrender.com/orders/${orderId}`); 
        setOrder(response.data);
        await fetchShoesData(response.data.items); 
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to fetch order.'); 
      } finally {
        setLoading(false); 
      }
    };

    if (orderId) {
      fetchOrder(); 
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchShoesData = async (items) => {
    const shoesPromises = items.map(item => axios.get(`https://shoe-shop-backend-qm9w.onrender.com/shoes/${item.shoeid}`));
    try {
      const responses = await Promise.all(shoesPromises);
      const shoesInfo = responses.reduce((acc, response) => {
        acc[response.data._id] = response.data; 
        return acc;
      }, {});
      setShoesData(shoesInfo);
    } catch (error) {
      console.error('Error fetching shoes data:', error);
    }
  };

  const calculateTotalPrice = () => {
    if (!order || !order.items) return 0; 
    return order.items.reduce((total, item) => total + (shoesData[item.shoeid]?.price * item.quantity || 0), 0).toFixed(2);
  };

  const getProcessingStatus = () => {
    return order.shippingCode ? 'Processed' : 'Processing'; 
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Order Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p> 
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
                <th>Shipping Code</th> {}
                <th>Status</th> {}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{order.phone}</td>
                <td>{order.address}</td>
                <td>${calculateTotalPrice()}</td> {}
                <td>
                  <div>
                    {order.items && order.items.map(item => (
                      <div key={item.shoeid}>
                        {shoesData[item.shoeid] && ( 
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
                <td>{new Date(order.createdAt).toLocaleString()}</td> {}
                <td>{order.shippingCode || 'N/A'}</td> {}
                <td>{getProcessingStatus()}</td> {}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>No order found.</p>  
      )}
    </div>
  );
}

export default Order;
