var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost/cat_app');

var catSchema = new mongoose.Schema({
	name: String,
	age: Number,
	temperament: String
});

var Cat = mongoose.model('Cat', catSchema);

var jeff = new Cat({
	name: 'Steve',
	age: 13,
	temperament: 'Sleepy'
});
// jeff.save(function(err, cat){
// 	err ? console.log('err') : console.log('no err');
// });

Cat.create({
	name: 'Meg',
	age: '9',
	temperament: 'meh'
}, function(err,cat){
	err ? console.log(err) : console.log(cat);
});
Cat.find({}, function(err,cat){
	if(err){
		console.log('errrr neeeeerrr');
		console.log(err);
	} else{
		console.log(cat);
	}
});

