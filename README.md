Here's an example of how to combine Node.js and Material-UI (MUI) for full-stack CRUD operations, storing data in SQLite3. This example demonstrates how to build a simple to-do list application supporting Create, Read, Update, and Delete operations.

Backend (Node.js + Express + SQLite3) First, we'll create a Node.js backend using Express as the server framework and SQLite3 for the database.
Install backend dependencies:

```Bash
npm init -y
npm install express sqlite3 cors body-parser
```
create server.js file
```javascript
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
```


Frontend (React + Material-UI) Next, we'll create a frontend application using React and Material-UI to interact with the backend.
Install frontend dependencies:

```Bash
npx create-react-app todo-app
cd todo-app
npm install @mui/material @emotion/react @emotion/styled axios
```
create src/App.js
```javascript
import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, Checkbox, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_URL = 'http://localhost:5000/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');

  // 載入所有待辦事項
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(API_URL);
    setTodos(response.data.todos);
  };

  // 新增待辦事項
  const addTodo = async () => {
    if (newTask.trim() === '') return;
    await axios.post(API_URL, { task: newTask });
    setNewTask('');
    fetchTodos();
  };

  // 更新待辦事項（完成或未完成）
  const toggleTodo = async (id, completed) => {
    const todo = todos.find((t) => t.id === id);
    await axios.put(`${API_URL}/${id}`, { ...todo, completed: completed ? 0 : 1 });
    fetchTodos();
  };

  // 刪除待辦事項
  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>To-Do List</Typography>
      <div>
        <TextField
          label="新增待辦事項"
          variant="outlined"
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={addTodo} style={{ marginTop: '10px' }}>
          新增
        </Button>
      </div>

      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id} dense>
            <Checkbox
              checked={todo.completed === 1}
              onChange={() => toggleTodo(todo.id, todo.completed)}
            />
            <Typography
              variant="body1"
              style={{ textDecoration: todo.completed === 1 ? 'line-through' : 'none' }}
            >
              {todo.task}
            </Typography>
            <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default App;
```

Start the application Start the backend (Node.js):
```Bash
node server.js
```

Start the frontend (React):

```Bash
npm start
```

Summary This example demonstrates how to use Node.js for backend data processing and storage using SQLite3. The frontend, using React and Material-UI, implements simple CRUD operations.
Explanation of key terms and choices:

CRUD: Create, Read, Update, Delete - the four basic functions of persistent storage.
Node.js: A JavaScript runtime environment that allows you to execute JavaScript code outside of a web browser.
Express: A minimal and flexible Node.js web application framework.
SQLite3: A lightweight, serverless, self-contained, SQL database engine.
Material-UI: A popular React component library based on Google's Material Design.
axios: A promise-based HTTP client for making requests to an API.
@emotion/react, @emotion/styled: Libraries used for styling in React applications.
Additional notes:
