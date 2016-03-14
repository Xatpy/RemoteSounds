var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// Load static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  	res.sendfile('index.html');
});

// Sounds by default
var obj = {};
var id0 = {"id":0, "name":"Crystal crash", "sound": "media/glass.mp3", "img": "media/vaso.jpg"};
var id1 = {"id":1, "name":"LOL", "sound": "media/laugh.mp3", "img": "media/risa.jpg" };
var id2 = {"id":2, "name":"Applause", "sound": "media/applause.mp3", "img": "media/applause.png" };
var id3 = {"id":3, "name":"Gum Bubble", "sound": "media/gumBubble.mp3", "img": "media/boomer.jpg" };


obj.listSounds = [];
obj.listSounds.push(id0);
obj.listSounds.push(id1);
obj.listSounds.push(id2);
obj.listSounds.push(id3);

var connectedUsers = 0;


io.on('connection', function(socket){
    console.log(getDateTime() + ' - New user connected');
    connectedUsers++;
    io.emit('newConnection', obj, connectedUsers);

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});

	socket.on('registerSound', function(soundURL, imageURL, name){
		console.log(getDateTime() + " - New sound registered: " + soundURL);
		console.log(getDateTime() + " - New image registered: " + imageURL);
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
		console.log(getDateTime() + ' - User disconnected');
		connectedUsers--;
		io.emit('disconnect', connectedUsers);
	});
});

http.listen(port, function(){
 	console.log('listening on *:' + port);
});


function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}