const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat App'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined Chat App!'));
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });

    socket.on('createMessage', message => {
        console.log('receiving new message', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
    })
});

server.listen(port, () => {
    console.log(`App started on port ${port}`)
});