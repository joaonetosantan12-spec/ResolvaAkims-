const canvas = document.querySelector('#game-board');
const context = canvas.getContext('2d');
const questionElement = document.querySelector('#question');
const questionTimerElement = document.querySelector('#question-timer');
const scoreElement = document.querySelector('#score');
const bestScoreElement = document.querySelector('#best-score');
const messageElement = document.querySelector('#game-message');
const messageTitle = document.querySelector('#message-title');
const messageDetail = document.querySelector('#message-detail');
const restartButton = document.querySelector('#restart-button');
const menuElement = document.querySelector('#game-menu');
const tutorialScreenElement = document.querySelector('#tutorial-screen');
const tutorialBackButton = document.querySelector('#tutorial-back');
const tutorialStartButton = document.querySelector('#tutorial-start');
const gameScreenElement = document.querySelector('#game-screen');
const playSnakeButton = document.querySelector('#play-snake');
const backToGamesButton = document.querySelector('#back-to-games');
const bossHudElement = document.querySelector('#boss-hud');
const bossDialogueElement = document.querySelector('#boss-dialogue');
const bossDialoguePanelElement = document.querySelector('.boss-dialogue-panel');
const bossSpeakerElement = document.querySelector('#boss-speaker');
const bossDialogueLineElement = document.querySelector('#boss-dialogue-line');
const wormLivesElement = document.querySelector('#worm-lives');
const wormLivesCountElement = document.querySelector('#worm-lives-count');
const wormLifePips = document.querySelectorAll('.worm-life-pip');
const bossContinueButton = document.querySelector('#boss-continue');
const bossCountdownElement = document.querySelector('#boss-countdown');
const bossCountdownWordElement = document.querySelector('#boss-countdown-word');
const bossHealthFillElement = document.querySelector('#boss-health-fill');
const bossHealthTrackElement = document.querySelector('.boss-health-track');
const bossHealthLabelElement = document.querySelector('#boss-health-label');
const bossReactionElement = document.querySelector('#boss-reaction');
const boardWrapElement = document.querySelector('.board-wrap');
const collectAudio = new Audio('Sounds/Collect.mp3');
const typingAudio = new Audio('Sounds/Digitando.mp3');
const bossMusicAudio = new Audio('Sounds/FundoBoss.mp3');
const luteAudio = new Audio('Sounds/Lute.mp3');
const loseAudio = new Audio('Sounds/Lose.mp3');
const startGameAudio = new Audio('Sounds/StartGame.mp3');

bossMusicAudio.loop = true;
bossMusicAudio.volume = 0.25;

