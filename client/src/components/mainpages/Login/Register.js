import React, { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import configURL from '../../../configURL';

function Register() {
  const state = useContext(GlobalState);
  const [, setToken] = state.token;
  const [isLogged, setIsLogged] = state.userAPI.isLogged;

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${configURL}/user/register`, user, {
        withCredentials: true
      });

      setToken(res.data.msg);
      setIsLogged(true);
      localStorage.setItem('firstLogin', true);

      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  if (isLogged) return <Navigate to="/" replace />;

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={registerSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          name="name"
          required
          placeholder="Name"
          value={user.name}
          onChange={onChangeInput}
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={user.email}
          onChange={onChangeInput}
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          value={user.password}
          onChange={onChangeInput}
        />
        <div className="auth-actions">
          <button type="submit">Register</button>
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
