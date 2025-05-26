const request = require('supertest');
const app = require('./src/app');
const Task = require('./src/models/Task');

jest.mock('./src/models/Task');

describe('Tasks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        { _id: '1', title: 'Task 1', completed: false },
        { _id: '2', title: 'Task 2', completed: true }
      ];

      Task.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTasks)
      });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
    });

    it('should filter tasks by completed status', async () => {
      const completedTasks = [
        { _id: '2', title: 'Task 2', completed: true }
      ];

      Task.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(completedTasks)
      });

      const response = await request(app).get('/api/tasks?completed=true');

      expect(response.status).toBe(200);
      expect(Task.find).toHaveBeenCalledWith({ completed: true });
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Task',
        description: 'Task description'
      };

      const savedTask = {
        _id: '3',
        ...newTask,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      Task.prototype.save = jest.fn().mockResolvedValue(savedTask);

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newTask.title);
    });

    it('should return 400 for invalid task data', async () => {
      Task.prototype.save = jest.fn().mockRejectedValue(new Error('Validation error'));

      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTask = {
        _id: '1',
        title: 'Updated Task',
        completed: true
      };

      Task.findByIdAndUpdate.mockResolvedValue(updatedTask);

      const response = await request(app)
        .put('/api/tasks/1')
        .send({ title: 'Updated Task', completed: true });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
    });

    it('should return 404 for non-existent task', async () => {
      Task.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/tasks/999')
        .send({ title: 'Updated Task' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      Task.findByIdAndDelete.mockResolvedValue({ _id: '1' });

      const response = await request(app).delete('/api/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
    });

    it('should return 404 for non-existent task', async () => {
      Task.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app).delete('/api/tasks/999');

      expect(response.status).toBe(404);
    });
  });
});