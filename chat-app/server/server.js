const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

const users = new Users();

io.on('connection', socket => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required')
        }

        socket.join(params.room);
        // users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', `Welcome to Room ${params.room} on the Chat App`));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined the room!`));

        callback();
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        const user = users.removeUser(socket.id);

        if (user) {
            const userRoom = user.room;

            io.to(userRoom).emit('updateUserList', users.getUserList(userRoom));
            io.to(userRoom).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`))
        }
    });

    socket.on('createMessage', (message, callback) => {
        const user = users.getUser(socket.id);

        if (isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    socket.on('createLocationMessage', coords => {
        const user = users.getUser(socket.id);

        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
    })
});

server.listen(port, () => {
    console.log(`App started on port ${port}`)
});