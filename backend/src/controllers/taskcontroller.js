const Task = require('../models/Task.js');

const getTasks = async (req, res) => {
    try {
        const filter = {};
        if (req.query.completed !== undefined) {
            filter.completed = req.query.completed === 'true';
        }
        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = new Task({ title, description });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        const task = await Task.findByIdAndUpdate(id, { title, description, completed }, { new: true });
        if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};
