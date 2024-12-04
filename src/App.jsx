// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Products from './pages/Products';

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/products">Inicio</Link></li>
          <li><Link to="/">Gestión de productos</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
};

export default App;
