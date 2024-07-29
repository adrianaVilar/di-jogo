
const levels = [
    {
        audio: 'audio/pig-song.mp3',
        backgroundImg: 'url(imgs/back-pig.jpg)',
        img: 'url(imgs/guinea-pig.png)',
        foodImg: 'url(imgs/carrot.png)',
        score: 0,
        scoreToWin: 1,
        text: "Alimente o porquinho-da-índia com cenouras para avançar de nível"
    },
    {
        audio: 'audio/cat-song.mp3',
        backgroundImg: 'url(imgs/back-cat.jpg)',
        img: 'url(imgs/cat.png)',
        foodImg: 'url(imgs/meat.png)',
        score: 0,
        scoreToWin: 2,
        text: "Alimente o gatinho com carne para avançar de nível"
    },
    {
        audio: 'audio/dog-song.mp3',
        backgroundImg: 'url(imgs/back-dog.jpg)',
        img: 'url(imgs/dog.png)',
        foodImg: 'url(imgs/bones.png)',
        score: 0,
        scoreToWin: 3,
        text: "Alimente o cão com ossos para avançar de nível"
    }
];

let gameState = {
    life: 3,
    currentLevel: levels[0],
    isLastLevel: () => levels.indexOf(gameState.currentLevel) === levels.length - 1,
    nextLevel: () => gameState.currentLevel = levels[levels.indexOf(gameState.currentLevel) + 1],
    restart: () => {
        gameState.currentLevel = levels[0];
        gameState.life = gameState.life;
        levels.forEach(level => level.score = 0)
    },
    increaseLevelScore: () => gameState.currentLevel.score++,
    getFinalScore: () => levels.map(level => level.score).reduce((a, b) => a + b, 0),
    getLevelNumber: () => levels.indexOf(gameState.currentLevel) + 1,
    getSong: () => gameState.currentLevel.audio
};

const screenElements = {
    btnLeft: document.querySelector("#left"),
    btnRight: document.querySelector("#right"),
    btnStart: document.querySelector("#start"),
    divGame: document.querySelector(".game-area"),
    divGameArea: document.querySelector(".game-area-background"),
    divGameOver: document.getElementById('game-over'),
    divWin: document.getElementById('winner'),
    score: document.getElementById('score-icon'),
    scoreToWin: document.querySelector("#score-to-win"),
    song: document.querySelector('#background-song'),
    spanLifeValue: document.getElementById('life-value'),
    spanGameOver: document.getElementById('final-score'),
    spanScoreValue: document.getElementById('score-value'),
    spanWinFinalScore: document.getElementById('win-final-score')
}

//Adiciona o evento click no botão iniciar
screenElements.btnStart.addEventListener("click", () => {startLevel()});
    
//Ativa botões do teclado
document.addEventListener("keydown", (e) => {onKeyDown(e)});

//Ativa botões do painel de controle
screenElements.btnLeft.addEventListener("click", () => left());
screenElements.btnRight.addEventListener("click", () => right());

function startLevel() {
    screenElements.song.play();
    screenElements.song.src = gameState.getSong();
    screenElements.song.loop = true;
    screenElements.divGameArea.style.backgroundImage = gameState.currentLevel.backgroundImg;
    screenElements.divGame.style.backgroundImage = 'none';
    screenElements.scoreToWin.innerText = gameState.currentLevel.scoreToWin;
    screenElements.score.style.backgroundImage = gameState.currentLevel.foodImg;
	characterElement.style.backgroundImage = gameState.currentLevel.img;

	//Deixa o botão iniciar invisivel
	screenElements.btnStart.style.visibility = "hidden";
    startFoods();
}

// Função para avançar para o próximo nível
function nextLevel() {
    if (gameState.isLastLevel()) { // Define o número máximo de níveis
        winnerGame();
    } else {
        gameState.nextLevel();
        resetLifeScore();
        resetFood();
        startLevel();
    }
}

