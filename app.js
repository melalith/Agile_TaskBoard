const express = require('express');
const mongoose = require('mongoose');

const { jwtAuthenticateToken } = require('./authentication/jwtAuthentication');
const { User, Comment, Task } = require("./schema/models");

const app = express();

mongoose.connection.on('disconnected', () => console.debug('Sucessfully disconnected from DB'));

//LocalHost Path: mongodb://localhost:27017/local_beep
mongoose.connect('mongodb://localhost:27017/local_beep')
    .then((result) => {
        console.log(`Sucessfully connected to DB`);
    }).catch((err) => {
        console.error(err);
    });

// Returns complete Userdata list/Specific Userdata
app.get('/users', jwtAuthenticateToken, async (req, res) => {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;

    const skip = (page - 1) * limit;

    const usersData = req.query.userName
        ? await User.find({ userName: { $eq: req.query.userName } })
        : await User.find().skip(skip).limit(limit);

    usersData ? res.json(usersData) : res.status(400).send("Expected Userdata unavailable!")
});

// Returns complete Userdata list/Specific Userdata
app.post('/users/create', jwtAuthenticateToken, async (req, res) => {
    if (!req.query.userName || !req.query.emailID) {
        res.status(400).send("Expecting userName & emailID - Parameters for record Creation");
        return;
    }

    const records = await User.find({ $or: [{ userName: { $eq: req.query.userName } }, { emailID: { $eq: req.query.emailID } }] });
    if (records.length !== 0) {
        res.status(400).send("Username or EmailID already exists in the Record");
    } else {
        User.create({ userName: req.query.userName, emailID: req.query.emailID })
            .then(() => res.send("User creation sucessful!"))
            .catch((err) => {
                res.status(400).send(`User creation failed! ${err}`);
            });
    }
});

// Returns Tasks list/Specific User created Tasks
app.get('/tasks', jwtAuthenticateToken, async (req, res) => {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 20;

    const skip = (page - 1) * limit;

    const taskList = await Task.find().skip(skip).limit(limit);

    taskList ? res.json(taskList) : res.status(400).send("No Tasks Found!");
});

// Returns Tasks list/Specific User created Tasks
app.get('/tasks/users', jwtAuthenticateToken, async (req, res) => {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 20;

    const skip = (page - 1) * limit;

    if (req.query.userName) {
        return res.status(400).send("Requires 'userName' Parameter")
    }

    const taskData = await Task.Find({ createdBy: {userName: { $eq: req.query.userName} }}).skip(skip).limit(limit);

    // TODO: Other queries can be added to retrieve by User, Date, Priority
    res.json(taskData);
});

// Returns complete Userdata list/Specific Userdata
app.post('/tasks/create', jwtAuthenticateToken, async (req, res) => {
    if (!req.query.title || !req.query.description || !req.query.userName || !req.query.emailID) {
        res.status(400).send("Expecting userName, emailID, dueDate, description, title - Parameters for record Creation");
        return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // Setting Due 7 days from current date

    const records = await Task.find({ $or: [{ title: { $eq: req.query.title } }, { description: { $eq: req.query.description } }] });
    if (records.length !== 0) {
        res.status(400).send("Title or Description already exists in the Record");
    } else {
        // TODO: Map User with '_id' to task creation
        Task.create({ title: req.query.title, description: req.query.description,
                dueDate: dueDate, createdBy: { userName: req.query.userName, emailID: req.query.emailID}})
            .then(() => res.send("Task creation sucessful!"))
            .catch((err) => {
                res.status(400).send(`Task creation failed! ${err}`);
        });
    }
});

app.put('/tasks', jwtAuthenticateToken, async (req, res) => {
    if (!req.query.title || !req.query.priority) {
        res.status(400).send("Expecting title & priority - Parameters for task record updation");
        return;
    }

    try{
        await Task.updateOne({title: { $eq: req.query.title}}, { $set: {priority: req.query.priority} });
        res.status(400).send(`Sucessfully updated Task Priority to ${req.query.priority}`);
    } catch(error) {
        res.status(400).send("Unable to update task priority");
    }
});

app.delete('/tasks', jwtAuthenticateToken, async (req, res) => {
    if (!req.query.title) {
        res.status(400).send("Expecting title parameter for task record deletion");
        return;
    }
    try{
        await Task.deleteOne({title: { $eq: req.query.title}});
        res.status(400).send(`Sucessfully deleted Task titled - ${req.query.title}`);
    } catch(error) {
        res.status(400).send("Unable to delete task");
    }
});

app.listen(8001, () => {
    console.log("Server is Up! - Send in your REST APIs");
})
