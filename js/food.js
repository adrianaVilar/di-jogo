let characterElement = document.getElementById('character');
let food;
let foodSize = 5;
let speedCharacter = 10;
let speedFood = 5;
let timerInitiateFood;
let timerCleanerFood;


//Inicia o movimento dos alimentos no geral
function startFoods() {
	food = document.createElement("div");
	food.classList.add("food");
	food.style.left = getRandom() + "px";
	//TODO: mover para screen
	food.style.backgroundImage = gameState.currentLevel.foodImg;
	game.appendChild(food);
	timerInitiateFood = setInterval(moveFood, 100);
}

// Inicia o movimento de cada alimento
function moveFood() {
	let top = parseInt(getComputedStyle(food).top);
	food.style.top = (top + speedFood) + "px";
	evaluateScore();
}

// Valida se pode remover da tela, o motivo e chama a pontuação
function evaluateScore() {
	let topFood = parseInt(getComputedStyle(food).top);
	let bottomCharacter = parseInt(getComputedStyle(character).top + parseInt(getComputedStyle(character).height));
	
	if (topFood >= bottomCharacter) {
		removeFromTheView();
		decreaseLife();
	}

	if (crash()) {
		removeFromTheView();
		increaseScore();
	}
}

// Remove da tela
function removeFromTheView() {
	resetFood();
	startFoods();
}

// Reseta temporizador e remove div do alimento
function resetFood() {
	food.parentElement.removeChild(food);
	clearInterval(timerInitiateFood);
	clearInterval(timerCleanerFood);
}

const keyEvents = {
	a: () => left(),
	d: () => right()
}
// Callback para clicar na tecla
function onKeyDown(event) {
	let keyFunction = keyEvents[event.key.toLowerCase()];
	if (keyFunction) {
		keyFunction();
	}
}

// Gera um número aleatório entre 0 e o tamanho do fundo
function getRandom() {
    let gameWidth = parseInt(getComputedStyle(game).width);
	let maxLeft = gameWidth - foodSize;
	let foodLeft = Math.floor(Math.random() * gameWidth);
    return foodLeft <= maxLeft ? foodLeft : maxLeft;
}