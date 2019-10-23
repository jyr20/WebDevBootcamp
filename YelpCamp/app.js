var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
seedDB();

// PASSPORT CONGIF
app.use(require('express-session')({
	secret: 'i like ketchup',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	next();
});

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

app.get('/campgrounds/:id/comments/new',isLoggedIn,(req,res) => {
	Campground.findById(req.params.id, (err,campground) => {
		err ? console.log(err) : res.render('comments/new', {campground: campground})
	});
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req,res) => {
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

//======================================
// AUTH ROUTES
// =====================================

app.get('/register', (req,res)=>{
	res.render('register');
});

app.post('/register', (req,res)=>{
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err,user)=>{
		if(err){
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req,res,()=>{
			res.redirect('/campgrounds');
		});
	});
});

app.get('/login', (req,res)=>{
	res.render('login');
});

app.post('/login', passport.authenticate('local', 
	{
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
	}), (req,res)=>{
});

// Logout route
app.get('/logout', (req,res)=>{
	req.logout();
	res.redirect('/campgrounds');
});





function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}



// listening port
app.listen(3000, function(){
	console.log('YelpCamp server running!');
});
