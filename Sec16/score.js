var p1B = document.querySelector("#p1");
var p2B = document.querySelector("#p2");
var p1N = document.querySelector('#p1N');
var p2N = document.querySelector('#p2N');
var num = document.querySelector('input');
var max = document.querySelector('#max');
var p1S = 0;
var p2S = 0;
var gameOver = false;
var winScore = 5;

function resetGame(){
	p1S = 0;
	p2S = 0;
	p1N.textContent = p1S;
	p2N.textContent = p2S;
	gameOver = false;
	p1N.classList.remove('winner');
	p2N.classList.remove('winner');
}

p1B.addEventListener('click', function(){
	if (!gameOver){
		p1S++;
		p1N.textContent = p1S;
	}
	if (p1S === winScore){
		gameOver = true;
		p1N.classList.add('winner');
	}
})

p2B.addEventListener('click', function(){
	if (!gameOver){
		p2S++;
		p2N.textContent = p2S;
	}
	if (p2S === winScore){
		gameOver = true;
		p2N.classList.add('winner');
	}
})

reset.addEventListener('click', resetGame)

num.addEventListener('change',function(){
	max.textContent = num.value ;
	winScore = Number(num.value);
	resetGame();
})
