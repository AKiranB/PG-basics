const express = require('express');
const res = require('express/lib/response');
const pool = require('./db');
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('server is lsitening on port 3000')
});

app.get('/todos', async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * from todo");
        res.json(allTodos.rows);
    }
    catch (err) {
        console.error(err.message)
    };
});

app.get('/todos/:id', async (req, res) => {
    const { id } = req.params
    try {
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id])
        res.json(todo.rows[0])
    }
    catch (err) {
        console.log(err.message);
    };
});

app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", [description])
        res.json(newTodo.rows[0])
    }
    catch (err) {
        console.error(err.message);
    };
});


app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
        res.json({ message: 'Todo was Updated' })
    }
    catch (err) {
        console.log(err.message);
    };
});

