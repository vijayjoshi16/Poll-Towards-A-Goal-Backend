const express = require('express');
const app = express();
const mongoose = require('mongoose');
const env = require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const userRouter = require('./router/UserRouter');
const organizationRouter = require('./router/OrganizationRouter');
const orgaizationRouter = require('./router/OrganizationRouter');
const pollRouter = require('./router/PollRouter');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true});

mongoose.connection.on('connected',()=>{
    console.log("MongoDB connection established successfully!")
})

mongoose.connection.on('error',(err)=>{
    console.log("Error occured while establishing connection to mongoDB:",err)
})

app.use("/user", userRouter);
app.use("/organization",orgaizationRouter);
app.use("/poll",pollRouter);

app.listen(PORT,()=>{
    console.log("Server started successfully...Listening on port:",PORT);
})