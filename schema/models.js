const mongoose = require('mongoose');

// Schema: User Model
const userModel = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  emailID: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // TODO: Additional attributes to be added
});

// Schema: Comment Model
const commentModel = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: userModel,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

// Schema: Task Model
const taskModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['To-Do', 'In Progress', 'Completed'],
    default: 'To-Do'
  },
  createdBy: {
    type: userModel,
    required: true
  },
  assignedTo: {
    type: userModel
  },
  comment: {
    type: [commentModel]
  }
});


const User = mongoose.model('User', userModel);
const Comment = mongoose.model('Comment', commentModel);
const Task = mongoose.model('Task', taskModel);

module.exports = {User, Comment, Task};