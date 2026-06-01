import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const passwordRules = [
  { test: (v) => v.length >= 8, label: 'Минимум 8 символов' },
  { test: (v) => /[A-ZА-Я]/.test(v), label: 'Хотя бы одна заглавная буква' },
  { test: (v) => /[a-zа-я]/.test(v), label: 'Хотя бы одна строчная буква' },
  { test: (v) => /[0-9]/.test(v), label: 'Хотя бы одна цифра' },
  { test: (v) => /[^A-Za-zА-Яа-я0-9]/.test(v), label: 'Хотя бы один спецсимвол' },
];

function Register({ onBack }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const allRulesPass = passwordRules.every((r) => r.test(password));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/register`, {
        username,
        email,
        password,
      });

      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/verify`, { email, code });
      setMessage(res.data.message);
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка подтверждения');
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
      maxWidth: '460px',
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
    backBtn: {
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
    },
    ok: {
      marginBottom: '14px',
      color: '#2e7d32',
      background: '#e8f5e9',
      padding: '10px 12px',
      borderRadius: '8px',
      fontSize: '14px'
    },
    rules: {
      marginBottom: '14px',
      fontSize: '13px',
      color: '#455a64'
    },
    ruleOk: {
      display: 'block',
      color: '#2e7d32',
      marginBottom: '4px'
    },
    ruleBad: {
      display: 'block',
      color: '#607d8b',
      marginBottom: '4px'
    }
  };

  return (
    <div style={s.wrap}>
      <form onSubmit={step === 1 ? handleRegister : handleVerify} style={s.card}>
        <h2 style={s.title}>Регистрация</h2>
        <p style={s.subtitle}>Создание учётной записи</p>

        {error && <div style={s.error}>{error}</div>}
        {message && <div style={s.ok}>{message}</div>}

        {step === 1 ? (
          <>
            <input
              type="text"
              placeholder="Введите логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={s.input}
              required
            />

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

            <div style={s.rules}>
              {passwordRules.map((rule, i) => (
                <span key={i} style={rule.test(password) ? s.ruleOk : s.ruleBad}>
                  {rule.test(password) ? '✅' : '○'} {rule.label}
                </span>
              ))}
            </div>

            <button type="submit" style={s.button} disabled={!allRulesPass || loading}>
              {loading ? 'Отправка...' : 'Получить код подтверждения'}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Введите код из email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={s.input}
              required
            />

            <button type="submit" style={s.button} disabled={loading}>
              {loading ? 'Проверка...' : 'Подтвердить регистрацию'}
            </button>
          </>
        )}

        <button type="button" style={s.backBtn} onClick={onBack}>
          Назад ко входу
        </button>
      </form>
    </div>
  );
}

export default Register;