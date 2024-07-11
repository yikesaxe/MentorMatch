import React, { useState } from 'react';
import axios from 'axios';

const AuthPage = ({ setAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/login', { email, password })
      .then(response => {
        const token = response.data.token;
        const id = response.data.id;
        setAuth(token, id);
        localStorage.setItem('token', token);  // Store token in local storage
        localStorage.setItem('id', id);  // Store id in local storage
        setError('');
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setError('Login failed');
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/register', { firstName, lastName, email, password })
      .then(response => {
        setSuccess('Registration successful. Please log in.');
        setError('');
        setIsLogin(true); // Switch to login after successful registration
      })
      .catch(error => {
        console.error('Error registering:', error);
        setError('Registration failed');
        setSuccess('');
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login' : 'Register'}</h1>
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-gray-700">First Name:</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Last Name:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            {isLogin ? 'Login' : 'Register'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 ml-1">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