const cellSize = 30;
const answerDelay = 1500;
const foodSnakeMargin = 2;
const bossScoreTarget = 2;
const bossStartingHealth = 8;
const bossStartDelay = 4000;
const bossCountdownStep = 5000;
const wormStartingLives = 3;
const easyTableMaximum = 5;
const easyQuestionSeconds = 10;
const hardQuestionSeconds = 16;
const relaxedMobileQuestionBonusSeconds = 6;
const regularSnakeMoveInterval = 145;
const relaxedMobileSnakeMoveInterval = 190;
const isRelaxedMobile = window.matchMedia('(pointer: coarse)').matches;
// Formato: { number1, number2, answers: [resposta1, resposta2, correta] }.
const normalQuestions = [
{ number1: 2, number2: 2, answers: [3, 5, 4] },
{ number1: 2, number2: 3, answers: [5, 8, 6] },
{ number1: 2, number2: 4, answers: [10, 6, 8] },
{ number1: 2, number2: 5, answers: [8, 12, 10] },
{ number1: 2, number2: 6, answers: [14, 10, 12] },
{ number1: 2, number2: 7, answers: [12, 16, 14] },
{ number1: 2, number2: 8, answers: [18, 14, 16] },
{ number1: 2, number2: 9, answers: [16, 20, 18] },

{ number1: 3, number2: 3, answers: [6, 12, 9] },
{ number1: 3, number2: 4, answers: [10, 15, 12] },
{ number1: 3, number2: 5, answers: [18, 12, 15] },
{ number1: 3, number2: 6, answers: [16, 21, 18] },
{ number1: 3, number2: 7, answers: [24, 18, 21] },
{ number1: 3, number2: 8, answers: [21, 27, 24] },
{ number1: 3, number2: 9, answers: [30, 24, 27] },

{ number1: 4, number2: 4, answers: [12, 20, 16] },
{ number1: 4, number2: 5, answers: [24, 16, 20] },
{ number1: 4, number2: 6, answers: [28, 20, 24] },
{ number1: 4, number2: 7, answers: [24, 32, 28] },
{ number1: 4, number2: 8, answers: [36, 28, 32] },
{ number1: 4, number2: 9, answers: [40, 32, 36] },

{ number1: 5, number2: 5, answers: [20, 30, 25] },
{ number1: 5, number2: 6, answers: [35, 25, 30] },
{ number1: 5, number2: 7, answers: [40, 30, 35] },
{ number1: 5, number2: 8, answers: [45, 35, 40] },
{ number1: 5, number2: 9, answers: [35, 50, 45] },

{ number1: 6, number2: 6, answers: [30, 42, 36] },
{ number1: 6, number2: 7, answers: [40, 48, 42] },
{ number1: 6, number2: 8, answers: [54, 42, 48] },
{ number1: 6, number2: 9, answers: [48, 60, 54] },

{ number1: 7, number2: 7, answers: [42, 56, 49] },
{ number1: 7, number2: 8, answers: [63, 49, 56] },
{ number1: 7, number2: 9, answers: [56, 70, 63] },

{ number1: 8, number2: 8, answers: [56, 72, 64] },
{ number1: 8, number2: 9, answers: [63, 81, 72] },

{ number1: 9, number2: 9, answers: [72, 90, 81] },
];
const bossQuestions = [
{      number1: 9, number2: 9, answers: [72, 90, 81] },
{   number1: 9, number2: 12, answers: [99, 120, 108] },
{  number1: 9, number2: 14, answers: [117, 135, 126] },
{  number1: 9, number2: 16, answers: [134, 154, 144] },
{ number1: 10, number2: 11, answers: [100, 120, 110] },
{ number1: 10, number2: 13, answers: [120, 143, 130] },
{ number1: 10, number2: 15, answers: [140, 160, 150] },
{ number1: 10, number2: 17, answers: [160, 180, 170] },
{ number1: 11, number2: 12, answers: [121, 144, 132] },
{ number1: 11, number2: 14, answers: [143, 168, 154] },
{ number1: 11, number2: 16, answers: [165, 187, 176] },
{ number1: 11, number2: 18, answers: [198, 209, 198] },
{ number1: 12, number2: 12, answers: [132, 156, 144] },
{ number1: 12, number2: 13, answers: [144, 168, 156] },
{ number1: 12, number2: 15, answers: [165, 195, 180] },
{ number1: 12, number2: 17, answers: [192, 216, 204] },
{ number1: 12, number2: 19, answers: [216, 240, 228] },
{ number1: 13, number2: 13, answers: [156, 182, 169] },
{ number1: 13, number2: 14, answers: [182, 196, 182] },
{ number1: 13, number2: 16, answers: [192, 224, 208] },
{ number1: 13, number2: 18, answers: [216, 252, 234] },
{ number1: 14, number2: 14, answers: [182, 210, 196] },
{ number1: 14, number2: 15, answers: [196, 224, 210] },
{ number1: 14, number2: 17, answers: [238, 252, 238] },
{ number1: 14, number2: 19, answers: [252, 285, 266] },
{ number1: 15, number2: 15, answers: [210, 240, 225] },
{ number1: 15, number2: 16, answers: [225, 255, 240] },
{ number1: 15, number2: 18, answers: [252, 288, 270] },
{ number1: 16, number2: 16, answers: [240, 272, 256] },
{ number1: 16, number2: 17, answers: [255, 289, 272] },
{ number1: 16, number2: 19, answers: [288, 320, 304] },
{ number1: 17, number2: 17, answers: [272, 306, 289] },
{ number1: 17, number2: 18, answers: [289, 323, 306] },
{ number1: 18, number2: 18, answers: [306, 342, 324] },
{ number1: 18, number2: 19, answers: [324, 360, 342] },
{ number1: 19, number2: 19, answers: [342, 380, 361] },
];
const questionDecks = new Map([
	[normalQuestions, []],
	[bossQuestions, []],
]);
let lastQuestionKey = '';
const bossIntroDialogue = [
{ speaker: 'MINHOQUINHA', text: 'Vinte pontos... e eu achando que a parte difícil tinha passado.' },
{ speaker: 'RESOLVEAKIMS', text: 'Hahaha! Mal sabe você o que te espera.' },
{ speaker: 'MINHOQUINHA', text: 'Ah, é? Então vem. Eu não vou parar agora.' },
];
const bossVictoryDialogue = [
	{ speaker: 'RESOLVEAKIMS', text: '... MAS COMO!?' },
	{ speaker: 'MINHOQUINHA', text: 'GG Já era pra você' },
];
let cellCount = canvas.width / cellSize;
const directions = {
	up: { x: 0, y: -1 },
	down: { x: 0, y: 1 },
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 },
};

