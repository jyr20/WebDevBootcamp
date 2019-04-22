var button = document.querySelector('button');
var body = document.body;
var isPurple = false;

console.log('ACTIVE');
button.addEventListener("click", function(){
	body.classList.toggle('purple');
});
