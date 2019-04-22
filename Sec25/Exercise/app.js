var express = require('express');
var app = express();


app.get('/', function(req,res){
	res.send('Hi there, this is the exercise home page!');
});

app.get('/speak/:animal', function(req,res){
	var sounds = {
		pig: 'oink',
		dog: 'woof',
		cat: 'meow',
		cow: 'moo'
	}
	var animal = req.params.animal.toLowerCase();
	var sound = sounds[animal];
	res.send('The '+animal+' says "'+ sound+'"');
});

app.get('/repeat/:message/:times', function(req,res){
	var message = req.params.message;
	var times = Number(req.params.times);
	var line = '';
	for (var i=0; i<times; i++){
		line += message + ' ';
	}
	res.send(line);
});

app.get('*', function(req,res){
	res.send('Page not found sozzle buddy');
})

// Tell Express to listen for requests (start server)
app.listen(3000, function(){
	console.log('Server has started on port 3000! ');
});

