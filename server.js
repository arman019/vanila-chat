const path = require('path');
const http = require('http')
const express = require('express');
const app = express();
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server)

app.use(express.static(path.join(__dirname,"public")));

io.on('connection', (socket)=>{
    console.log("new webSocket connect")
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=>{
console.log(`connected to port ${PORT}`)
})