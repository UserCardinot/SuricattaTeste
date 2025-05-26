import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Paper,
  Tab,
  Tabs,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      setError('Erro ao buscar tarefas. Por favor, tente novamente.');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/tasks`, newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${editingTask._id}`,
        editingTask
      );
      setTasks(tasks.map(task =>
        task._id === editingTask._id ? response.data : task
      ));
      setEditingTask(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleTaskComplete = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        { ...task, completed: !task.completed }
      );
      setTasks(tasks.map(t =>
        t._id === taskId ? response.data : t
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (tabValue === 0) return true; // All tasks
    if (tabValue === 1) return !task.completed; // Active tasks
    if (tabValue === 2) return task.completed; // Completed tasks
    return true;
  });

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 4 }}>
        Todo List
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Task
        </Typography>
        <TextField
          fullWidth
          label="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description (optional)"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={createTask}
          disabled={!newTask.title.trim()}
        >
          Add Task
        </Button>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All (${tasks.length})`} />
          <Tab label={`Active (${tasks.filter(t => !t.completed).length})`} />
          <Tab label={`Completed (${tasks.filter(t => t.completed).length})`} />
        </Tabs>
      </Paper>

      {loading && (
        <Box display="flex" justifyContent="center" sx={{ my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error} <Button color="inherit" size="small" onClick={fetchTasks}>Tentar novamente</Button>
        </Alert>
      )}

      {!loading && !error && filteredTasks.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Nenhuma tarefa encontrada.
          </Typography>
        </Paper>
      )}

      {!loading && !error && filteredTasks.length > 0 && (
        <>
          <TabPanel value={tabValue} index={0}>
            <TaskList tasks={filteredTasks} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TaskList tasks={filteredTasks} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <TaskList tasks={filteredTasks} />
          </TabPanel>
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Task Title"
            value={editingTask?.title || ''}
            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={editingTask?.description || ''}
            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={updateTask} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );

  function TaskList({ tasks }) {
    return (
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            sx={{
              backgroundColor: task.completed ? '#f5f5f5' : 'white',
              mb: 1,
              borderRadius: 1,
              border: '1px solid #e0e0e0'
            }}
          >
            <Checkbox
              checked={task.completed}
              onChange={() => toggleTaskComplete(task._id)}
            />
            <ListItemText
              primary={task.title}
              secondary={task.description}
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => {
                  setEditingTask(task);
                  setOpenDialog(true);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => deleteTask(task._id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }
}

export default App;