//Testa se há colisão entre o personagem e o alimento
function crash() {

	// Pega os dados do personagem
	let characterLeft = parseInt(getComputedStyle(character).left);
	let characterTop = parseInt(getComputedStyle(character).top);
	let characterWidth = parseInt(getComputedStyle(character).width);
	let characterRight = characterLeft + characterWidth;
	let characterSize = characterRight - characterLeft;

	// Pega os dados do alimento
	let foodsLeft = parseInt(getComputedStyle(food).left);
	let foodsTop = parseInt(getComputedStyle(food).top);
	let foodsHeight = parseInt(getComputedStyle(food).height);
	let foodsWidth = parseInt(getComputedStyle(food).width);
	let foodRight = foodsLeft + foodsWidth;
	foodSize = foodRight - foodsLeft;

	// Se não estiver na altura certa, não precisa validar
	if (!(foodsTop + foodsHeight >= characterTop)) {
		return false;
	}

	// Verifica se o animal é maior que o alimento
	if (characterSize >= foodSize) {
		if ((foodsLeft >= characterLeft && foodsLeft <= characterRight) || 
			(foodRight >= characterLeft && foodRight <= characterRight)) {
				return true;
		}
	} else {
			if ((characterLeft >= foodsLeft && characterRight <= foodsLeft) || 
			(characterLeft >= foodRight && characterRight <= foodRight)) {
				return true;
		}
	}

	return false;
}

function decreaseLife() {
    gameState.life--;
	screenElements.spanLifeValue.innerHTML = gameState.life;

    if (gameState.life === 0) {
        gameOver();
    }
}

function increaseScore() {
    gameState.increaseLevelScore();
	document.getElementById('score-value').innerHTML = gameState.currentLevel.score;

    if (gameState.currentLevel.score === gameState.currentLevel.scoreToWin) {
        nextLevel();
    }
}

function gameOver() {
    screenElements.song.play();
    screenElements.song.src = "audio/game-over-song.mp3";
    screenElements.song.loop = false;
    showResults(screenElements.divGameOver, screenElements.spanGameOver)
}

function winnerGame() {
    screenElements.song.play();
    screenElements.song.src = "audio/winner-song.mp3";
    screenElements.song.loop = false;
    showResults(screenElements.divWin, screenElements.spanWinFinalScore)
}

//TODO: este método não está coeso. Faz 3 coisas: mostra resultado, salva o jogo e reseta comida
function showResults(resultDiv, resultSpan) {
    resultSpan.textContent = gameState.getFinalScore();
    resultDiv.style.display = 'flex';
    let previousResults = "";
    loadGameData().forEach((result) => {
        previousResults += "<p> Data: " + result.date + " Score: " + result.score + " Level: " + result.level + "</p>"
    })
    resultDiv.querySelector("div.previous-results").innerHTML = previousResults;
    saveLevel(gameState);
    resetFood();
}

function restartGame() {
    gameState.restart();
    resetLifeScore();
    startLevel();
}

function resetLifeScore() {
    screenElements.divGameOver.style.display = 'none';
    screenElements.divWin.style.display = 'none';
    gameState.life = 3;
    screenElements.spanLifeValue.innerHTML = gameState.life;
    gameState.currentLevel.score = 0;
    screenElements.spanScoreValue.innerHTML = gameState.currentLevel.score;
}

function formatDate(date) {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return (dd + '/' + mm + '/' + yyyy);
}

// Garantir que as telas de Game Over e Vencedor estejam ocultas inicialmente
document.addEventListener("DOMContentLoaded", function() {
    screenElements.divGameOver.style.display = 'none';
    screenElements.divWin.style.display = 'none';
});

function saveLevel(gameState) {
    
    gameState.getFinalScore(), levels.indexOf(gameState.currentLevel)
    let history = loadGameData();

    if(history.length >= 3) {
        history.splice(2, history.length)
    }

    const gameData = {
        score: gameState.getFinalScore(),
        level: gameState.getLevelNumber(),
        date: formatDate(new Date())
    };
    history = [gameData, ...history]
    // history.push(gameData)

    localStorage.setItem('lastGame', JSON.stringify(history));
}

function loadGameData() {
    const savedData = JSON.parse(localStorage.getItem('lastGame'));
    return savedData? savedData: []

}