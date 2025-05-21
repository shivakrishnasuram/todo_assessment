const supabase = require('../models/supabaseClient');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const summarizeTodos = async (req, res) => {
    try {
        const { data: todos, error } = await supabase
            .from('todos')
            .select('*')
            .eq('is_completed', false); // adjust if no is_completed field

        if (error) {
            console.error('Error fetching todos:', error.message);
            return res.status(500).json({ error: 'Failed to fetch todos' });
        }

        if (!todos || todos.length === 0) {
            return res.status(400).json({ error: 'No pending todos found' });
        }

        const todoText = todos.map((todo, i) => `${i + 1}. ${todo.title}`).join('\n');
        const prompt = `Summarize the following to-dos:\n${todoText}`;

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        res.status(200).json({ summary });
    } catch (err) {
        console.error('Gemini error:', err.message);
        res.status(500).json({ error: 'Summary generation failed' });
    }
};

module.exports = { summarizeTodos };
