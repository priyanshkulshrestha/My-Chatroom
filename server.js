const express = require('express');
const app = express();

const server = require('http').Server(app);

const io = require('socket.io')(server)

app.set('view engine', 'ejs')
app.use(express.static("public"))

app.get('/', (req,res) => {
    res.render('index');
})

const users = {};
io.on("connection", socket =>{
    socket.on('new-user-joined', name=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message:message, name: users[socket.id]})
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})  


server.listen(process.env.PORT || 3000, () => {
    console.log('sever is listening on port 3000')
})