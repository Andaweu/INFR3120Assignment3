const Task = require('../models/task');
const {validationResult} = require('express-validator');

const itemPriority = { "Very High" : 5, "High" : 4, "Medium" : 3, "Low" : 2, "Very Low" : 1}; //values for item priority

exports.listTasks = async (req, res, next) => { //sorts tasks by priority, then by the date they are due
    try {
        const tasks = await Task.find().lean();
        tasks.sort((top,bottom) => {
            const p = itemPriority[bottom.priority] - itemPriority[top.priority];
            if (p !== 0)
                return p;
            if (!top.dueDate && !bottom.dueDate)
                return 0;
            if (!top.dueDate)
                return 1;
            if (!bottom.dueDate)
                return -1;
            return new Date(top.dueDate) - new Date(bottom.dueDate); 
        });
        res.render('tasks/list', { tasks });
    } catch (err) {
        next(err);
    }
};

exports.showNewForm = (req, res) => { //brings up the new task page
    res.render('tasks/new', {
        data: {},
        errors: null,
    });

};

exports.createTask = async (req, res, next) => { 
    const errors = validationResult(req);
    const data = req.body;
    if (!errors.isEmpty()) {
      return res.status(422).render('tasks/new', {  errors: errors.array(), data });
    }
    try {
      await Task.create({
        name: data.name,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: data.priority || 'Medium'
      });
      res.redirect('/tasks');
    } catch (err) {
      next(err);
    }
  };

exports.showTask = async (req, res, next) => { //redirects to the show task page
  try {
    const task = await Task.findById(req.params.id).lean();
    if (!task) return res.status(404).render('error', { message: 'Task not found' });
    res.render('tasks/show', { task});
  } catch (err) {
    next(err);
  }
};

exports.showEditForm = async (req, res, next) => { //brings up the edit task page
  try {
    const task = await Task.findById(req.params.id).lean();
    if (!task) return res.status(404).render('error', { message: 'Task not found' });
    res.render('tasks/edit', { data: task, errors: null });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => { //allows the user to edit and update an existing task, as long as it follows appropriate input conditions
  const errors = validationResult(req);
  const data = req.body;
  if (!errors.isEmpty()) {
    data._id = req.params.id;
    return res.status(422).render('tasks/edit', { data, errors: errors.array()});
  }
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      name : data.name,  
      description: data.description,
      dueDate: data.dueDate || null,
      priority: data.priority || 'Medium'
    }, { runValidators: true });
    res.redirect('/tasks/' + req.params.id);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => { //deletes the selected task
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
  } catch (err) {
    next(err);
  }
};
  