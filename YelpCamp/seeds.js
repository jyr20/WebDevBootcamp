var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var seeds = [
	{
		name: 'The big tent',
		image:'https://images.unsplash.com/photo-1545153996-9419dd2acf66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80',
		description: 'Very nice place'
	},
	{
		name: 'The Salty Mound',
		image:'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		description: 'Very moundy place'
	},
	{
		name: 'The Marshes',
		image:'https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		description: 'Lots of salt and stuff'
	},

	{
		        name: "Cloud's Rest", 
		        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
		        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
		    
	},
	{
		        name: "Desert Mesa", 
		        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
		        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
		    
	},
	{
		        name: "Canyon Floor", 
		        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
		        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
		    
	}
];

async function seedDB(){
	try{
		await Comment.remove({});
		console.log('Campgrounds removed');
		await Campground.remove({});
		console.log('Comments removed');
		for(const seed of seeds){
			let campground = await Campground.create(seed);
			console.log('Campground created');
			let comment = await Comment.create(
				{
					text: "This place is great, but I wish there was internet",
					author: "Homer"
				});
			console.log('Comment created');
			campground.comments.push(comment);
			campground.save();
			console.log('Comment added to campground');

		}
	} catch(err) {
		console.log(err);
	}
}

module.exports = seedDB;
