var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog_demo');

var postSchema = new mongoose.Schema({
	title: String,
	content: String
});

var Post = mongoose.model('Post', postSchema);

var userSchema = new mongoose.Schema({
	email: String,
	name: String,
	posts: [postSchema]
});

var User = mongoose.model('User',userSchema);

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

User.findOne({name: 'Hello Bye'}, function(err,user){
	if(err){
		console.log(err);
	} else {
		user.posts.push({
			title: 'cheese',
			content: 'tis cheesy'
		});
		user.save(function(err,user){
			if(err){
				console.log(err);
			} else {
				console.log(user);
			}
		});
	}
});
