import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const Detail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const typeRef = useRef(null);
  const statusRef = useRef(null);
  const routeRef = useRef(null);
  const incidentRef = useRef(null);
  const severityRef = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/vessels/${id}`)
      .then(response => {
        const v = response.data;
        if (nameRef.current) nameRef.current.value = v.name;
        if (typeRef.current) typeRef.current.value = v.type;
        if (statusRef.current) statusRef.current.value = v.status;
        if (routeRef.current) routeRef.current.value = v.route;
        if (incidentRef.current) incidentRef.current.value = v.incident;
        if (severityRef.current) severityRef.current.value = v.severity;
        if (dateRef.current) dateRef.current.value = v.date;
      })
      .catch(error => console.error('Ошибка загрузки:', error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedVessel = {
      name: nameRef.current.value,
      type: typeRef.current.value,
      status: statusRef.current.value,
      route: routeRef.current.value,
      incident: incidentRef.current.value,
      severity: severityRef.current.value,
      date: dateRef.current.value,
    };
    axios.put(`http://localhost:5000/vessels/${id}`, JSON.stringify(updatedVessel), {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => { alert('Данные обновлены!'); navigate('/'); })
      .catch(error => console.error('Ошибка обновления:', error));
  };

  const isReadOnly = user.role === 'viewer';
  const selectStyle = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' };
  const inputStyle = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' };
  const labelStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: '#333' };

  return (
    <div>
      <h1>{isReadOnly ? 'Просмотр судна' : 'Редактирование судна'}</h1>
      {isReadOnly && <p style={{ color: '#e67e22', marginBottom: '12px' }}>👁 Режим просмотра — редактирование недоступно</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '420px', marginTop: '16px' }}>
        <label style={labelStyle}>Название судна
          <input type="text" ref={nameRef} required style={inputStyle} disabled={isReadOnly} />
        </label>
        <label style={labelStyle}>Тип судна
          <select ref={typeRef} required style={selectStyle} disabled={isReadOnly}>
            {VESSEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label style={labelStyle}>Статус
          <select ref={statusRef} required style={selectStyle} disabled={isReadOnly}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label style={labelStyle}>Маршрут
          <input type="text" ref={routeRef} required style={inputStyle} disabled={isReadOnly} />
        </label>
        <label style={labelStyle}>Инцидент
          <select ref={incidentRef} required style={selectStyle} disabled={isReadOnly}>
            {INCIDENTS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
        <label style={labelStyle}>Уровень угрозы
          <select ref={severityRef} required style={selectStyle} disabled={isReadOnly}>
            {SEVERITIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label style={labelStyle}>Дата
          <input type="date" ref={dateRef} required style={inputStyle} disabled={isReadOnly} />
        </label>
        {!isReadOnly && (
          <button type="submit"
            style={{ padding: '10px', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer' }}>
            Сохранить изменения
          </button>
        )}
      </form>
    </div>
  );
};

export default Detail;
