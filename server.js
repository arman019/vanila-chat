const path = require('path');
const http = require('http')
const express = require('express');
const app = express();
const socketio = require('socket.io');

const { formatMessage } = require('./utils/messages');
const { userJoin, getCurrentUser,getRoomUsers,userLeave } = require('./utils/users');

const server = http.createServer(app);
const io = socketio(server)

app.use(express.static(path.join(__dirname, "public")));

const botName = 'bot';

io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id , username , room);
       // console.log('user ',user);
        socket.join(user.room)

        socket.emit("message", formatMessage(botName, "welcome to chat"));

        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        io.to(user.room).emit("roomUsers", 
        ({room:user.room,
        users:getRoomUsers(user.room)       }))

    })

    socket.on('chatMessage', (msg) => {
        const user= getCurrentUser(socket.id);
        // console.log(msg)
        io.to(user.room).emit('message', formatMessage(user.username, msg))

    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        console.log("user leave ", user);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, ` ${user.username} has left the chat`));

            io.to(user.room).emit("roomUsers", 
            ({room:user.room,
            users:getRoomUsers(user.room)       }))
    

        }

      
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`connected to port ${PORT}`)
})