let direction;
let nextDirection;
let directionQueue = [];
let answer;
let currentQuestionAnswers = [];
let foods;
let score;
let timer;
let answerDelayTimer;
let foodFlashTimer;
let questionCountdownTimer;
let questionDeadline;
let isRunning;
let hasStarted;
let directionChanged;
let isFoodPreview = false;
let foodPreviewVisible = false;
let isBossPhase = false;
let isBossDialogue = false;
let hasDefeatedBoss = false;
let bossHealth = 0;
let wormLives = 0;
let bossDialogueLines = [];
let bossDialogueIndex = 0;
let bossDialogueMode = '';
let dialogueTypingTimer;
let bossStartTimer;
let bossCountdownTimer;
let isBossOpening = false;
let countdownAudioContext;
let bossReactionTimer;
let wormHitTimer;
let bossCascadeTimer;
let bossCascadeProgress = -1;
let bestScore = Number(localStorage.getItem('snakeMathBest') || 0);

bestScoreElement.textContent = bestScore;

function playSound(audio, loop = false) {
	audio.pause();
	audio.currentTime = 0;
	audio.loop = loop;
	const playback = audio.play();
	if (playback) playback.catch(() => {});
}

function stopSound(audio) {
	audio.pause();
	audio.currentTime = 0;
	audio.loop = false;
}

function stopDialogueTyping() {
	clearInterval(dialogueTypingTimer);
	dialogueTypingTimer = null;
	stopSound(typingAudio);
}

function playBossImpact(isGo = false) {
	const AudioContextType = window.AudioContext || window.webkitAudioContext;
	if (!AudioContextType) return;
	countdownAudioContext ??= new AudioContextType();
	if (countdownAudioContext.state === 'suspended') countdownAudioContext.resume().catch(() => {});

	const now = countdownAudioContext.currentTime;
	const oscillator = countdownAudioContext.createOscillator();
	const gain = countdownAudioContext.createGain();
	oscillator.type = 'sine';
	oscillator.frequency.setValueAtTime(isGo ? 92 : 74, now);
	oscillator.frequency.exponentialRampToValueAtTime(31, now + 0.38);
	gain.gain.setValueAtTime(0.0001, now);
	gain.gain.exponentialRampToValueAtTime(isGo ? 0.28 : 0.18, now + 0.018);
	gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
	oscillator.connect(gain);
	gain.connect(countdownAudioContext.destination);
	oscillator.start(now);
	oscillator.stop(now + 0.42);
}

function randomCell() {
	return Math.floor(Math.random() * cellCount);
}

function isOutsideSnakeMargin(x, y) {
	return snake.every((segment) =>
		Math.max(Math.abs(segment.x - x), Math.abs(segment.y - y)) > foodSnakeMargin
	);
}

function resizeBoardForScreen() {
	const boardSize = 420;
	if (canvas.width === boardSize) return false;

	canvas.width = boardSize;
	canvas.height = boardSize;
	cellCount = boardSize / cellSize;
	return true;
}

function placeFood() {
	const values = [...currentQuestionAnswers];

	const availableCells = [];
	for (let y = 0; y < cellCount; y += 1) {
		for (let x = 0; x < cellCount; x += 1) {
			const insidePlayArea = x > 0 && x < cellCount - 1 && y > 0 && y < cellCount - 1;
			if (insidePlayArea && isOutsideSnakeMargin(x, y)) {
				availableCells.push({ x, y });
			}
		}
	}

	for (let index = availableCells.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[availableCells[index], availableCells[swapIndex]] = [availableCells[swapIndex], availableCells[index]];
	}

	foods = values.slice(0, availableCells.length).map((value, index) => ({
		...availableCells[index],
		value,
	}));
	return foods.length > 0;
}

