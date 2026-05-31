import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    if (showRegister) {
      return <Register onBack={() => setShowRegister(false)} />;
    }
    return <Login onLogin={setCurrentUser} onRegister={() => setShowRegister(true)} />;
  }

  let roleLabel = '';
  if (currentUser.role === 'admin') roleLabel = '👑 Администратор';
  else if (currentUser.role === 'operator') roleLabel = '🔧 Оператор';
  else roleLabel = '👁 Наблюдатель';

  return (
    <Router>
      <nav style={{ padding: '10px 20px', background: '#1a3a5c', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>⚓ Безопасность водного транспорта</span>
        <Link to="/" style={{ color: '#90caf9' }}>Главная</Link>
        {currentUser.role !== 'viewer' && (
          <Link to="/add" style={{ color: '#90caf9' }}>Добавить судно</Link>
        )}
        <span style={{ marginLeft: 'auto', color: '#90caf9', fontSize: '13px' }}>
          {roleLabel} — {currentUser.username || currentUser.email}
        </span>
        <button
          onClick={handleLogout}
          style={{ background: 'transparent', border: '1px solid #90caf9', color: '#90caf9', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
          Выйти
        </button>
      </nav>
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home user={currentUser} />} />
          <Route path="/detail/:id" element={<Detail user={currentUser} />} />
          <Route path="/add" element={
            currentUser.role !== 'viewer' ? <Form user={currentUser} /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
