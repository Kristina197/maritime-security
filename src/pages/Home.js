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

const ROLES = [
  { value: 'admin',    label: '👑 Администратор' },
  { value: 'operator', label: '🔧 Оператор' },
  { value: 'viewer',   label: '👁 Наблюдатель' },
];

const selectStyle = {
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '13px',
  background: '#fff',
  cursor: 'pointer',
};

const inputStyle = {
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '13px',
  minWidth: '180px',
};

const Home = ({ user }) => {
  const [tab, setTab] = useState('vessels');
  const [vessels, setVessels] = useState([]);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');

  // Фильтры
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');

  useEffect(() => {
    axios.get('/vessels')
      .then(r => setVessels(r.data))
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    if (tab === 'users' && user.role === 'admin') {
      axios.get('/users')
        .then(r => setUsers(r.data))
        .catch(e => console.error(e));
    }
  }, [tab, user.role]);

  const handleDelete = (id) => {
    if (!window.confirm('Удалить судно?')) return;
    axios.delete(`/vessels/${id}`)
      .then(() => setVessels(vessels.filter(v => v.id !== id)))
      .catch(e => console.error(e));
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm('Удалить пользователя?')) return;
    axios.delete(`/users/${id}`)
      .then(() => {
        setUsers(users.filter(u => u.id !== id));
        setMsg('Пользователь удалён');
        setTimeout(() => setMsg(''), 3000);
      })
      .catch(e => console.error(e));
  };

  const handleRoleChange = (id, newRole) => {
    axios.patch(`/users/${id}`, { role: newRole })
      .then(() => {
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
        setMsg('Роль обновлена ✅');
        setTimeout(() => setMsg(''), 3000);
      })
      .catch(e => console.error(e));
  };

  const tabStyle = (t) => ({
    padding: '8px 20px',
    cursor: 'pointer',
    border: 'none',
    borderBottom: tab === t ? '3px solid #1a3a5c' : '3px solid transparent',
    background: 'transparent',
    fontWeight: tab === t ? 'bold' : 'normal',
    color: tab === t ? '#1a3a5c' : '#666',
    fontSize: '14px',
  });

  // Уникальные значения для выпадающих списков
  const uniqueTypes    = [...new Set(vessels.map(v => v.type).filter(Boolean))];
  const uniqueStatuses = [...new Set(vessels.map(v => v.status).filter(Boolean))];

  // Фильтрация
  const filteredVessels = vessels.filter(v => {
    const matchName     = !filterName     || v.name?.toLowerCase().includes(filterName.toLowerCase());
    const matchType     = !filterType     || v.type === filterType;
    const matchStatus   = !filterStatus   || v.status === filterStatus;
    const matchSeverity = !filterSeverity || v.severity === filterSeverity;
    return matchName && matchType && matchStatus && matchSeverity;
  });

  const resetFilters = () => {
    setFilterName('');
    setFilterType('');
    setFilterStatus('');
    setFilterSeverity('');
  };

  const hasActiveFilters = filterName || filterType || filterStatus || filterSeverity;

  return (
    <div>
      {/* Вкладки */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
        <button style={tabStyle('vessels')} onClick={() => setTab('vessels')}>⚓ Суда</button>
        {user.role === 'admin' && (
          <button style={tabStyle('users')} onClick={() => setTab('users')}>👥 Пользователи</button>
        )}
      </div>

      {msg && (
        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '6px', padding: '10px 16px', marginBottom: '16px', fontSize: '13px', color: '#2e7d32' }}>
          {msg}
        </div>
      )}

      {/* Вкладка судов */}
      {tab === 'vessels' && (
        <div>
          <h1 style={{ marginBottom: '12px' }}>Список судов</h1>

          {/* Легенда */}
          <div style={{ marginBottom: '12px', display: 'flex', gap: '16px', fontSize: '13px', flexWrap: 'wrap' }}>
            <span style={{ background: '#e8f5e9', padding: '4px 10px', borderRadius: '4px' }}>🟢 Низкий уровень</span>
            <span style={{ background: '#fff8e1', padding: '4px 10px', borderRadius: '4px' }}>🟡 Средний уровень</span>
            <span style={{ background: '#fce4ec', padding: '4px 10px', borderRadius: '4px' }}>🔴 Высокий уровень</span>
            <span style={{ background: '#b71c1c', color: '#fff', padding: '4px 10px', borderRadius: '4px' }}>🚨 Критический</span>
          </div>

          {/* Фильтры */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px', padding: '12px 16px', background: '#f5f7fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a3a5c' }}>🔍 Фильтры:</span>

            <input
              style={inputStyle}
              placeholder="Поиск по названию..."
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
            />

            <select style={selectStyle} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="">Все типы</option>
              {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <select style={selectStyle} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Все статусы</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select style={selectStyle} value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
              <option value="">Все уровни</option>
              <option value="none">Без инцидента</option>
              <option value="low">🟢 Низкий</option>
              <option value="medium">🟡 Средний</option>
              <option value="high">🔴 Высокий</option>
              <option value="critical">🚨 Критический</option>
            </select>

            {hasActiveFilters && (
              <button onClick={resetFilters} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#c0392b' }}>
                ✕ Сбросить
              </button>
            )}

            <span style={{ fontSize: '12px', color: '#999', marginLeft: 'auto' }}>
              Показано: {filteredVessels.length} из {vessels.length}
            </span>
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
              {filteredVessels.length === 0 ? (
                <tr>
                  <td colSpan={user.role !== 'viewer' ? 8 : 7} style={{ textAlign: 'center', padding: '24px', color: '#999', fontStyle: 'italic' }}>
                    Суда не найдены. Попробуйте изменить фильтры.
                  </td>
                </tr>
              ) : (
                filteredVessels.map(vessel => {
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
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Вкладка пользователей (только для админа) */}
      {tab === 'users' && user.role === 'admin' && (
        <div>
          <h1 style={{ marginBottom: '16px' }}>Управление пользователями</h1>
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#1a3a5c', color: '#fff' }}>
              <tr>
                <th>ID</th>
                <th>Логин</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Назначить роль</th>
                <th>Удалить</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ background: u.id === user.id ? '#e3f2fd' : '#fff' }}>
                  <td style={{ fontSize: '12px', color: '#999' }}>{u.id}</td>
                  <td><b>{u.username || '—'}</b></td>
                  <td>{u.email || '—'}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '12px',
                      background: u.role === 'admin' ? '#fff3e0' : u.role === 'operator' ? '#e8f5e9' : '#f3e5f5',
                    }}>
                      {ROLES.find(r => r.value === u.role)?.label || u.role || '—'}
                    </span>
                  </td>
                  <td>
                    {u.id !== user.id ? (
                      <select
                        value={u.role || ''}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}>
                        {ROLES.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#999' }}>это вы</span>
                    )}
                  </td>
                  <td>
                    {u.id !== user.id ? (
                      <button onClick={() => handleDeleteUser(u.id)}
                        style={{ background: '#c0392b', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '13px' }}>
                        🗑️ Удалить
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#999' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
