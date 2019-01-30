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

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });

    socket.emit('newMessage', {
        from: 'eno@server.com',
        text: 'Sending you a message from the future',
        createdAt: new Date()
    });

    socket.on('createMessage', message => {
        console.log('receiving new message', message)
    })
});


console.log(publicPath);

server.listen(port, () => {
    console.log(`App started on port ${port}`)
});