import React, { useRef, useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    axios.get('http://localhost:5000/users')
      .then(res => {
        const found = res.data.find(
          u => u.username === usernameRef.current.value
            && u.password === passwordRef.current.value
        );
        if (found) {
          onLogin(found);
        } else {
          setErrorMsg('Неверный логин или пароль');
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMsg('Ошибка подключения к серверу');
      });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1f35', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', width: '340px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#1a3a5c' }}>⚓ Вход в систему</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: '13px' }}>
          Безопасность водного транспорта
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '4px' }}>Логин</label>
            <input ref={usernameRef} type="text" required placeholder="Введите логин"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '4px' }}>Пароль</label>
            <input ref={passwordRef} type="password" required placeholder="Введите пароль"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          {errorMsg && (
            <p style={{ color: '#c0392b', fontSize: '13px', margin: 0 }}>⚠️ {errorMsg}</p>
          )}
          <button type="submit"
            style={{ padding: '11px', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer', marginTop: '4px' }}>
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
