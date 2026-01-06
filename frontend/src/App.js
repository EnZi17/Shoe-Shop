import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Cart from './components/Cart';
import ShoeDetail from './components/ShoeDetail';
import AdminDashboard from './components/ShoeAdmin';
import AddShoe from './components/AddShoeModal';
import Header from './components/Header'; 
import Footer from './components/Footer'; 
import Login from './components/AdminLogin';
import Order from './components/Order';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/shoes/:id" element={<ShoeDetail />} />
          <Route path="/admin" element={
            <PrivateRoute requireAdmin={true}><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/admin/add-shoe" element={
            <PrivateRoute requireAdmin={true}><AddShoe /></PrivateRoute>
          } />
          <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />

      </div>
    </Router>
  );
}

export default App;
