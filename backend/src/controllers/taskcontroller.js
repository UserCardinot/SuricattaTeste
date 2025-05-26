import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = new Task({ title, description });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
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

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });
        res.json({ message: 'Tarefa deletada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};