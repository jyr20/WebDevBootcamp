var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema= new mongoose.Schema({
	username: {type: String, unique: true, required: true},
	password: String,
	avatar: {type: String, default: 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png'},
	firstName: {type: String, default: this.username},
	lastName: {type: String, default: ''},
	email: {type: String, unique: true, required: true},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);
