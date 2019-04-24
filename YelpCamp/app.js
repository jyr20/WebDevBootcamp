var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

var campgrounds = [
	{name: 'Helmand Province Hills', image:'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'},
	{name: 'South Sudan Sunset', image:'https://images.pexels.com/photos/1376960/pexels-photo-1376960.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'},
	{name: 'Alaska Mountain', image:'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'}
];


app.get('/', function(req,res){
	res.render('landing');
});

app.get('/campgrounds', function(req,res){
	res.render('campgrounds',{campgrounds: campgrounds});
});

app.post('/campgrounds', function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req,res){
	res.render('new.ejs');
});





// listening port
app.listen(3000, function(){
	console.log('YelpCamp server running!');
});
