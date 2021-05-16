// node server which will handle socket io connections
const express = require("express")
var app = express();
const http = require('http')
var server = http.createServer(app);
const port = process.env.PORT || 8000
server.listen(port,()=>
{
    console.log("Listening at port => "+port)
});
var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

const cors = require("cors")
app.use(cors())

const path = require("path")
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

const users = {}

io.on('connection',socket=>
{
    socket.on('new-user-joined',temp_name=>
    {
        // console.log(temp_name)  
        users[socket.id] = temp_name;
        socket.broadcast.emit('user-joined',temp_name)
    });

    socket.on('send',message =>
    {
        socket.broadcast.emit('receive',{
            message:message,
            name:users[socket.id]
        })
    });

    socket.on('disconnect',message =>
    {
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });

});

   