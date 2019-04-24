var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

app.get('/', function(req,res){
	res.render('search');
});

app.get('/results', function(req,res){
	var searchTerm = req.query.search;
	var url = 'http://www.omdbapi.com/?s='+searchTerm+'&apikey=thewdb' ;
	request(url, function(error, response, body){
		if(!error && response.statusCode == 200){
			var data = JSON.parse(body);
			res.render('results', {data: data});
		}
	});
});

// add port
app.listen(3000, function(){
	console.log('Server running on 3000!');
});
