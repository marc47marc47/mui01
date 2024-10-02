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

