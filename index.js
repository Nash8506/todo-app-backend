const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Task = require('./models/Task'); 

const app = express();

app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://kpnashidnashid:70MmMQu4xhjnNX6W@todo-app-cluster.i5e0y.mongodb.net/?retryWrites=true&w=majority&appName=todo-app-cluster";

// Your MongoDB connection string
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
const tasksRouter = require('./routes/tasks');
app.use('/tasks', tasksRouter);

app.get('/', (req, res) => res.send('Server is running'));

app.put('/tasks/:id', async (req, res) => {
  try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!task) {
          return res.status(404).send({ message: 'Task not found' });
      }
      res.send(task);
  } catch (error) {
      console.error(error);  // Log the error to the console for debugging
      res.status(400).send({ error: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));








// kpnashidnashid
// 70MmMQu4xhjnNX6W