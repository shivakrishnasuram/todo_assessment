import React, { useEffect, useState } from 'react';
import api from '../api';
import './TodoList.css'; // 👈 Import CSS

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const generateSummary = async () => {
    try {
      setLoading(true);
      setError('');
      setSummary('');
      const res = await api.post('/summarize');
      setSummary(res.data.summary);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
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
      <div className="summary-section">
        <button className="summary-btn" onClick={generateSummary} disabled={loading}>
          {loading ? 'Summarizing...' : 'Generate Summary'}
        </button>
        {error && <p className="error">{error}</p>}
        {summary && (
          <div className="summary-box">
            <h3>🧠 Summary</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