function newQuestion() {
	const questions = isBossPhase ? bossQuestions : normalQuestions;
	const deck = questionDecks.get(questions);
	if (deck.length === 0) {
		deck.push(...questions);
		for (let index = deck.length - 1; index > 0; index -= 1) {
			const swapIndex = Math.floor(Math.random() * (index + 1));
			[deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
		}

		const firstQuestion = deck[deck.length - 1];
		const firstQuestionKey = `${firstQuestion.number1}x${firstQuestion.number2}`;
		if (deck.length > 1 && firstQuestionKey === lastQuestionKey) {
			[deck[deck.length - 1], deck[deck.length - 2]] = [deck[deck.length - 2], deck[deck.length - 1]];
		}
	}
	const question = deck.pop();
	lastQuestionKey = `${question.number1}x${question.number2}`;
	const firstFactor = question.number1;
	const secondFactor = question.number2;
	const product = firstFactor * secondFactor;
	const correctAnswer = question.answers[2] === product ? question.answers[2] : product;
	const wrongAnswers = [...new Set(question.answers.slice(0, 2))]
		.filter((value) => Number.isFinite(value) && value !== correctAnswer);
	let fallbackAnswer = correctAnswer + 1;
	while (wrongAnswers.length < 2) {
		if (fallbackAnswer !== correctAnswer && !wrongAnswers.includes(fallbackAnswer)) {
			wrongAnswers.push(fallbackAnswer);
		}
		fallbackAnswer += 1;
	}
	currentQuestionAnswers = [wrongAnswers[0], wrongAnswers[1], correctAnswer];
	answer = correctAnswer;
	questionElement.textContent = `${firstFactor} × ${secondFactor} = ?`;
	const timeLimit = Math.max(firstFactor, secondFactor) <= easyTableMaximum
		? easyQuestionSeconds
		: hardQuestionSeconds;
	startQuestionCountdown(timeLimit + (isRelaxedMobile ? relaxedMobileQuestionBonusSeconds : 0));
}

function clearQuestionCountdown() {
	clearInterval(questionCountdownTimer);
	questionCountdownTimer = null;
	questionDeadline = 0;
	questionTimerElement.classList.remove('is-low');
	questionTimerElement.textContent = '';
}

function startQuestionCountdown(timeLimit) {
	clearInterval(questionCountdownTimer);
	questionDeadline = Date.now() + timeLimit * 1000;
	questionTimerElement.textContent = `${timeLimit} s`;
	questionTimerElement.classList.remove('is-low');
	questionCountdownTimer = setInterval(() => {
		const remainingSeconds = Math.max(0, Math.ceil((questionDeadline - Date.now()) / 1000));
		const display = `${remainingSeconds} s`;
		if (questionTimerElement.textContent !== display) questionTimerElement.textContent = display;
		questionTimerElement.classList.toggle('is-low', remainingSeconds <= 3);
		if (remainingSeconds > 0) return;

		clearQuestionCountdown();
		if (!isRunning) return;
		if (isBossPhase) {
			loseWormLife();
			return;
		}

		endGame('Tempo esgotado!', 'O tempo para responder acabou. Tente de novo!');
	}, 100);
}

function updateBossHealth() {
	const healthPercent = (bossHealth / bossStartingHealth) * 100;
	bossHealthFillElement.style.width = `${healthPercent}%`;
	bossHealthTrackElement.setAttribute('aria-valuenow', String(bossHealth));
	bossHealthLabelElement.textContent = `${String(bossHealth).padStart(2, '0')} / ${String(bossStartingHealth).padStart(2, '0')}`;
}

function updateWormLives() {
	wormLivesElement.setAttribute('aria-valuenow', String(wormLives));
	wormLivesCountElement.textContent = `${wormLives} / ${wormStartingLives}`;
	wormLifePips.forEach((pip, index) => {
		pip.classList.toggle('is-lost', index >= wormLives);
	});
}

function renderBossDialogue() {
	stopDialogueTyping();
	const currentLine = bossDialogueLines[bossDialogueIndex];
	bossSpeakerElement.textContent = currentLine.speaker;
	bossDialogueLineElement.textContent = '';
	bossDialoguePanelElement.classList.toggle('boss-line-boss', currentLine.speaker === 'RESOLVEAKIMS');
	bossDialoguePanelElement.classList.toggle('boss-win', bossDialogueMode === 'victory');
	const isLastLine = bossDialogueIndex === bossDialogueLines.length - 1;
	bossContinueButton.textContent = isLastLine
		? bossDialogueMode === 'intro' ? 'ENFRENTAR ›' : 'VOLTAR AO JOGO ›'
		: 'CONTINUAR ›';

	const characters = Array.from(currentLine.text);
	if (characters.length === 0) return;
	let visibleCharacters = 0;
	playSound(typingAudio, true);
	dialogueTypingTimer = setInterval(() => {
		visibleCharacters += 1;
		bossDialogueLineElement.textContent = characters.slice(0, visibleCharacters).join('');
		if (visibleCharacters >= characters.length) stopDialogueTyping();
	}, 1000 / characters.length);
}

function showBossDialogue(lines, mode) {
	clearInterval(timer);
	timer = null;
	clearInterval(foodFlashTimer);
	clearTimeout(answerDelayTimer);
	clearTimeout(bossReactionTimer);
	clearQuestionCountdown();
	isFoodPreview = false;
	isBossDialogue = true;
	hasStarted = false;
	directionChanged = false;
	directionQueue.length = 0;
	foods = [];
	bossDialogueLines = lines;
	bossDialogueIndex = 0;
	bossDialogueMode = mode;
	renderBossDialogue();
	bossDialogueElement.hidden = false;
	bossContinueButton.focus();
	drawBoard();
}

function beginBossPhase() {
	isBossPhase = true;
	bossHealth = bossStartingHealth;
	wormLives = wormStartingLives;
	updateWormLives();
	bossHudElement.hidden = false;
	bossHudElement.classList.remove('boss-hit', 'boss-defeated', 'worm-hit');
	bossReactionElement.textContent = 'ESTOU DE OLHO.';
	gameScreenElement.classList.add('boss-mode');
	boardWrapElement.classList.add('boss-active');
	bossCascadeProgress = 0;
	clearInterval(bossCascadeTimer);
	bossCascadeTimer = setInterval(() => {
		if (!isBossPhase) {
			clearInterval(bossCascadeTimer);
			bossCascadeTimer = null;
			return;
		}

		bossCascadeProgress += 1;
		drawBoard();
		if (bossCascadeProgress >= (cellCount - 1) * 2) {
			clearInterval(bossCascadeTimer);
			bossCascadeTimer = null;
		}
	}, 55);
	updateBossHealth();
	questionElement.textContent = 'CHEFE!';
	showBossDialogue(bossIntroDialogue, 'intro');
}

function clearBossCountdown() {
	clearTimeout(bossCountdownTimer);
	bossCountdownTimer = null;
	bossCountdownElement.hidden = true;
	bossCountdownWordElement.textContent = '';
	bossCountdownWordElement.classList.remove('is-go');
}

function showBossCountdownStep(stepIndex = 0) {
	if (!isBossOpening) return;
	const countdownSteps = ['3', '2', '1', 'GO!'];
	const isGo = countdownSteps[stepIndex] === 'GO!';
	bossCountdownElement.hidden = false;
	bossCountdownWordElement.textContent = countdownSteps[stepIndex];
	bossCountdownWordElement.classList.toggle('is-go', isGo);
	bossCountdownWordElement.style.animation = 'none';
	void bossCountdownWordElement.offsetWidth;
	bossCountdownWordElement.style.animation = '';
	playBossImpact(isGo);
	if (stepIndex < countdownSteps.length - 1) {
		bossCountdownTimer = setTimeout(() => showBossCountdownStep(stepIndex + 1), bossCountdownStep);
	}
}

function startBossFight() {
	clearTimeout(bossStartTimer);
	clearBossCountdown();
	isBossOpening = true;
	stopSound(luteAudio);
	playSound(luteAudio);
	showBossCountdownStep();
	bossStartTimer = setTimeout(() => {
		bossStartTimer = null;
		clearBossCountdown();
		if (!isRunning || !isBossPhase) {
			isBossOpening = false;
			stopSound(luteAudio);
			return;
		}

		isBossOpening = false;
		playSound(bossMusicAudio, true);
		newQuestion();
		showAnswerPreview();
		hasStarted = false;
		directionChanged = false;
	}, bossStartDelay);
}

function finishBossPhase() {
	clearTimeout(bossStartTimer);
	bossStartTimer = null;
	clearBossCountdown();
	isBossOpening = false;
	stopSound(luteAudio);
	stopSound(bossMusicAudio);
	clearInterval(bossCascadeTimer);
	bossCascadeTimer = null;
	bossCascadeProgress = -1;
	isBossPhase = false;
	hasDefeatedBoss = true;
	wormLives = 0;
	bossHudElement.hidden = true;
	bossHudElement.classList.remove('boss-hit', 'boss-defeated', 'worm-hit');
	gameScreenElement.classList.remove('boss-mode');
	boardWrapElement.classList.remove('boss-active', 'boss-hit', 'boss-defeated');
	newQuestion();
	showAnswerPreview();
	hasStarted = false;
	directionChanged = false;
	directionQueue.length = 0;
}

function advanceBossDialogue() {
	if (!isBossDialogue) return;
	if (bossDialogueIndex < bossDialogueLines.length - 1) {
		bossDialogueIndex += 1;
		renderBossDialogue();
		bossContinueButton.focus();
		return;
	}

	const finishedMode = bossDialogueMode;
	stopDialogueTyping();
	bossDialogueElement.hidden = true;
	isBossDialogue = false;
	if (finishedMode === 'intro') startBossFight();
	else finishBossPhase();
}

function startBossVictory() {
	clearTimeout(bossReactionTimer);
	bossReactionTimer = null;
	bossHudElement.classList.remove('boss-hit');
	boardWrapElement.classList.remove('boss-hit');
	bossHudElement.classList.add('boss-defeated');
	boardWrapElement.classList.add('boss-defeated');
	bossReactionElement.textContent = 'DERROTADO!';
	showBossDialogue(bossVictoryDialogue, 'victory');
}

function reactToBossHit() {
	const reaction = bossHealth <= 2 ? 'ISSO DOEU!' : bossHealth <= 5 ? 'AI! ESSA PEGOU.' : 'ACERTOU!';
	bossReactionElement.textContent = reaction;
	bossHudElement.classList.remove('boss-hit');
	boardWrapElement.classList.remove('boss-hit');
	void bossHudElement.offsetWidth;
	bossHudElement.classList.add('boss-hit');
	boardWrapElement.classList.add('boss-hit');
	clearTimeout(bossReactionTimer);
	bossReactionTimer = setTimeout(() => {
		bossHudElement.classList.remove('boss-hit');
		boardWrapElement.classList.remove('boss-hit');
	}, 420);
}

function showAnswerPreview() {
	if (!placeFood()) {
		drawBoard();
		endGame('Você venceu!', 'Você ocupou o tabuleiro inteiro!');
		return false;
	}

	isFoodPreview = true;
	foodPreviewVisible = true;
	drawBoard();
	clearInterval(foodFlashTimer);
	clearTimeout(answerDelayTimer);
	foodFlashTimer = setInterval(() => {
		foodPreviewVisible = !foodPreviewVisible;
		drawBoard();
	}, 150);
	answerDelayTimer = setTimeout(() => {
		if (!isRunning || isBossDialogue) return;
		clearInterval(foodFlashTimer);
		isFoodPreview = false;
		drawBoard();
	}, answerDelay);
	return true;
}

function loseWormLife() {
	clearInterval(timer);
	timer = null;
	clearInterval(foodFlashTimer);
	clearTimeout(answerDelayTimer);
	clearTimeout(wormHitTimer);
	clearQuestionCountdown();
	isFoodPreview = false;
	wormLives = Math.max(0, wormLives - 1);
	updateWormLives();
	bossHudElement.classList.remove('worm-hit');
	void bossHudElement.offsetWidth;
	bossHudElement.classList.add('worm-hit');
	wormHitTimer = setTimeout(() => bossHudElement.classList.remove('worm-hit'), 500);
	if (wormLives === 0) {
		endGame('Fim de fase', 'A minhoquinha ficou sem vidas. Tente novamente!');
		return;
	}

	bossReactionElement.textContent = `MINHOQUINHA PERDEU UMA VIDA. RESTAM ${wormLives}.`;
	const center = Math.floor(cellCount / 2);
	const snakeLength = snake.length;
	snake = Array.from({ length: snakeLength }, (_, index) => ({ x: center - index, y: center }));
	playSound(startGameAudio);
	direction = directions.right;
	nextDirection = direction;
	directionQueue.length = 0;
	hasStarted = false;
	directionChanged = false;
	newQuestion();
	showAnswerPreview();
}

function damageBoss() {
	bossHealth -= 1;
	updateBossHealth();
	if (bossHealth === 0) {
		startBossVictory();
		return;
	}

	reactToBossHit();
	newQuestion();
	showAnswerPreview();
}

function drawBoard() {
	context.fillStyle = isBossPhase ? '#1b080d' : '#050505';
	context.fillRect(0, 0, canvas.width, canvas.height);
	if (isBossPhase && bossCascadeProgress >= 0) {
		for (let y = 0; y < cellCount; y += 1) {
			for (let x = 0; x < cellCount; x += 1) {
				if (x + y <= bossCascadeProgress) {
					context.fillStyle = (x + y) % 2 === 0 ? '#3b101b' : '#541321';
					context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
				}
			}
		}
	}

	context.strokeStyle = isBossPhase ? '#5a1a28' : '#292929';
	context.lineWidth = 1;
	for (let position = 0; position <= canvas.width; position += cellSize) {
		context.beginPath();
		context.moveTo(position, 0);
		context.lineTo(position, canvas.height);
		context.moveTo(0, position);
		context.lineTo(canvas.width, position);
		context.stroke();
	}

	context.textAlign = 'center';
	context.textBaseline = 'middle';
	foods.forEach((food) => {
		if (isFoodPreview) {
			if (foodPreviewVisible) {
				context.fillStyle = '#ffffff';
				context.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4);
			}
			return;
		}

		context.fillStyle = '#c8c8c8';
		context.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4);
		context.fillStyle = '#050505';
		context.font = isBossPhase ? '700 12px Verdana, sans-serif' : '700 15px Verdana, sans-serif';
		context.fillText(String(food.value), food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2);
	});

	snake.forEach((segment, index) => {
		context.fillStyle = index === 0 ? '#ffffff' : '#858585';
		context.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
	});
}

