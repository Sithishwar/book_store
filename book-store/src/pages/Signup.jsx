import React, { useState } from 'react';
import '../styles/Signup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/register', {
        username: form.username,
        password: form.password,
      });

      if (response.data === 'Registration successful!') {
        alert('Account created successfully!');
        navigate('/login');
      } else {
        alert('Registration failed! Try another username.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Error connecting to server');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Create Account</h1>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
}
