import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import AuthPage from './components/AuthPage';

const App = () => {
  const [auth, setAuth] = useState(localStorage.getItem('token') || '');
  const [id, setId] = useState(localStorage.getItem('id') || '');

  const handleLogout = () => {
    setAuth('');
    setId('');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
  };

  const handleLogin = (token, id) => {
    setAuth(token);
    setId(id);
    localStorage.setItem('token', token);
    localStorage.setItem('id', id);
  };

  return (
    <Router>
      <div className="flex">
        {auth && <Sidebar handleLogout={handleLogout} id={id} />}
        <div className={`flex-1 ${auth ? 'ml-64' : ''}`}>
          <Routes>
            <Route path="/auth" element={<AuthPage setAuth={handleLogin} />} />
            <Route path="/profile/:id" element={auth ? <ProfilePage auth={auth} /> : <Navigate to="/auth" />} />
            <Route path="/" element={auth ? <HomePage /> : <Navigate to="/auth" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

