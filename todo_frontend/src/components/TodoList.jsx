import React, { useEffect, useState } from 'react';
import api from '../api';
import './TodoList.css'; // 👈 Import CSS file

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchTodos = async () => {
    try {
      const res = await api.get('/todos');
      setTodos(res.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editingId) {
        const res = await api.put(`/todos/${editingId}`, { title });
        setTodos(todos.map(todo => (todo.id === editingId ? res.data : todo)));
        setEditingId(null);
      } else {
        const res = await api.post('/todos', { title });
        setTodos([res.data, ...todos]);
      }
      setTitle('');
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const editTodo = (todo) => {
    setTitle(todo.title);
    setEditingId(todo.id);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todo-container">
      <h2>📝 To-Do List</h2>

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          placeholder="Enter a task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div className="todo-text">
              {todo.title}
              <br />
              <small style={{ color: 'gray' }}>
                {new Date(todo.created_at).toLocaleString()}
              </small>
            </div>
            <div className="todo-actions">
              <button onClick={() => editTodo(todo)}>✏️</button>
              <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
