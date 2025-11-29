import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, requireAdmin }) {
  const user = JSON.parse(localStorage.getItem('user'));
  // chưa đăng nhập -> chuyển sang trang login
  if (!user) {
    return <Navigate to="/login" />;
  }
  //nếu route yêu cầu là admin nhưng mà user -> chuyển về trang chủ
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  //Hợp lệ-> cho phép truy cập
  return children;
}

export default PrivateRoute;