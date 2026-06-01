import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    wrap: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
      padding: '20px'
    },
    card: {
      width: '100%',
      maxWidth: '420px',
      background: '#fff',
      padding: '32px',
      borderRadius: '16px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
    },
    title: {
      margin: '0 0 10px',
      color: '#1a3a5c',
      textAlign: 'center'
    },
    subtitle: {
      margin: '0 0 24px',
      textAlign: 'center',
      color: '#4b5d73',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      marginBottom: '14px',
      border: '1px solid #cfd8dc',
      borderRadius: '10px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '12px 14px',
      background: '#1a3a5c',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      cursor: 'pointer'
    },
    linkBtn: {
      width: '100%',
      marginTop: '12px',
      padding: '12px 14px',
      background: '#eef4fb',
      color: '#1a3a5c',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      cursor: 'pointer'
    },
    error: {
      marginBottom: '14px',
      color: '#c62828',
      background: '#ffebee',
      padding: '10px 12px',
      borderRadius: '8px',
      fontSize: '14px'
    }
  };

  return (
    <div style={s.wrap}>
      <form onSubmit={handleSubmit} style={s.card}>
        <h2 style={s.title}>Вход</h2>
        <p style={s.subtitle}>Система безопасности водного транспорта</p>

        {error && <div style={s.error}>{error}</div>}

        <input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={s.input}
          required
        />

        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={s.input}
          required
        />

        <button type="submit" style={s.button} disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>

        <button type="button" style={s.linkBtn} onClick={onRegister}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export default Login;