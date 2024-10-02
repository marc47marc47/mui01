const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// 使用 CORS 避免跨域問題
app.use(cors());
app.use(bodyParser.json());

// 連接 SQLite3 資料庫
const db = new sqlite3.Database('./todos.db', (err) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the SQLite database.');
    db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, task TEXT, completed INTEGER)');
  }
});

// CRUD 路由

// 1. 取得所有待辦事項
app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ todos: rows });
    }
  });
});

// 2. 新增待辦事項
app.post('/todos', (req, res) => {
  const { task } = req.body;
  db.run('INSERT INTO todos (task, completed) VALUES (?, ?)', [task, 0], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// 3. 更新待辦事項
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  db.run('UPDATE todos SET task = ?, completed = ? WHERE id = ?', [task, completed, id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ updated: this.changes });
    }
  });
});

// 4. 刪除待辦事項
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM todos WHERE id = ?', id, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ deleted: this.changes });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

