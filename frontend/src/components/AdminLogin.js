import { useState } from 'react';
import axios from 'axios';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://shoe-shop-backend-qm9w.onrender.com/login', { password });
            if (response.data.message === 'Welcome to admin page') {
                window.location.href = '/admin';
            }
        } catch (err) {
            setError('Sai mật khẩu');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                placeholder="Input Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default AdminLogin;
