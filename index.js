const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var userpool = new Array();
//console.log(userpool.length);

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(__dirname + '/views/chatroom.html'));
http.listen(3000, () => console.log('Listening on port 3000!'));

function getUid() {
    var val;
    while (true) {
        //console.log(userpool.length);
        val = Math.ceil(Math.random() * 1000);
        if (userpool.indexOf(val) == -1) {
            userpool.push(val);
            return val;
        }
    }
}

io.on('connection', (socket) => {
    var uid;
    var name;
    var ip;

    if(socket.handshake.headers['x-forwarded-for'] != null){
        ip = socket.handshake.headers['x-forwarded-for'];
    } else {
        ip = socket.handshake.address;
    }

    // get user name
    socket.on('username', (uname) => {
        uid = getUid();
        name = uname;
        io.emit('onlinenum', userpool.length);
        console.log(ip + ' ' + name + '#' + uid + ' connected.');
    });
    // get a message
    socket.on('chat mesg', (msg) => {
        if (io.sockets.connected[socket.id]) {
            io.sockets.connected[socket.id].emit('mymsg', msg);
        }
        socket.broadcast.emit('othermsg', name + '#' + uid, msg);
    });

    socket.on('disconnect', () => {
        if (uid != null || uid != undefined) {
            console.log(name + '#' + uid + ' disconnected.');
            userpool.splice(userpool.indexOf(uid, 1));
            io.emit('onlinenum', userpool.length);
        }
    });
});