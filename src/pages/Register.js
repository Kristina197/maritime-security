import React, { useState } from 'react';
import axios from 'axios';

const passwordRules = [
  { test: p => p.length >= 8, label: 'Минимум 8 символов' },
  { test: p => /[A-Z]/.test(p), label: 'Хотя бы одна заглавная буква' },
  { test: p => /[0-9]/.test(p), label: 'Хотя бы одна цифра' },
  { test: p => /[!@#$%^&*()_+\-=\[\]{};:,.<>?]/.test(p), label: 'Хотя бы один спецсимвол (!@#$%^&*)' },
];

const s = {
  wrap: { minHeight: '100vh', background: '#0d1f35', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { background: '#fff', padding: '40px', borderRadius: '12px', width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  title: { textAlign: 'center', marginBottom: '8px', color: '#1a3a5c' },
  sub: { textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: '13px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  label: { fontSize: '13px', color: '#555', display: 'block', marginBottom: '4px' },
  input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  btn: { padding: '11px', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer' },
  btnBack: { padding: '10px', background: 'transparent', color: '#1a3a5c', border: '1px solid #1a3a5c', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' },
  error: { color: '#c0392b', fontSize: '13px', margin: 0 },
  codeInput: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '28px', boxSizing: 'border-box', letterSpacing: '10px', textAlign: 'center', fontWeight: 'bold' },
  ruleOk: { color: '#27ae60', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' },
  ruleBad: { color: '#aaa', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' },
};

const Register = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const allRulesPass = passwordRules.every(r => r.test(password));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!allRulesPass) return setError('Пароль не соответствует требованиям');
    setLoading(true);
    try {
      await axios.post('/auth/register', { username, email, password });
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
    setLoading(true);
    try {
      await axios.post('/auth/verify', { email, code });
      alert('✅ Регистрация успешна! Войдите с вашим email и паролем.');
      onBack();
    } catch (err) {
      setError(err.response?.data?.error || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <h2 style={s.title}>⚓ Регистрация</h2>
        <p style={s.sub}>Безопасность водного транспорта</p>

        {step === 1 ? (
          <form onSubmit={handleRegister} style={s.form}>
            <div>
              <label style={s.label}>Логин</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                required placeholder="Придумайте логин" style={s.input} />
            </div>
            <div>
              <label style={s.label}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="your@email.com" style={s.input} />
            </div>
            <div>
              <label style={s.label}>Пароль</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="Придумайте пароль" style={s.input} />
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {passwordRules.map((rule, i) => (
                  <span key={i} style={rule.test(password) ? s.ruleOk : s.ruleBad}>
                    {rule.test(password) ? '✅' : '○'} {rule.label}
                  </span>
                ))}
              </div>
            </div>
            {error && <p style={s.error}>⚠️ {error}</p>}
            <button type="submit" style={{ ...s.btn, opacity: allRulesPass ? 1 : 0.6 }} disabled={loading}>
              {loading ? 'Отправка...' : 'Зарегистрироваться'}
            </button>
            <button type="button" style={s.btnBack} onClick={onBack}>← Назад к входу</button>
          </form>
        ) : (
          <form onSubmit={handleVerify} style={s.form}>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6 }}>
              На <strong>{email}</strong> отправлен 6-значный код. Введите его ниже:
            </p>
            <div>
              <label style={s.label}>Код подтверждения</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value)}
                required maxLength={6} placeholder="______" style={s.codeInput} />
            </div>
            {error && <p style={s.error}>⚠️ {error}</p>}
            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? 'Проверка...' : 'Подтвердить'}
            </button>
            <button type="button" style={s.btnBack} onClick={() => { setStep(1); setError(''); }}>← Назад</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
