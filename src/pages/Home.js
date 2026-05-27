import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SEVERITY_STYLES = {
  none:     { background: '#ffffff', label: '' },
  low:      { background: '#e8f5e9', label: '🟢 Низкий' },
  medium:   { background: '#fff8e1', label: '🟡 Средний' },
  high:     { background: '#fce4ec', label: '🔴 Высокий' },
  critical: { background: '#b71c1c', label: '🚨 Критический', color: '#fff' },
};

const Home = ({ user }) => {
  const [vessels, setVessels] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/vessels')
      .then(response => setVessels(response.data))
      .catch(error => console.error('Ошибка загрузки:', error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/vessels/${id}`)
      .then(() => setVessels(vessels.filter(v => v.id !== id)))
      .catch(error => console.error('Ошибка удаления:', error));
  };

  return (
    <div>
      <h1>Список судов</h1>
      <div style={{ marginBottom: '12px', display: 'flex', gap: '16px', fontSize: '13px', flexWrap: 'wrap' }}>
        <span style={{ background: '#e8f5e9', padding: '4px 10px', borderRadius: '4px' }}>🟢 Низкий уровень</span>
        <span style={{ background: '#fff8e1', padding: '4px 10px', borderRadius: '4px' }}>🟡 Средний уровень</span>
        <span style={{ background: '#fce4ec', padding: '4px 10px', borderRadius: '4px' }}>🔴 Высокий уровень</span>
        <span style={{ background: '#b71c1c', color: '#fff', padding: '4px 10px', borderRadius: '4px' }}>🚨 Критический</span>
      </div>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#1a3a5c', color: '#fff' }}>
          <tr>
            <th>Название</th>
            <th>Тип</th>
            <th>Статус</th>
            <th>Маршрут</th>
            <th>Инцидент</th>
            <th>Уровень</th>
            <th>Дата</th>
            {user.role !== 'viewer' && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {vessels.map(vessel => {
            const sev = SEVERITY_STYLES[vessel.severity] || SEVERITY_STYLES.none;
            return (
              <tr key={vessel.id} style={{ background: sev.background, color: sev.color || '#000' }}>
                <td><Link to={`/detail/${vessel.id}`} style={{ color: sev.color || '#1a3a5c' }}>{vessel.name}</Link></td>
                <td>{vessel.type}</td>
                <td>{vessel.status}</td>
                <td>{vessel.route}</td>
                <td>{vessel.incident}</td>
                <td>{sev.label}</td>
                <td>{vessel.date}</td>
                {user.role !== 'viewer' && (
                  <td>
                    <Link to={`/detail/${vessel.id}`} style={{ color: sev.color || '#1a3a5c' }}>✏️</Link>
                    {' '}
                    {user.role === 'admin' && (
                      <button onClick={() => handleDelete(vessel.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: sev.color || '#c0392b' }}>
                        🗑️
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
