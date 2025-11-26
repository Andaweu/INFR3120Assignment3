const mongoose = require('mongoose');

// data structure for the tasks recorded
const task = new mongoose.Schema({

    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true},
    dueDate: { type: Date},
    priority: {type: String, enum: ['Very High', 'High', 'Medium', 'Low', 'Very Low'], default: 'Medium'},
    dateCreated: { type: Date, default: Date.now}
});

module.exports = mongoose.model('ToDoTask', task);