import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData, //giữ các giá trị cũ
            [e.target.name]: e.target.value// e.target.name: là tên của ô input, e.target.value: là chữ người dùng gõ vào
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // ko bị f5 lại
        try {
            // Tạo login data đúng
            let loginData;
            if (isAdmin) {
                // Admin 
                loginData = { 
                    email: formData.email,
                    password: formData.password, 
                    isAdmin: true 
                };
            } else {
                // User 
                loginData = { 
                    email: formData.email, 
                    password: formData.password, 
                    isAdmin: false 
                };
            }

            console.log('Sending login data:', loginData);

            // Nếu là admin, gửi tới /login, không phải /auth/login
            const endpoint = isAdmin ? '/login' : '/auth/login';


            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}${endpoint}` ,
                loginData,
                { withCredentials: true }
            );

            console.log('Login response:', response.data);

            

            if (response.data && response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));

                if (response.data.user.role === 'admin') { 
                    alert('Admin login successful.');
                    navigate('/admin');
                } else {
                    alert(`Login successful! Hello ${formData.email}`);
                    navigate('/');
                }
            }
        } catch (err) {
            console.error('Login error:', err.response?.data || err);
            setError(err.response?.data?.message || 'Login failed');
            alert('Login failed! Please double-check your information.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isAdmin ? 'Admin Login' : 'User Login'}</h2>
                <form onSubmit={handleSubmit}>
                    
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                  
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">
                        Login
                    </button>
                    {!isAdmin && (
                        <div className="register-link mt-3 text-center">
                            <p>No account? <Link to="/register">Register now!</Link></p>
                        </div>
                    )}
                    <div className="toggle-form">
                        <button
                            type="button"
                            onClick={() => {
                                setIsAdmin(!isAdmin);
                                setFormData({ email: '', password: '' });
                                setError('');
                            }}
                            className="toggle-button"
                        >
                            Switch to {isAdmin ? 'User' : 'Admin'} Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;