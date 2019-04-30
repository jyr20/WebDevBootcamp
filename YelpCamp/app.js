var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);



// ROUTES


app.get('/', function(req,res){
	res.render('landing');
});

// INDEX - show all campgrounds
app.get('/campgrounds', function(req,res){
	// Get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		err ? console.log(err) : res.render('index',{campgrounds: allCampgrounds});
	})
});

// CREATE - create new campgrounds
app.post('/campgrounds', function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name: name, image: image, description: description};
	// Create new campground and save to database
	Campground.create(newCampground, (err, newlyCreated) => {
		err ? console.log(err) : res.redirect('/campgrounds');
	})
});

// NEW - show form
app.get('/campgrounds/new', function(req,res){
	res.render('new.ejs');
});

// SHOW - show a specific campground
app.get('/campgrounds/:id', (req,res) => {
	// find campground with provided ID
	Campground.findById(req.params.id, (err, foundCampground) => {
		err ? console.log(err) : res.render('show', {campground: foundCampground})
	});
});




// listening port
app.listen(3000, function(){
	console.log('YelpCamp server running!');
});
