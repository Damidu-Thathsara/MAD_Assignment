import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import cors from 'cors';

// App Configurations
const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database Setup
const db = new sqlite3.Database(':memory:'); // In-memory database for simplicity

db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
});

// Routes
// Signup Route
app.post('/signup', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
     res.status(400).json({ error: 'Username and password are required.' });
     return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');

    stmt.run(username, hashedPassword, (err: { code: string; }) => {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ error: 'Username already exists.' });
        }
        return res.status(500).json({ error: 'Internal server error.' });
      }
      res.status(201).json({ message: 'User registered successfully.' });
    });

    stmt.finalize();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Login Route
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
     res.status(400).json({ error: 'Username and password are required.' });
     return;
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user: { id: number; username: string; password: string }) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful.', token });
  });
});

// Protected Route (Example)
app.get('/protected', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
     res.status(401).json({ error: 'Token required.' });
     return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ message: 'Access granted.', user: decoded });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
