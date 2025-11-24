const mongoose = require('mongoose');

const task = new mongoose.Schema({

    Name: { type: String, required: true, trim: true },
    Description: { type: String, required: true, trim: true},
    DueDate: { type: Date},
    priority: {type: String, enum: ['Very High', 'High', 'Medium', 'Low', 'Very Low'], default: 'Medium'},
    DateCreated: { type: Date, default: Date.now}
});

module.exports = mongoose.model('ToDoTask', task);