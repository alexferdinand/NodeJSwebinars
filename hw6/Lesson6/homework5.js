const express = require('express');
const path = require('path');
const consolidate = require('consolidate');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:32770/insta', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Task = require('./models/task');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/styles', express.static(path.resolve(__dirname, 'assets/css')));

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.render('tasks', {tasks: tasks});
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.redirect('/tasks');
});

app.post('/tasks/complete', async (req, res) => {
  await Task.updateOne({_id: req.body.id}, {$set: { completed: true }});
  res.redirect('/tasks');
});

app.post('/tasks/delete', async (req, res) => {
  await Task.deleteOne({_id: req.body.id});
  res.redirect('/tasks');
});

app.listen(8888, () => {
  console.log('Server has been started!');
});
