var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Campground = require('../models/campground');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

// Landing Page
router.get('/', function(req,res){
	res.render('landing');
});

// Register
router.get('/register', (req,res)=>{
	res.render('register', {page: 'register'});
});

//handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		avatar: req.body.avatar
	});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
			res.redirect("/campgrounds"); 
		});
	});
});

// Login
router.get('/login', (req,res)=>{
	res.render('login', {page:'login'});
});

router.post('/login', passport.authenticate('local', 
	{
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}), (req,res)=>{
	});

// Logout route
router.get('/logout', (req,res)=>{
	req.logout();
	req.flash('success', 'Successfully logged out!');
	res.redirect('/campgrounds');
});

// Forgot password route
router.get('/forgot', (req,res)=>{
	res.render('forgot');
});

router.post('/forgot',(req,res,next)=>{
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, (err,buf)=>{
				var token = buf.toString('hex');
				done(err,token);
			});
		},
		function(token,done){
			User.findOne({ email: req.body.email }, (err,user)=>{
				if(!user) {
					req.flash('error', 'No account with that email address exists.');
					return res.redirect('/forgot');
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now()+3600000; //1 hour

				user.save((err)=>{
					done(err,token,user);
				});
			});
		},
		function(token, user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'learntocodeinfo@gmail.com',
					pass: process.env.RESETMAILPW
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'learntocodeinfo@gmail.com',
				subject: 'Password Reset',
				text: 'You are receiving this because you (or someone else) requested a password reset for the account linked to this email address. Please visit the following address to complete the password reset process:\n http://'+req.headers.host + '/reset'+token+'\n\n'+'This link is valid for one hour. If you did not request a password change, please ignore this message - your password will remain unchanged.'
			};
			smtpTransport.sendMail(mailOptions, (err)=>{
				console.log('mail sent');
				req.flash('success', 'An email was sent to '+user.email+' with further instructions.');
				done(err,'done');
			});
		}
	], (err)=>{
		if(err) return next(err);
		res.redirect('/forgot');
	});
});

router.get('/reset/:token',(req,res)=>{
	User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user)=>{
		if(!user){
			req.flash('error', 'Password reset token is invalid or has expired');
			return res.redirect('/forgot');
		}
		res.render('reset', {token: req.params.token});
	});
});


router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'learntocodeinfo@gmail.com',
          pass: process.env.RESETMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'learntocodeinfo@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});

// USER PROFILES
router.get('/users/:id',(req,res)=>{
	User.findById(req.params.id, (err,foundUser)=>{
		if(err){
			req.flash('error','User not found!');
			res.redirect('back');
		}
		Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
			res.render('users/show', {user: foundUser, campgrounds: campgrounds});
		})
	});
});


module.exports = router;
