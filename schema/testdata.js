// Program to check - DB insertion

const mongoose = require('mongoose');
const {Comment} = require('./models');

async function main() {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/local_beep');
    console.log('Connected to MongoDB');

    // Insert books into the database
    const users = [
        { userName: "John1", emailID: "john1@beep.com" },
        { userName: "Joseph2", emailID: "joseph1@beep.com" },
    ];

    // Insert books into the database
    const comments = [
        { content: "John's Story", createdBy: users[0] },
        { content: "Joseph's Story", createdBy: users[1] },
        ];

    Comment.insertMany(comments)
    .then(async () => {
        console.log('comments inserted successfully');
        await mongoose.connection.close(); // Close the connection after insertion
    })
    .catch(async (err) => {
        console.error('Error inserting comments:', err);
        await mongoose.connection.close(); // Close the connection on error
    });
}

main().catch((err) => console.log(err));