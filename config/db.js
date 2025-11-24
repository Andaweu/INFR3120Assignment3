const mongoose = require('mongoose');

mongoose.connect(process.env.mongoDB_URI);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection error'));
mongoDB.once('open',()=>{
    console.log('Connected to MongoDB')
})