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

    io.emit('roomsList', users.getActiveRooms());

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required')
        }


        if (users.userExistsWithName(params.name, params.room)) {
            return callback(`User with name: ${params.name} already exists in room: ${params.room}`)
        }

        const user = users.addUser(socket.id, params.name, params.room);

        console.log(user.roomRep);
        socket.join(user.roomRep);

        io.to(user.roomRep).emit('updateUserList', users.getUserList(user.roomRep));

        socket.emit('newMessage', generateMessage('Admin', `Welcome to Room ${params.room} on the Chat App`));
        socket.broadcast.to(user.roomRep).emit('newMessage', generateMessage('Admin', `${params.name} joined the room!`));

        callback();
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        const user = users.removeUser(socket.id);

        if (user) {
            const userRoomRep = user.roomRep;

            io.to(userRoomRep).emit('updateUserList', users.getUserList(userRoomRep));
            io.to(userRoomRep).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`))
        }
    });

    socket.on('createMessage', (message, callback) => {
        const user = users.getUser(socket.id);

        if (isRealString(message.text)) {
            io.to(user.roomRep).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    socket.on('createLocationMessage', coords => {
        const user = users.getUser(socket.id);

        io.to(user.roomRep).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
    })
});

server.listen(port, () => {
    console.log(`App started on port ${port}`)
});