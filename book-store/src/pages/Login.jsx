import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter valid credentials');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username: email,
        password: password
      });

      if (response.data.status === 'success') {
        localStorage.setItem('userId', response.data.userId);
        alert('Login successful!');
        navigate('/home');
      } else {
        alert(response.data.message || 'Invalid credentials!');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Error connecting to server');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')}>Sign up</span>
        </p>
      </div>
    </div>
  );
}
