import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Cart from './components/Cart';
import ShoeDetail from './components/ShoeDetail';
import AdminDashboard from './components/ShoeAdmin';
import AddShoe from './components/AddShoeModal';
import Header from './components/Header'; 
import Footer from './components/Footer'; 
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <main id="root">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shoes/:id" element={<ShoeDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-shoe" element={<AddShoe />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
