var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');

// INDEX - show all campgrounds
router.get('/', function(req,res){
	// Get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		err ? console.log(err) : res.render('campgrounds/index',{campgrounds: allCampgrounds});
	})
});

// CREATE - create new campgrounds
router.post('/', isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: description, author: author};
	// Create new campground and save to database
	Campground.create(newCampground, (err, newlyCreated) => {
		err ? console.log(err) : res.redirect('/campgrounds');
	})
});

// NEW - show form
router.get('/new', isLoggedIn, function(req,res){
	res.render('campgrounds/new');
});

// SHOW - show a specific campground
router.get('/:id', (req,res) => {
	// find campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec( (err, foundCampground) => {
		err ? console.log(err) : res.render('campgrounds/show', {campground: foundCampground})
	});
});


// middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
