// Mover o personagem - através dos botões ou painel
// Move para a direita até que left seja >= ao limite do fundo
function right() {
	let div1Left = parseInt(getComputedStyle(character).left);
	let div1Width = parseInt(getComputedStyle(character).width);
	let fundoWidth = parseInt(getComputedStyle(game).width);

	character.style.left = getLeftForRight(div1Left, fundoWidth, div1Width) + "px";
	evaluateScore();
}

function getLeftForRight(div1Left, fundoWidth, div1Width) {
	return (div1Left + speedCharacter >= fundoWidth - div1Width) ?
		fundoWidth - div1Width:
		div1Left + speedCharacter;
}

// Move para a esquerda até que left seja <= 0
function left() {
	let div1Left = parseInt(getComputedStyle(character).left);
	let newDivLeft = div1Left - speedCharacter;
	character.style.left = (newDivLeft <= 0 ? 0 : newDivLeft) + "px";
	evaluateScore();
}