function endGame(title = 'Fim de jogo', detail = `Você fez ${score} ${score === 1 ? 'ponto' : 'pontos'}. Tente de novo!`) {
	if (title !== 'Você venceu!') playSound(loseAudio);
	clearTimeout(bossStartTimer);
	bossStartTimer = null;
	clearBossCountdown();
	isBossOpening = false;
	stopSound(luteAudio);
	stopSound(bossMusicAudio);
	stopDialogueTyping();
	isRunning = false;
	clearInterval(timer);
	clearInterval(foodFlashTimer);
	clearInterval(bossCascadeTimer);
	clearTimeout(answerDelayTimer);
	clearTimeout(bossReactionTimer);
	clearTimeout(wormHitTimer);
	clearQuestionCountdown();
	bossCascadeTimer = null;
	bossCascadeProgress = -1;
	isFoodPreview = false;
	isBossPhase = false;
	isBossDialogue = false;
	wormLives = 0;
	bossHudElement.hidden = true;
	bossDialogueElement.hidden = true;
	bossHudElement.classList.remove('boss-hit', 'boss-defeated', 'worm-hit');
	gameScreenElement.classList.remove('boss-mode');
	boardWrapElement.classList.remove('boss-active', 'boss-hit', 'boss-defeated');
	drawBoard();
	messageTitle.textContent = title;
	messageDetail.textContent = detail;
	messageElement.hidden = false;
}

