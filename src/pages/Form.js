import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VESSEL_TYPES = ['Пассажирский паром', 'Речная баржа', 'Танкер', 'Грузовой сухогруз', 'Буксир', 'Рыболовное судно', 'Патрульный катер'];
const STATUSES = ['Активен', 'Под наблюдением', 'Задержан', 'В ремонте', 'Выведен из эксплуатации'];
const INCIDENTS = ['Нет', 'Утечка топлива', 'Пожар на борту', 'Нарушение правил перевозки', 'Столкновение', 'Посадка на мель', 'Потеря связи'];
const SEVERITIES = [
  { value: 'none', label: 'Нет инцидента' },
  { value: 'low', label: '🟢 Низкий' },
  { value: 'medium', label: '🟡 Средний' },
  { value: 'high', label: '🔴 Высокий' },
  { value: 'critical', label: '🚨 Критический' },
];

const Form = ({ user }) => {
  const nameRef = useRef(null);
  const typeRef = useRef(null);
  const statusRef = useRef(null);
  const routeRef = useRef(null);
  const incidentRef = useRef(null);
  const severityRef = useRef(null);
  const dateRef = useRef(null);
  const navigate = useNavigate();

  if (user.role === 'viewer') {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#c0392b' }}>⛔ У вас нет прав для добавления судов</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVessel = {
      name: nameRef.current.value,
      type: typeRef.current.value,
      status: statusRef.current.value,
      route: routeRef.current.value,
      incident: incidentRef.current.value,
      severity: severityRef.current.value,
      date: dateRef.current.value,
    };
    axios.post('/vessels', JSON.stringify(newVessel), {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => navigate('/'))
      .catch(error => console.error('Ошибка создания:', error));
  };

  const selectStyle = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' };
  const inputStyle = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' };
  const labelStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: '#333' };

  return (
    <div>
      <h1>Добавить судно</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '420px', marginTop: '16px' }}>
        <label style={labelStyle}>Название судна
          <input type="text" ref={nameRef} required placeholder="Введите название" style={inputStyle} />
        </label>
        <label style={labelStyle}>Тип судна
          <select ref={typeRef} required style={selectStyle}>
            <option value="">— Выберите тип —</option>
            {VESSEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label style={labelStyle}>Статус
          <select ref={statusRef} required style={selectStyle}>
            <option value="">— Выберите статус —</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label style={labelStyle}>Маршрут
          <input type="text" ref={routeRef} required placeholder="Например: Москва — Казань" style={inputStyle} />
        </label>
        <label style={labelStyle}>Инцидент
          <select ref={incidentRef} required style={selectStyle}>
            <option value="">— Выберите инцидент —</option>
            {INCIDENTS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
        <label style={labelStyle}>Уровень угрозы
          <select ref={severityRef} required style={selectStyle}>
            <option value="">— Выберите уровень —</option>
            {SEVERITIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label style={labelStyle}>Дата
          <input type="date" ref={dateRef} required style={inputStyle} />
        </label>
        <button type="submit"
          style={{ padding: '10px', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer' }}>
          Добавить судно
        </button>
      </form>
    </div>
  );
};

export default Form;
