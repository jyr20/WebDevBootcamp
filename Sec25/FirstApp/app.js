var express = require('express');
var app = express();

// Make a basic home page that says 'hi!'
app.get('/', function(req,res){
	res.send('hi there!');
});

app.get('/bye', function(req,res){
	res.send('bye mate :/');
});

// Tell Express to listen for requests (start server)
app.listen(3000, function(){
	console.log('Server has started on port 3000! ');
});