function moveSnake() {
	if (isBossDialogue || isBossOpening) return;
	direction = directionQueue.shift() || nextDirection;
	nextDirection = direction;
	directionChanged = false;
	const head = {
		x: snake[0].x + direction.x,
		y: snake[0].y + direction.y,
	};
	const foodIndex = isFoodPreview ? -1 : foods.findIndex((item) => head.x === item.x && head.y === item.y);
	const foundFood = foodIndex !== -1;

	if (
		head.x < 0 || head.x >= cellCount || head.y < 0 || head.y >= cellCount ||
		snake.slice(0, foundFood ? undefined : -1).some((segment) => segment.x === head.x && segment.y === head.y)
	) {
		if (isBossPhase) {
			loseWormLife();
			return;
		}

		endGame();
		return;
	}

	if (foundFood && foods[foodIndex].value !== answer) {
		if (isBossPhase) {
			loseWormLife();
			return;
		}

		endGame('Resposta errada', `O resultado correto era ${answer}. Tente novamente!`);
		return;
	}

	snake.unshift(head);
	if (foundFood) {
		playSound(collectAudio);
		if (isBossPhase) {
			damageBoss();
			return;
		}

		score += 1;
		scoreElement.textContent = score;
		if (score > bestScore) {
			bestScore = score;
			bestScoreElement.textContent = bestScore;
			localStorage.setItem('snakeMathBest', bestScore);
		}
		if (score >= bossScoreTarget && !hasDefeatedBoss) {
			beginBossPhase();
			return;
		}
		newQuestion();
		showAnswerPreview();
		return;
	} else {
		snake.pop();
	}

	drawBoard();
}

