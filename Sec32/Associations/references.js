var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog_demo_ref');

var Post = require('./models/post');
var User = require('./models/user');

// User.findOne({email:'bob@gmail.com'}).populate('posts').exec(function(err,user){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log(user);
// 	}
// });
// User.create({
// 	email: 'bob@gmail.com',
// 	name: 'Bob Bobber'
// });

Post.create({
	title: 'how to mate',
	content: 'open your heart'
}, function(err, post){
	User.findOne({email: 'bob@gmail.com'}, function(err, foundUser){
		if(err){
			console.log('errorrrr');
		} else {
			foundUser.posts.push(post);
			foundUser.save(function(err,data){
				if(err){
					console.log(err);
				} else{
					console.log(data);
				}
			});
		}
	});
});

// var newUser = new User({
// 	email: 'hello@bye.edu',
// 	name: "Hello Bye"
// });

// newUser.posts.push({
// 	title: 'how to do stuff',
// 	content: 'idk m8'
// });

// newUser.save(function(err, user){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log(user);
// 	}
// });

// var newPost = new Post({
// 	title: 'Reflections on apples',
// 	content: 'they are delicious'
// });


// newPost.save(function(err, post){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log(post);
// 	}
// });

// User.findOne({name: 'Hello Bye'}, function(err,user){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		user.posts.push({
// 			title: 'cheese',
// 			content: 'tis cheesy'
// 		});
// 		user.save(function(err,user){
// 			if(err){
// 				console.log(err);
// 			} else {
// 				console.log(user);
// 			}
// 		});
// 	}
// });
