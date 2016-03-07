var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Load static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  	res.sendfile('index.html');
});

// Sounds by default
var obj = {};
var id1 = {"id":0, "name":"vaso", "sound": "media/glass.mp3", "img": "media/vaso.jpg"};
var id2 = {"id":1, "name":"risa", "sound": "media/laugh.mp3", "img": "media/risa.jpg" };
obj.listSounds = [];
obj.listSounds.push(id1);
obj.listSounds.push(id2);

var connectedUsers = 0;


io.on('connection', function(socket){
    console.log('New user connected');
    connectedUsers++;
    io.emit('newConnection', obj, connectedUsers);

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});

	socket.on('registerSound', function(soundURL, imageURL, name){
		debugger
		console.log("New sound registered: " + soundURL);
		console.log("New image registered: " + imageURL);
		var newSoundObj = { 
			"id":obj.listSounds.length + 1, 
			"name": name, 
			"sound": soundURL, 
			"img": imageURL
		};
		obj.listSounds.push(newSoundObj);
		io.emit('newSound', newSoundObj);
	});

	socket.on('disconnect', function(numUsers) { 
		console.log('User disconnected');
		connectedUsers--;
		io.emit('disconnect', connectedUsers);
	});
});

http.listen(3000, function(){
 	console.log('listening on *:3000');
});