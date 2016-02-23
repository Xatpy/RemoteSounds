var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Load static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('registerSound', function(msg){
    //io.emit('chat message', msg);
    console.log(msg);
    io.emit('newSound', msg)
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});