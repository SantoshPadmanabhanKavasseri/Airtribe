const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

let tasks = [];
let taskId = 1;


// GET /tasks - Retrieve all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id - Retrieve a single task by its ID
app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const task = tasks.find(task => task.id === parseInt(id));

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json(task);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, completed, priority } = req.body;

  if (!title || !description || !completed || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'Invalid task data' });
  }

  const newTask = {
    id: taskId++,
    title,
    description,
    completed,
    priority: priority || 'low'
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// PUT /tasks/:id - Update an existing task by its ID
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, completed, priority } = req.body;

  if (!title || !description || !completed || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'Invalid task data' });
  }

  const task = tasks.find(task => task.id === parseInt(id));

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.title = title;
  task.description = description;
  task.completed = completed;
  task.priority = priority || 'low';

  res.json(task);
});

// DELETE /tasks/:id - Delete a task by its ID
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const index = tasks.findIndex(task => task.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(index, 1);

  res.sendStatus(204);
});

// GET /tasks/priority/:level - Retrieve tasks based on priority level
app.get('/tasks/priority/:level', (req, res) => {
  const level = req.params.level;
  const filteredTasks = tasks.filter(task => task.priority === level);

  res.json(filteredTasks);
});


const port = 3000; // You can use any port number you prefer

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

