var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	seedDB = require('./seeds'),
	mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
seedDB();

// ROUTES

app.get('/', function(req,res){
	res.render('landing');
});

// INDEX - show all campgrounds
app.get('/campgrounds', function(req,res){
	// Get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		err ? console.log(err) : res.render('campgrounds/index',{campgrounds: allCampgrounds});
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
	res.render('campgrounds/new');
});

// SHOW - show a specific campground
app.get('/campgrounds/:id', (req,res) => {
	// find campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec( (err, foundCampground) => {
		err ? console.log(err) : res.render('campgrounds/show', {campground: foundCampground})
	});
});

// ===============================================================
// COMMENT ROUTES
// ===============================================================

app.get('/campgrounds/:id/comments/new', (req,res) => {
	Campground.findById(req.params.id, (err,campground) => {
		err ? console.log(err) : res.render('comments/new', {campground: campground})
	});
});

app.post('/campgrounds/:id/comments', (req,res) => {
	Campground.findById(req.params.id, (err, campground) =>{
		if(err){
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/'+campground._id);
				}
			})
		}
	})
})

// listening port
app.listen(3000, function(){
	console.log('YelpCamp server running!');
});
