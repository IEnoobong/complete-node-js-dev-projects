const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected');

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to Chat App!',
        createdAt: new Date()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New User joined Chat App!',
        createdAt: new Date()
    });
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });

    socket.on('createMessage', message => {
        console.log('receiving new message', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date()
        });
    })
});

server.listen(port, () => {
    console.log(`App started on port ${port}`)
});