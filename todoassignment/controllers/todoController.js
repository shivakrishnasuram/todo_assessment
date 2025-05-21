const supabase = require('../models/supabaseClient');

// GET all todos
const getTodos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST a new todo
const addTodo = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title }])
      .select();

    if (error) {
      console.error('Error inserting todo:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE a todo by ID
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT (update) a todo by ID
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data, error } = await supabase
      .from('todos')
      .update({ title })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating todo:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
};
