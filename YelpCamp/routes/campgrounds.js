var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// INDEX - show all campgrounds
router.get('/', function(req,res){
	var noMatch;
	if(req.query.search){

		const regex = new RegExp(escapeRegex(req.query.search),'gi');
		// Get all campgrounds from DB
		Campground.find({name:regex}, (err, allCampgrounds) => {
			if(err){
				console.log(err);
			}else{
				if(allCampgrounds.length<1){
					noMatch = 'No campgrounds match your search, please try again.';
				}
				res.render('campgrounds/index',{campgrounds: allCampgrounds, page: 'campgrounds', noMatch: noMatch, search: req.query.search});
			}
		})
	}else{
		// Get all campgrounds from DB
		Campground.find({}, (err, allCampgrounds) => {
			err ? console.log(err) : res.render('campgrounds/index',{campgrounds: allCampgrounds, page: 'campgrounds', noMatch: noMatch, search: undefined});
		})
	}
});

// CREATE - create new campgrounds
router.post('/', middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.sanitize(req.body.description);
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, price: price, description: description, author: author};
	// Create new campground and save to database
	Campground.create(newCampground, (err, newlyCreated) => {
		err ? console.log(err) : res.redirect('/campgrounds');
	})
});

// NEW - show form
router.get('/new', middleware.isLoggedIn, function(req,res){
	res.render('campgrounds/new');
});

// SHOW - show a specific campground
router.get('/:id', (req,res) => {
	// find campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec( (err, foundCampground) => {
		if( err || !foundCampground){
			req.flash('error', 'Campground not found!');
			res.redirect('back');
		}else{
			res.render('campgrounds/show', {campground: foundCampground});

		}
	});
});

// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req,res)=>{
	// is user even logged in?
	Campground.findById(req.params.id, (err, foundCampground)=>{
		res.render('campgrounds/edit', {campground: foundCampground});
	});
});

// UPDATE
router.put('/:id',middleware.checkCampgroundOwnership,(req,res)=>{
	// find and update correct campground
	req.body.campground.description = req.sanitize(req.body.campground.description);
	Campground.findByIdAndUpdate(req.params.id,req.body.campground, (err,updatedCampground)=>{
		if(err){
			res.redirect('/campgrounds');
		} else{
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});

// DESTROY
router.delete('/:id',middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findByIdAndRemove(req.params.id,(err)=>{
		err ? res.redirect('/campgrounds') : res.redirect('/campgrounds');
	});
});

function escapeRegex(text) {
	return text.replace(/[=[\]{}()*+?.,\\^$|\s]/g, "\\$&");
}
module.exports = router;
