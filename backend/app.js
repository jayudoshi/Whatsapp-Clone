const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const logger = require('morgan');
const socketIO = require('socket.io');
const passport = require('passport');

const userRouter = require('./routes/user');
const roomRouter = require('./routes/room');
const chatRouter = require('./routes/chat');

const morgan = require('morgan');


const PORT = 9000;
const HOSTNAME = "localhost"
const DB_URL = "'mongodb://localhost:27017/chatApp"

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
    cors: {
        origin: "http:localhost:3000"
    }
})
mongoose.connect(DB_URL , { useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true} , (err) => {
    if(err){
        console.log(err);
    }else{
        console.log("Connected To Database !!");
    }
})

const { verifyUser } = require('./authenticate');

app.use(logger('dev'));
app.use(bodyParser.json());

app.use(passport.initialize())

app.use((req,res,next) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0");
    next();
} , express.static('public'));

app.use('/users' , userRouter);
app.use('/rooms' , roomRouter);
app.use('/chats' , chatRouter);


io.on("connection" , (socket) => {
    console.log("A new user connected !!");

    socket.on("disconnect", () => {
        console.log("A user was disconnected !!");
    })
})

httpServer.listen(PORT,HOSTNAME, () => {
    console.log('Server running at port 9000');
})