function setDirection(name) {
	if (isBossDialogue || isBossOpening) return;
	const requestedDirection = directions[name];
	if (!requestedDirection) return;
	if (!hasStarted) {
		const head = snake[0];
		snake = Array.from({ length: snake.length }, (_, index) => ({
			x: head.x - requestedDirection.x * index,
			y: head.y - requestedDirection.y * index,
		}));
		direction = requestedDirection;
		nextDirection = requestedDirection;
		directionQueue.length = 0;
		hasStarted = true;
		drawBoard();
		timer = setInterval(moveSnake, isRelaxedMobile ? relaxedMobileSnakeMoveInterval : regularSnakeMoveInterval);
		return;
	}

	const lastPlannedDirection = directionQueue.at(-1) || direction;
	if (requestedDirection.x === lastPlannedDirection.x && requestedDirection.y === lastPlannedDirection.y) return;
	if (requestedDirection.x + lastPlannedDirection.x === 0 && requestedDirection.y + lastPlannedDirection.y === 0) return;
	if (directionQueue.length >= 2) return;
	directionQueue.push(requestedDirection);
}

function startGame(playStartSound = true) {
	clearTimeout(bossStartTimer);
	bossStartTimer = null;
	clearBossCountdown();
	isBossOpening = false;
	stopSound(luteAudio);
	stopSound(bossMusicAudio);
	stopDialogueTyping();
	if (playStartSound) playSound(startGameAudio);
	clearInterval(timer);
	clearInterval(foodFlashTimer);
	clearInterval(bossCascadeTimer);
	clearTimeout(answerDelayTimer);
	clearTimeout(bossReactionTimer);
	clearTimeout(wormHitTimer);
	clearQuestionCountdown();
	wormLives = 0;
	bossHudElement.classList.remove('worm-hit');
	bossCascadeTimer = null;
	bossCascadeProgress = -1;
	timer = null;
	isFoodPreview = false;
	isBossPhase = false;
	isBossDialogue = false;
	hasDefeatedBoss = false;
	directionQueue.length = 0;
	questionDecks.forEach((deck) => {
		deck.length = 0;
	});
	lastQuestionKey = '';
	bossHealth = 0;
	bossHudElement.hidden = true;
	bossDialogueElement.hidden = true;
	bossHudElement.classList.remove('boss-hit', 'boss-defeated');
	gameScreenElement.classList.remove('boss-mode');
	boardWrapElement.classList.remove('boss-active', 'boss-hit', 'boss-defeated');
	resizeBoardForScreen();
	snake = [
		{ x: 5, y: 6 },
		{ x: 4, y: 6 },
		{ x: 3, y: 6 },
	];
	direction = directions.right;
	nextDirection = direction;
	score = 0;
	hasStarted = false;
	directionChanged = false;
	scoreElement.textContent = score;
	isRunning = true;
	messageElement.hidden = true;
	newQuestion();
	placeFood();
	drawBoard();
}

