var express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = require('./models/user'),
	bodyParser = require('body-parser'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost:27017/auth_app_demo', {useNewUrlParser: true});

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
	secret: 'two regular goats',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

//////////////////////////////////////////////////
//ROUTES
//////////////////////////////////////////////////

app.get('/',(req,res) => {
	res.render('home');
});
app.get('/secret',isLoggedIn,(req,res)=>{
	res.render('secret');
});

app.get('/register',(req,res)=>{
	res.render('register');
});

app.post('/register',(req,res)=>{
	User.register(new User({username: req.body.username}), req.body.password, (err,user)=>{
		if(err) { 
			console.log(err)
			return res.render('register');
		}
		else {
			passport.authenticate('local')(req,res, ()=> {
				res.redirect('/secret');
			});
		}
	});
});

// LOGIN ROUTES

app.get('/login', (req,res)=>{
	res.render('login');
});
app.post('/login', passport.authenticate('local',{
	successRedirect: '/secret',
	failureRedirect: '/login'
}), (req,res)=>{
});

app.get('/logout',(req,res)=>{
	req.logout();
	res.redirect('/');
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

//

// listening port
app.listen(3000, function(){
	console.log('Auth server running!');
});
