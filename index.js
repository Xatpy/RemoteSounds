var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Load static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  	res.sendfile('index.html');
  	console.log("ja");
});

// Sounds by default
var obj = {};
var id1 = {"id":1, "name":"hola", "sound": "media/glass.mp3", "img": "media/vaso.jpg"};
var id2 = {"id":2, "name":"adios", "sound": "media/laugh.mp3", "img": "media/risa.jpg"};
obj.listSounds = [];
obj.listSounds.push(id1);
obj.listSounds.push(id2);

io.on('connection', function(socket){
    console.log('New user connected');

    io.emit('newConnection', obj);

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});

	socket.on('registerSound', function(msg){
		debugger
		console.log("New sound registered: " + msg);
		var newSoundObj = { 
			"id":obj.listSounds.length + 1, 
			"name": msg, 
			"sound": msg, 
			"img": "img"
		};
		obj.listSounds.push(newSoundObj);
		io.emit('newSound', newSoundObj);
	});
});

http.listen(3000, function(){
 	console.log('listening on *:3000');
});