function openSnakeGame() {
	menuElement.hidden = true;
	gameScreenElement.hidden = true;
	tutorialScreenElement.hidden = false;
	tutorialStartButton.focus();
}

function startGameFromTutorial() {
	tutorialScreenElement.hidden = true;
	gameScreenElement.hidden = false;
	startGame();
	backToGamesButton.focus();
}

function returnToGames() {
	clearTimeout(bossStartTimer);
	bossStartTimer = null;
	clearBossCountdown();
	isBossOpening = false;
	stopSound(luteAudio);
	stopSound(bossMusicAudio);
	stopDialogueTyping();
	clearInterval(timer);
	clearInterval(foodFlashTimer);
	clearInterval(bossCascadeTimer);
	clearTimeout(answerDelayTimer);
	clearTimeout(bossReactionTimer);
	clearTimeout(wormHitTimer);
	clearQuestionCountdown();
	bossCascadeTimer = null;
	bossCascadeProgress = -1;
	timer = null;
	isFoodPreview = false;
	isBossPhase = false;
	isBossDialogue = false;
	wormLives = 0;
	directionQueue.length = 0;
	isRunning = false;
	hasStarted = false;
	bossHudElement.hidden = true;
	bossDialogueElement.hidden = true;
	bossHudElement.classList.remove('boss-hit', 'boss-defeated', 'worm-hit');
	gameScreenElement.classList.remove('boss-mode');
	boardWrapElement.classList.remove('boss-active', 'boss-hit', 'boss-defeated');
	tutorialScreenElement.hidden = true;
	gameScreenElement.hidden = true;
	menuElement.hidden = false;
	playSnakeButton.focus();
}

document.addEventListener('keydown', (event) => {
	if (isBossDialogue && (event.key === 'Enter' || event.key === ' ')) {
		event.preventDefault();
		advanceBossDialogue();
		return;
	}

	const keyDirections = {
		ArrowUp: 'up',
		w: 'up',
		W: 'up',
		ArrowDown: 'down',
		s: 'down',
		S: 'down',
		ArrowLeft: 'left',
		a: 'left',
		A: 'left',
		ArrowRight: 'right',
		d: 'right',
		D: 'right',
	};
	const requestedDirection = keyDirections[event.key];
	if (requestedDirection && isRunning) {
		event.preventDefault();
		setDirection(requestedDirection);
	}
});

document.querySelectorAll('[data-direction]').forEach((button) => {
	button.addEventListener('click', () => setDirection(button.dataset.direction));
});

let swipeStart = null;
canvas.addEventListener('pointerdown', (event) => {
	if (event.pointerType !== 'touch') return;
	swipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
});
canvas.addEventListener('pointerup', (event) => {
	if (!swipeStart || swipeStart.pointerId !== event.pointerId) return;
	const deltaX = event.clientX - swipeStart.x;
	const deltaY = event.clientY - swipeStart.y;
	swipeStart = null;
	if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 24) return;
	if (Math.abs(deltaX) > Math.abs(deltaY)) setDirection(deltaX > 0 ? 'right' : 'left');
	else setDirection(deltaY > 0 ? 'down' : 'up');
});
canvas.addEventListener('pointercancel', () => {
	swipeStart = null;
});

playSnakeButton.addEventListener('click', openSnakeGame);
tutorialBackButton.addEventListener('click', returnToGames);
tutorialStartButton.addEventListener('click', startGameFromTutorial);
backToGamesButton.addEventListener('click', returnToGames);
restartButton.addEventListener('click', () => startGame());
bossContinueButton.addEventListener('click', advanceBossDialogue);
window.addEventListener('resize', () => {
	if (!gameScreenElement.hidden && resizeBoardForScreen()) startGame(false);
});
