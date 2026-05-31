const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

const DB_PATH = path.join(__dirname, 'db.json');
const pendingVerifications = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'butkris06@gmail.com',
    pass: 'ghtppqycfrffkotp',
  },
});

function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }

    const db = readDB();
    const users = db.users || [];

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email уже зарегистрирован' });
    }

    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Логин уже занят' });
    }

    const code = generateCode();
    const expires = Date.now() + 10 * 60 * 1000;
    pendingVerifications[email] = { code, password, username, expires };

    await transporter.sendMail({
      from: 'Maritime Security <butkris06@gmail.com>',
      to: email,
      subject: 'Код подтверждения регистрации',
      html: `
        <p>Здравствуйте, <b>${username}</b>!</p>
        <p>Ваш код подтверждения: <b style="font-size:18px">${code}</b></p>
        <p>Код действует 10 минут.</p>
      `,
    });

    res.json({ message: 'Код подтверждения отправлен на email' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
});

app.post('/auth/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    const pending = pendingVerifications[email];

    if (!pending) {
      return res.status(400).json({ error: 'Код не найден или истёк' });
    }

    if (Date.now() > pending.expires) {
      delete pendingVerifications[email];
      return res.status(400).json({ error: 'Срок действия кода истёк' });
    }

    if (pending.code !== code) {
      return res.status(400).json({ error: 'Неверный код' });
    }

    const db = readDB();
    const users = db.users || [];
    const hashedPassword = bcrypt.hashSync(pending.password, 10);

    const newUser = {
      id: String(users.length ? Math.max(...users.map(u => Number(u.id) || 0)) + 1 : 1),
      username: pending.username,
      email,
      password: hashedPassword,
      role: 'viewer',
    };

    db.users = [...users, newUser];
    writeDB(db);

    delete pendingVerifications[email];
    res.json({
      message: 'Регистрация успешна',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка подтверждения' });
  }
});

app.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readDB();
    const users = db.users || [];
    const user = users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    res.json({
      message: 'Вход выполнен',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

app.get('/vessels', (req, res) => {
  const db = readDB();
  res.json(db.vessels || []);
});

app.get('/vessels/:id', (req, res) => {
  const db = readDB();
  const vessel = (db.vessels || []).find(v => String(v.id) === String(req.params.id));
  if (!vessel) return res.status(404).json({ error: 'Судно не найдено' });
  res.json(vessel);
});

app.post('/vessels', (req, res) => {
  const db = readDB();
  const vessels = db.vessels || [];
  const newVessel = {
    ...req.body,
    id: String(vessels.length ? Math.max(...vessels.map(v => Number(v.id) || 0)) + 1 : 1)
  };
  db.vessels = [...vessels, newVessel];
  writeDB(db);
  res.status(201).json(newVessel);
});

app.put('/vessels/:id', (req, res) => {
  const db = readDB();
  db.vessels = (db.vessels || []).map(v =>
    String(v.id) === String(req.params.id) ? { ...req.body, id: v.id } : v
  );
  writeDB(db);
  res.json({ message: 'Судно обновлено' });
});

app.delete('/vessels/:id', (req, res) => {
  const db = readDB();
  db.vessels = (db.vessels || []).filter(v => String(v.id) !== String(req.params.id));
  writeDB(db);
  res.json({ message: 'Судно удалено' });
});

app.get('/users', (req, res) => {
  const db = readDB();
  res.json((db.users || []).map(({ password, ...u }) => u));
});

app.patch('/users/:id', (req, res) => {
  const { role } = req.body;
  const db = readDB();
  db.users = (db.users || []).map(u =>
    String(u.id) === String(req.params.id) ? { ...u, role } : u
  );
  writeDB(db);
  res.json({ message: 'Роль обновлена' });
});

app.delete('/users/:id', (req, res) => {
  const db = readDB();
  db.users = (db.users || []).filter(u => String(u.id) !== String(req.params.id));
  writeDB(db);
  res.json({ message: 'Пользователь удалён' });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
