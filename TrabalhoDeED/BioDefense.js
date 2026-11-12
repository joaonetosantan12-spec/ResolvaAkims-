(() => {
	const menuElement = document.querySelector('#game-menu');
	const snakeScreenElement = document.querySelector('#game-screen');
	const tutorialScreenElement = document.querySelector('#tutorial-screen');
	const screenElement = document.querySelector('#biodefense-screen');
	const canvas = document.querySelector('#biodefense-canvas');
	const context = canvas.getContext('2d');
	const startButton = document.querySelector('#play-biodefense');
	const beginButton = document.querySelector('#biodefense-start');
	const backButton = document.querySelector('#biodefense-back');
	const restartButton = document.querySelector('#biodefense-restart');
	const startScreenElement = document.querySelector('#biodefense-start-screen');
	const gameOverElement = document.querySelector('#biodefense-game-over');
	const finalScoreElement = document.querySelector('#biodefense-final-score');
	const livesImageElement = document.querySelector('#biodefense-life-image');
	const livesCountElement = document.querySelector('#biodefense-life-count');
	const scoreElement = document.querySelector('#biodefense-score');
	const waveElement = document.querySelector('#biodefense-wave');
	const statusElement = document.querySelector('#biodefense-status');
	const menuErrorElement = document.querySelector('#biodefense-menu-error');
	const bossHudElement = document.querySelector('#biodefense-boss-hud');
	const bossPhaseElement = document.querySelector('#biodefense-boss-phase');
	const bossHealthLabelElement = document.querySelector('#biodefense-boss-health-label');
	const bossHealthFillElement = document.querySelector('#biodefense-boss-health-fill');
	const bossHealthTrackElement = document.querySelector('.biodefense-boss-health-track');
	const bossEntryFlashElement = document.querySelector('#biodefense-boss-entry-flash');
	const bossDialogueElement = document.querySelector('#biodefense-boss-dialogue');
	const bossSpeakerElement = document.querySelector('#biodefense-boss-speaker');
	const bossDialogueLineElement = document.querySelector('#biodefense-boss-dialogue-line');
	const bossContinueButton = document.querySelector('#biodefense-boss-continue');
	const bossCountdownElement = document.querySelector('#biodefense-boss-countdown');
	const bossCountdownNumberElement = document.querySelector('#biodefense-boss-countdown-number');
	const bossPhaseNoticeElement = document.querySelector('#biodefense-boss-phase-notice');
	const bossVictoryElement = document.querySelector('#biodefense-boss-victory');
	const memoryGameElement = document.querySelector('#biodefense-memory-game');
	const memoryPhaseElement = document.querySelector('#biodefense-memory-phase');
	const memoryInstructionElement = document.querySelector('#biodefense-memory-instruction');
	const memoryFeedbackElement = document.querySelector('#biodefense-memory-feedback');
	const memoryPads = Array.from(document.querySelectorAll('.biodefense-memory-pad'));
	const mobileMoveButtons = Array.from(document.querySelectorAll('.biodefense-touch-move'));
	const musicAudio = new Audio('Sounds/Music2.mp3');
	const gameOverAudio = new Audio('Sounds/GameOver.mp3');
	const bossMusicAudio = new Audio('Sounds/BossMsc2.mp3');
	const countdownMusicAudio = new Audio('Sounds/Lute.mp3');
	const dialogueAudio = new Audio('Sounds/Digitando.mp3');
	const laserSounds = Array.from({ length: 4 }, () => new Audio('Sounds/Laser.mp3'));
	const initialLives = 3;
	const playerSpeed = 300;
	const laserSpeed = 1150;
	const waveDuration = 22;
	const maxParticles = 110;
	const bossScoreThreshold = 5000;
	const bossPhaseHealth = 8;
	const bossPhaseCount = 3;
	const bossTotalHealth = bossPhaseHealth * bossPhaseCount;
	const bossAttackIntervals = [0, 2.4, 2.05, 1.75];
	const bossEntryTransitionDuration = 1800;
	const bossRevealDelay = 700;
	const spritePaths = {
		ufo: 'Images/Ufo.png',
		cellMoving: 'Images/GlóbuloVermelho.png',
		cellStill: 'Images/GlóbuloVermelhoParado.png',
		bacteriaMoving: 'Images/Bactéria.png',
		bacteriaStill: 'Images/BactériaParada.png',
		lives3: 'Images/Coracao33.png',
		lives2: 'Images/Coracao23.png',
		lives1: 'Images/Coracao13.png',
		lives0: 'Images/Coracao03.png',
	};
	const spriteBounds = {
		cellMoving: { x: 492, y: 514, width: 278, height: 255 },
		cellStill: { x: 384, y: 396, width: 481, height: 409 },
		bacteriaMoving: { x: 391, y: 453, width: 395, height: 368 },
		bacteriaStill: { x: 335, y: 362, width: 541, height: 439 },
	};

	musicAudio.loop = true;
	musicAudio.volume = 0.3;
	gameOverAudio.volume = 0.55;
	bossMusicAudio.loop = true;
	bossMusicAudio.volume = 0.3;
	countdownMusicAudio.volume = 0.45;
	dialogueAudio.volume = 0.28;

	let spritesPromise;
	let sprites;
	let animationFrame = 0;
	let previousFrameTime = 0;
	let elapsedTime = 0;
	let waveTime = 0;
	let spawnTime = 0;
	let bacteriaSpawnTime = 0;
	let lives = initialLives;
	let score = 0;
	let wave = 1;
	let gameRunning = false;
	let gameOverSoundPlayed = false;
	let bossTriggered = false;
	let bossState = 'idle';
	let bossHealth = bossTotalHealth;
	let bossPhase = 1;
	let boss;
	let bossProjectiles = [];
	let bossAttackTime = 0;
	let bossPhaseTransitionTime = 0;
	let bossDialogueLines = [];
	let bossDialogueIndex = 0;
	let bossDialogueTypingComplete = true;
	let bossDialogueTypingTimer;
	let bossCountdownTimer;
	let bossIntroTimer;
	let bossRevealTimer;
	let bossMemoryTimer;
	let bossMemoryFlashTimer;
	let bossRecoveryTimer;
	let bossPresentationTime = 0;
	let bossMemorySequence = [];
	let bossMemoryInputIndex = 0;
	let worldWidth = 0;
	let worldHeight = 0;
	let pixelRatio = 1;
	let playerX = 0;
	let playerY = 0;
	let invulnerabilityTime = 0;
	let entities = [];
	let lasers = [];
	let particles = [];
	let impacts = [];
	let flowParticles = [];
	let aimPoint = { x: 0, y: 0 };
	let backgroundCanvas;
	let audioContext;
	let audioFallbackReported = false;
	let laserSoundIndex = 0;
	const pressedKeys = new Set();

	function loadSprite(path) {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = () => reject(new Error(`Não foi possível carregar o arquivo ${path}.`));
			image.src = path;
		});
	}

	function loadSprites() {
		if (!spritesPromise) {
			spritesPromise = Promise.all(
				Object.entries(spritePaths).map(async ([name, path]) => [name, await loadSprite(path)])
			).then((loadedSprites) => Object.fromEntries(loadedSprites));
		}
		return spritesPromise;
	}

	function resizeArena() {
		const bounds = canvas.getBoundingClientRect();
		if (!bounds.width || !bounds.height) return;

		worldWidth = bounds.width;
		worldHeight = bounds.height;
		pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
		const pixelWidth = Math.round(worldWidth * pixelRatio);
		const pixelHeight = Math.round(worldHeight * pixelRatio);
		if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
			canvas.width = pixelWidth;
			canvas.height = pixelHeight;
		}
		context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		playerY = worldHeight - Math.max(54, worldHeight * 0.09);
		playerX = Math.max(42, Math.min(worldWidth - 42, playerX || worldWidth / 2));
		createBackground();
	}

	function createBackground() {
		backgroundCanvas = document.createElement('canvas');
		backgroundCanvas.width = Math.max(1, Math.round(worldWidth * pixelRatio));
		backgroundCanvas.height = Math.max(1, Math.round(worldHeight * pixelRatio));
		const background = backgroundCanvas.getContext('2d');
		background.scale(pixelRatio, pixelRatio);

		const base = background.createLinearGradient(0, 0, 0, worldHeight);
		base.addColorStop(0, '#170c19');
		base.addColorStop(0.45, '#351722');
		base.addColorStop(1, '#1b101d');
		background.fillStyle = base;
		background.fillRect(0, 0, worldWidth, worldHeight);

		const centerGlow = background.createRadialGradient(
			worldWidth * 0.5, worldHeight * 0.48, 0,
			worldWidth * 0.5, worldHeight * 0.48, worldWidth * 0.67
		);
		centerGlow.addColorStop(0, '#a8475a26');
		centerGlow.addColorStop(0.64, '#69304416');
		centerGlow.addColorStop(1, '#100b1800');
		background.fillStyle = centerGlow;
		background.fillRect(0, 0, worldWidth, worldHeight);

		const wallWidth = Math.max(50, worldWidth * 0.12);
		for (const side of ['left', 'right']) {
			const isLeft = side === 'left';
			const edgeX = isLeft ? 0 : worldWidth;
			const innerX = isLeft ? wallWidth : worldWidth - wallWidth;
			const wall = background.createLinearGradient(isLeft ? 0 : worldWidth, 0, innerX, 0);
			wall.addColorStop(0, '#c35b6d2c');
			wall.addColorStop(0.58, '#91374b18');
			wall.addColorStop(1, '#73364a00');
			background.fillStyle = wall;
			background.beginPath();
			background.moveTo(edgeX, 0);
			background.bezierCurveTo(
				isLeft ? wallWidth * 0.68 : worldWidth - wallWidth * 0.68, worldHeight * 0.28,
				isLeft ? wallWidth * 0.84 : worldWidth - wallWidth * 0.84, worldHeight * 0.72,
				innerX, worldHeight
			);
			background.lineTo(edgeX, worldHeight);
			background.closePath();
			background.fill();
			background.beginPath();
			background.moveTo(innerX, 0);
			background.bezierCurveTo(
				isLeft ? wallWidth * 0.68 : worldWidth - wallWidth * 0.68, worldHeight * 0.28,
				isLeft ? wallWidth * 0.84 : worldWidth - wallWidth * 0.84, worldHeight * 0.72,
				innerX, worldHeight
			);
			background.strokeStyle = '#ec859028';
			background.lineWidth = 2;
			background.stroke();
		}

		for (let index = 0; index < 12; index += 1) {
			const x = Math.random() * worldWidth;
			const y = Math.random() * worldHeight;
			background.beginPath();
			background.ellipse(x, y, 4 + Math.random() * 12, 1 + Math.random() * 3, Math.random(), 0, Math.PI * 2);
			background.fillStyle = index % 3 === 0 ? '#f49a9a0a' : '#f1d0d006';
			background.fill();
		}

		flowParticles = Array.from({ length: 32 }, () => ({
			x: Math.random() * worldWidth,
			y: Math.random() * worldHeight,
			speed: 8 + Math.random() * 19,
			size: 0.7 + Math.random() * 1.5,
			alpha: 0.12 + Math.random() * 0.24,
			phase: Math.random() * Math.PI * 2,
		}));
	}

	function updateLivesDisplay() {
		const spriteName = `lives${lives}`;
		livesImageElement.src = spritePaths[spriteName];
		livesImageElement.alt = `${lives} ${lives === 1 ? 'vida' : 'vidas'}`;
		livesCountElement.textContent = `${lives} / ${initialLives}`;
	}

	function updateScoreDisplay() {
		scoreElement.textContent = String(score);
	}

	function updateBossHealthDisplay() {
		bossPhase = Math.min(bossPhaseCount, Math.floor((bossTotalHealth - bossHealth) / bossPhaseHealth) + 1);
		bossPhaseElement.textContent = `FASE ${bossPhase} / ${bossPhaseCount}`;
		bossHealthLabelElement.textContent = `${bossHealth} / ${bossTotalHealth}`;
		bossHealthFillElement.style.width = `${(bossHealth / bossTotalHealth) * 100}%`;
		bossHealthTrackElement.setAttribute('aria-valuenow', String(bossHealth));
	}

	function beginBossEncounter() {
		if (!gameRunning || bossTriggered || bossState !== 'idle') return;
		bossTriggered = true;
		pressedKeys.clear();
		lasers = [];
		bossState = 'boss-intro';
		bossHealth = bossTotalHealth;
		bossPhase = 1;
		bossAttackTime = 0;
		bossPresentationTime = 0;
		bossProjectiles = [];
		bossEntryFlashElement.hidden = false;
		screenElement.querySelector('.biodefense-arena').classList.add('boss-entry-transition');
		statusElement.textContent = 'Alerta crítica: uma ameaça está se aproximando...';
		musicAudio.pause();
		musicAudio.currentTime = 0;
		bossRevealTimer = setTimeout(revealBossDuringTransition, bossRevealDelay);
		bossIntroTimer = setTimeout(finishBossEntryTransition, bossEntryTransitionDuration);
	}

	function revealBossDuringTransition() {
		if (!gameRunning || bossState !== 'boss-intro') return;
		boss = { x: worldWidth / 2, y: -110, radius: 78 };
		document.body.classList.add('biodefense-boss-theme');
		screenElement.classList.add('boss-mode');
		bossHudElement.hidden = false;
		bossHudElement.classList.remove('is-hit');
		bossHudElement.classList.add('is-entering');
		updateBossHealthDisplay();
		playAudio(bossMusicAudio, 'BossMsc2.mp3');
	}

	function finishBossEntryTransition() {
		bossIntroTimer = null;
		bossRevealTimer = null;
		if (!gameRunning || bossState !== 'boss-intro') return;
		bossEntryFlashElement.hidden = true;
		screenElement.querySelector('.biodefense-arena').classList.remove('boss-entry-transition');
		bossState = 'dialogue';
		showBossDialogue([
			{ speaker: 'NÚCLEO ALFA', text: 'Cheguei ao centro do vaso. Esta corrente sanguínea será minha!' },
			{ speaker: 'BIODEFESA', text: 'Ameaça crítica detectada. Mire no Núcleo Alfa e desvie dos ataques.' },
			{ speaker: 'NÚCLEO ALFA', text: 'Então tente me deter. Cada fase será mais intensa, e meu escudo vai testar sua memória!' },
		]);
	}

	function stopBossDialogueTyping() {
		clearInterval(bossDialogueTypingTimer);
		bossDialogueTypingTimer = null;
		dialogueAudio.pause();
		dialogueAudio.currentTime = 0;
	}

	function showBossDialogueLine() {
		stopBossDialogueTyping();
		const line = bossDialogueLines[bossDialogueIndex];
		bossSpeakerElement.textContent = line.speaker;
		bossDialogueLineElement.textContent = '';
		bossDialogueTypingComplete = line.text.length === 0;
		bossContinueButton.textContent = bossDialogueIndex === bossDialogueLines.length - 1
			? (bossState === 'victory-dialogue' ? 'Voltar à defesa' : 'Iniciar contagem')
			: 'Continuar';
		const characters = Array.from(line.text);
		let visibleCharacters = 0;
		dialogueAudio.loop = true;
		const playback = dialogueAudio.play();
		if (playback) {
			playback.catch((error) => {
				console.error('Unable to play Digitando.mp3.', error);
			});
		}
		bossDialogueTypingTimer = setInterval(() => {
			visibleCharacters += 1;
			bossDialogueLineElement.textContent = characters.slice(0, visibleCharacters).join('');
			if (visibleCharacters >= characters.length) {
				bossDialogueTypingComplete = true;
				stopBossDialogueTyping();
			}
		}, 34);
	}

	function showBossDialogue(lines) {
		bossDialogueLines = lines;
		bossDialogueIndex = 0;
		bossDialogueElement.hidden = false;
		showBossDialogueLine();
		bossContinueButton.focus();
	}

	function showBossCountdownStep(stepIndex) {
		const steps = ['3', '2', '1', 'GO!'];
		if (stepIndex >= steps.length) {
			bossCountdownElement.hidden = true;
			bossCountdownElement.classList.remove('is-visible');
			bossCountdownTimer = null;
			countdownMusicAudio.pause();
			countdownMusicAudio.currentTime = 0;
			playAudio(bossMusicAudio, 'BossMsc2.mp3');
			bossState = 'fight';
			bossAttackTime = bossAttackIntervals[bossPhase];
			statusElement.textContent = 'Batalha iniciada! Mire na Bactéria Alfa e desvie dos projéteis.';
			return;
		}
		const word = steps[stepIndex];
		bossCountdownNumberElement.textContent = word;
		bossCountdownNumberElement.classList.toggle('is-go', word === 'GO!');
		bossCountdownElement.hidden = false;
		bossCountdownElement.classList.remove('is-visible');
		void bossCountdownElement.offsetWidth;
		bossCountdownElement.classList.add('is-visible');
		bossCountdownNumberElement.style.animation = 'none';
		void bossCountdownNumberElement.offsetWidth;
		bossCountdownNumberElement.style.animation = '';
		bossCountdownTimer = setTimeout(
			() => showBossCountdownStep(stepIndex + 1),
			word === 'GO!' ? 950 : 1000
		);
	}

	function startBossCountdown() {
		bossState = 'countdown';
		bossDialogueElement.hidden = true;
		bossCountdownElement.hidden = false;
		bossMusicAudio.pause();
		bossMusicAudio.currentTime = 0;
		countdownMusicAudio.currentTime = 0;
		const playback = countdownMusicAudio.play();
		if (playback) {
			playback.catch((error) => {
				console.error('Unable to play Lute.mp3 for the boss countdown.', error);
			});
		}
		showBossCountdownStep(0);
	}

	function startMemoryChallenge() {
		clearTimeout(bossMemoryTimer);
		bossMemoryTimer = null;
		clearTimeout(bossMemoryFlashTimer);
		bossMemoryFlashTimer = null;
		bossState = 'memory-show';
		bossProjectiles = [];
		bossMemorySequence = Array.from(
			{ length: bossPhase + 2 },
			() => Math.floor(Math.random() * memoryPads.length)
		);
		bossMemoryInputIndex = 0;
		memoryPhaseElement.textContent = String(bossPhase);
		memoryInstructionElement.textContent = 'Observe as luzes e repita a sequência para desativar o escudo.';
		memoryFeedbackElement.textContent = 'A sequência começa em 2 segundos...';
		memoryGameElement.hidden = false;
		memoryPads.forEach((pad) => {
			pad.disabled = true;
			pad.classList.remove('is-lit', 'is-pressed');
		});
		bossMemoryTimer = setTimeout(() => playMemoryStep(0), 2000);
	}

	function playMemoryStep(stepIndex) {
		if (bossState !== 'memory-show') return;
		if (stepIndex >= bossMemorySequence.length) {
			bossMemoryTimer = setTimeout(() => {
				if (bossState !== 'memory-show') return;
				bossState = 'memory-input';
				memoryInstructionElement.textContent = 'Agora repita a sequência na mesma ordem.';
				memoryFeedbackElement.textContent = `Sua vez: ${bossMemorySequence.length} luzes.`;
				memoryPads.forEach((pad) => { pad.disabled = false; });
				memoryPads[0].focus();
			}, 260);
			return;
		}

		const pad = memoryPads[bossMemorySequence[stepIndex]];
		pad.classList.add('is-lit');
		bossMemoryTimer = setTimeout(() => {
			pad.classList.remove('is-lit');
			bossMemoryTimer = setTimeout(
				() => playMemoryStep(stepIndex + 1),
				190
			);
		}, 480);
	}

	function handleMemoryPadInput(padIndex) {
		if (bossState !== 'memory-input' || !Number.isInteger(padIndex) ||
			padIndex < 0 || padIndex >= memoryPads.length) return;
		const pad = memoryPads[padIndex];
		pad.classList.add('is-pressed');
		clearTimeout(bossMemoryFlashTimer);
		bossMemoryFlashTimer = setTimeout(() => pad.classList.remove('is-pressed'), 180);

		if (bossMemorySequence[bossMemoryInputIndex] !== padIndex) {
			bossState = 'memory-show';
			bossMemoryInputIndex = 0;
			memoryInstructionElement.textContent = 'Sequência incorreta. Observe novamente e tente outra vez.';
			memoryFeedbackElement.textContent = 'Tente de novo — sem perder vidas.';
			memoryPads.forEach((item) => { item.disabled = true; });
			bossMemoryTimer = setTimeout(() => playMemoryStep(0), 650);
			return;
		}

		bossMemoryInputIndex += 1;
		memoryFeedbackElement.textContent = `${bossMemoryInputIndex} / ${bossMemorySequence.length}`;
		if (bossMemoryInputIndex < bossMemorySequence.length) return;

		clearTimeout(bossMemoryTimer);
		bossMemoryTimer = null;
		resolveMemoryChallenge();
	}

	function resolveMemoryChallenge() {
		memoryGameElement.hidden = true;
		bossState = 'recovery';
		damageBoss();
		score += 200;
		updateScoreDisplay();
		if (bossState === 'recovery') {
			statusElement.textContent = 'Sequência memorizada! +200 pontos. A Bactéria Alfa retomará em 2 segundos.';
			bossRecoveryTimer = setTimeout(() => {
				bossRecoveryTimer = null;
				if (!gameRunning || bossState !== 'recovery') return;
				bossState = 'fight';
				bossAttackTime = bossAttackIntervals[bossPhase];
			}, 2000);
		}
		canvas.focus();
	}

	function drawBossEncounter() {
		if (!boss) return;
		const entranceProgress = Math.min(1, bossPresentationTime / 0.9);
		const size = 194 * (0.72 + entranceProgress * 0.28);
		context.save();
		context.globalAlpha = Math.min(1, entranceProgress * 1.6);
		context.beginPath();
		context.arc(boss.x, boss.y, 74 + Math.sin(elapsedTime * 4) * 5, 0, Math.PI * 2);
		context.strokeStyle = '#54eaff';
		context.lineWidth = 3;
		context.shadowColor = '#19cfff';
		context.shadowBlur = 28;
		context.stroke();
		context.beginPath();
		context.arc(boss.x, boss.y, 92 + Math.sin(elapsedTime * 2) * 5, 0, Math.PI * 2);
		context.strokeStyle = '#6e9dff88';
		context.lineWidth = 2;
		context.stroke();
		context.shadowColor = '#40dfff';
		context.shadowBlur = 24;
		drawSprite(sprites.bacteriaMoving, boss.x, boss.y, size, size, spriteBounds.bacteriaMoving);
		context.restore();

		for (const projectile of bossProjectiles) {
			const gradient = context.createRadialGradient(
				projectile.x - projectile.radius * 0.3,
				projectile.y - projectile.radius * 0.3,
				1,
				projectile.x,
				projectile.y,
				projectile.radius * 1.6
			);
			gradient.addColorStop(0, '#f4ffff');
			gradient.addColorStop(0.35, '#6df4ff');
			gradient.addColorStop(1, '#1684ff');
			context.save();
			context.fillStyle = gradient;
			context.shadowColor = '#27cfff';
			context.shadowBlur = 16;
			context.beginPath();
			context.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
			context.fill();
			context.restore();
		}
	}

	function updateBossEncounter(deltaTime) {
		if (!boss) return;
		bossPresentationTime += deltaTime;
		const entranceProgress = Math.min(1, bossPresentationTime / 0.9);
		const easedProgress = 1 - (1 - entranceProgress) ** 3;
		const targetY = worldHeight * 0.27;
		boss.y = -110 + (targetY + 110) * easedProgress;
		if (bossState === 'phase-transition') {
			bossPhaseTransitionTime -= deltaTime;
			if (bossPhaseTransitionTime <= 0) {
				bossPhaseNoticeElement.hidden = true;
				startMemoryChallenge();
			}
			return;
		}
		if (bossState !== 'fight') return;

		boss.x = worldWidth / 2 + Math.sin(elapsedTime * (0.65 + bossPhase * 0.18)) * worldWidth * 0.27;
		boss.y = targetY + Math.sin(elapsedTime * 1.15) * 12;
		bossAttackTime += deltaTime;
		const attackInterval = bossAttackIntervals[bossPhase];
		if (bossAttackTime >= attackInterval) {
			bossAttackTime = 0;
			fireBossVolley();
		}

		for (let index = bossProjectiles.length - 1; index >= 0; index -= 1) {
			const projectile = bossProjectiles[index];
			projectile.x += projectile.vx * deltaTime;
			projectile.y += projectile.vy * deltaTime;
			if (projectile.y - projectile.radius > worldHeight ||
				projectile.x < -projectile.radius || projectile.x > worldWidth + projectile.radius) {
				bossProjectiles.splice(index, 1);
				continue;
			}
			const hitRadius = projectile.radius + 31;
			if (invulnerabilityTime <= 0 &&
				distanceSquared(projectile.x, projectile.y, playerX, playerY) < hitRadius * hitRadius) {
				bossProjectiles.splice(index, 1);
				loseLife('Um projétil da Bactéria Alfa atingiu o UFO. Desvie e continue atirando!', true);
				if (!gameRunning) return;
			}
		}
	}

	function fireBossVolley() {
		const dx = playerX - boss.x;
		const dy = playerY - (boss.y + 48);
		const baseAngle = Math.atan2(dy, dx);
		const offsets = bossPhase === 1 ? [0] : bossPhase === 2 ? [-0.12, 0.12] : [-0.22, 0, 0.22];
		const speed = 150 + bossPhase * 35;
		for (const offset of offsets) {
			const angle = baseAngle + offset;
			bossProjectiles.push({
				x: boss.x,
				y: boss.y + 48,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				radius: bossPhase === 3 ? 9 : 8,
			});
		}
	}

	function damageBoss() {
		bossHealth = Math.max(0, bossHealth - 1);
		const previousPhase = bossPhase;
		updateBossHealthDisplay();
		bossHudElement.classList.remove('is-hit');
		void bossHudElement.offsetWidth;
		bossHudElement.classList.add('is-hit');
		if (bossHealth === 0) {
			bossState = 'victory-dialogue';
			bossProjectiles = [];
			bossMusicAudio.pause();
			bossMusicAudio.currentTime = 0;
			bossVictoryElement.hidden = false;
			statusElement.textContent = 'Bactéria Alfa neutralizada! O organismo está protegido.';
			showBossDialogue([
				{ speaker: 'CENTRAL BIODEFESA', text: 'Núcleo Alfa neutralizado! As células estão protegidas e a ameaça foi contida.' },
				{ speaker: 'CENTRAL BIODEFESA', text: 'Excelente trabalho, equipe. A defesa do organismo continua.' },
			]);
			return;
		}
		if (bossPhase !== previousPhase) {
			bossState = 'phase-transition';
			bossPhaseTransitionTime = 0.9;
			bossProjectiles = [];
			bossPhaseNoticeElement.textContent = `FASE ${bossPhase} — ATAQUE INTENSIFICADO`;
			bossPhaseNoticeElement.hidden = false;
			return;
		}
	}

	function advanceBossDialogue() {
		if (bossState !== 'dialogue' && bossState !== 'victory-dialogue') return;
		if (!bossDialogueTypingComplete) {
			bossDialogueLineElement.textContent = bossDialogueLines[bossDialogueIndex].text;
			bossDialogueTypingComplete = true;
			stopBossDialogueTyping();
			return;
		}
		if (bossDialogueIndex < bossDialogueLines.length - 1) {
			bossDialogueIndex += 1;
			showBossDialogueLine();
			return;
		}
		stopBossDialogueTyping();
		if (bossState === 'victory-dialogue') {
			finishBossEncounter();
			return;
		}
		bossDialogueElement.hidden = true;
		startBossCountdown();
	}

	function finishBossEncounter() {
		stopBossPresentation();
		entities = [];
		startMusic();
		statusElement.textContent = 'A Bactéria Alfa foi derrotada. A defesa do organismo continua.';
	}

	function playAudio(audio, description) {
		const playback = audio.play();
		if (!playback) return;
		playback.catch((error) => {
			statusElement.textContent = `O áudio ${description} não pôde ser reproduzido neste navegador.`;
			console.error(`Unable to play ${description}.`, error);
		});
	}

	function startMusic() {
		if (!musicAudio.paused) return;
		playAudio(musicAudio, 'Music2.mp3');
	}

	function stopBossPresentation() {
		clearInterval(bossDialogueTypingTimer);
		bossDialogueTypingTimer = null;
		clearTimeout(bossIntroTimer);
		bossIntroTimer = null;
		clearTimeout(bossRevealTimer);
		bossRevealTimer = null;
		clearTimeout(bossCountdownTimer);
		bossCountdownTimer = null;
		clearTimeout(bossMemoryTimer);
		bossMemoryTimer = null;
		clearTimeout(bossMemoryFlashTimer);
		bossMemoryFlashTimer = null;
		clearTimeout(bossRecoveryTimer);
		bossRecoveryTimer = null;
		dialogueAudio.pause();
		dialogueAudio.currentTime = 0;
		bossMusicAudio.pause();
		bossMusicAudio.currentTime = 0;
		countdownMusicAudio.pause();
		countdownMusicAudio.currentTime = 0;
		bossDialogueElement.hidden = true;
		bossEntryFlashElement.hidden = true;
		screenElement.querySelector('.biodefense-arena').classList.remove('boss-entry-transition');
		bossSpeakerElement.textContent = '';
		bossDialogueLineElement.textContent = '';
		bossCountdownElement.hidden = true;
		bossCountdownElement.classList.remove('is-visible');
		bossCountdownNumberElement.textContent = '';
		bossCountdownNumberElement.classList.remove('is-go');
		bossPhaseNoticeElement.hidden = true;
		bossVictoryElement.hidden = true;
		memoryGameElement.hidden = true;
		memoryPads.forEach((pad) => {
			pad.disabled = false;
			pad.classList.remove('is-lit', 'is-pressed');
		});
		bossHudElement.hidden = true;
		bossHudElement.classList.remove('is-entering', 'is-hit');
		document.body.classList.remove('biodefense-boss-theme');
		screenElement.classList.remove('boss-mode');
		bossDialogueLines = [];
		bossDialogueIndex = 0;
		bossDialogueTypingComplete = true;
		bossMemorySequence = [];
		bossMemoryInputIndex = 0;
		bossAttackTime = 0;
		bossPhaseTransitionTime = 0;
		bossPresentationTime = 0;
		bossState = 'idle';
		boss = null;
		bossProjectiles = [];
	}

	function resetGame() {
		stopBossPresentation();
		gameOverAudio.pause();
		gameOverAudio.currentTime = 0;
		lives = initialLives;
		score = 0;
		bossTriggered = false;
		bossHealth = bossTotalHealth;
		bossPhase = 1;
		bossAttackTime = 0;
		bossPhaseTransitionTime = 0;
		bossDialogueIndex = 0;
		bossDialogueTypingComplete = true;
		bossPresentationTime = 0;
		wave = 1;
		elapsedTime = 0;
		waveTime = 0;
		spawnTime = 0;
		bacteriaSpawnTime = 0;
		invulnerabilityTime = 0;
		entities = [];
		lasers = [];
		particles = [];
		impacts = [];
		pressedKeys.clear();
		previousFrameTime = 0;
		gameOverSoundPlayed = false;
		playerX = worldWidth / 2;
		aimPoint = { x: playerX, y: 0 };
		updateScoreDisplay();
		updateWaveDisplay();
		updateLivesDisplay();
		statusElement.textContent = 'Elimine as bactérias; preserve os glóbulos vermelhos.';
		startScreenElement.hidden = true;
		gameOverElement.hidden = true;

		const initialKinds = ['bacteria', 'cell', 'cell'];
		initialKinds.forEach((kind, index) => {
			const x = worldWidth * ((index + 0.5) / initialKinds.length);
			const y = 76 + index * 75;
			spawnEntity(kind, y, x);
		});

		gameRunning = true;
		resizeArena();
		startMusic();
		drawFrame();
		animationFrame = requestAnimationFrame(runFrame);
		canvas.focus();
	}

	async function openGame() {
		startButton.disabled = true;
		menuErrorElement.hidden = true;
		try {
			sprites = await loadSprites();
		} catch (error) {
			spritesPromise = null;
			startButton.disabled = false;
			menuErrorElement.textContent = 'Não foi possível carregar os sprites. Confira os arquivos da pasta Images.';
			menuErrorElement.hidden = false;
			console.error(error);
			return;
		}

		menuElement.hidden = true;
		snakeScreenElement.hidden = true;
		tutorialScreenElement.hidden = true;
		screenElement.hidden = false;
		startButton.disabled = false;
		resizeArena();
		startScreenElement.hidden = false;
		gameOverElement.hidden = true;
		drawFrame();
		beginButton.focus();
	}

	function returnToMenu() {
		stopGame();
		stopBossPresentation();
		musicAudio.pause();
		musicAudio.currentTime = 0;
		screenElement.hidden = true;
		menuElement.hidden = false;
		startButton.focus();
	}

	function stopGame() {
		gameRunning = false;
		cancelAnimationFrame(animationFrame);
		pressedKeys.clear();
	}

	function entityLimit() {
		if (wave < 4) return 4;
		if (wave < 8) return 6;
		return 8;
	}

	function nextSpawnInterval() {
		return Math.max(1.45, 2.45 - (wave - 1) * 0.13);
	}

	function nextBacteriaSpawnInterval() {
		return Math.max(2.2, 3.6 - (wave - 1) * 0.12);
	}

	function spawnEntity(kind, y = -48, preferredX = null) {
		if (entities.length >= entityLimit()) return false;
		const radius = Math.min(30, Math.max(20, worldWidth * 0.065));
		let x = preferredX ?? radius + Math.random() * Math.max(1, worldWidth - radius * 2);
		if (preferredX === null) {
			let bestX = x;
			let bestDistance = -1;
			for (let attempt = 0; attempt < 14; attempt += 1) {
				const candidate = radius + Math.random() * Math.max(1, worldWidth - radius * 2);
				const nearest = entities.reduce((distance, entity) => {
					if (Math.abs(entity.y - y) > 125) return distance;
					return Math.min(distance, Math.abs(entity.x - candidate));
				}, Infinity);
				if (nearest > bestDistance) {
					bestDistance = nearest;
					bestX = candidate;
				}
				if (nearest > 90) break;
			}
			x = bestX;
		}

		const pace = Math.min((wave - 1) * 10, 70);
		entities.push({
			kind,
			x,
			y,
			vx: (Math.random() - 0.5) * 24,
			vy: (kind === 'bacteria' ? 54 + Math.random() * 14 : 42 + Math.random() * 13) + pace,
			phase: Math.random() * Math.PI * 2,
			radius,
			infectionTime: 0,
		});
		return true;
	}

	function finishGame() {
		if (gameOverSoundPlayed) return;
		gameOverSoundPlayed = true;
		gameRunning = false;
		cancelAnimationFrame(animationFrame);
		pressedKeys.clear();
		stopBossPresentation();
		musicAudio.pause();
		musicAudio.currentTime = 0;
		finalScoreElement.textContent = `Pontuação final: ${score}`;
		gameOverElement.hidden = false;
		restartButton.focus();
		playAudio(gameOverAudio, 'GameOver.mp3');
	}

	function loseLife(message, playerHit = false) {
		if (!gameRunning || (playerHit && invulnerabilityTime > 0)) return;
		lives = Math.max(0, lives - 1);
		if (playerHit) invulnerabilityTime = 0.8;
		updateLivesDisplay();
		statusElement.textContent = message;
		if (lives === 0) finishGame();
	}

	function updateWaveDisplay() {
		waveElement.textContent = String(wave).padStart(2, '0');
	}

	function distanceSquared(x1, y1, x2, y2) {
		const dx = x2 - x1;
		const dy = y2 - y1;
		return dx * dx + dy * dy;
	}

	function segmentDistanceSquared(startX, startY, endX, endY, pointX, pointY) {
		const dx = endX - startX;
		const dy = endY - startY;
		const lengthSquared = dx * dx + dy * dy;
		if (lengthSquared === 0) return distanceSquared(startX, startY, pointX, pointY);
		const projection = Math.max(0, Math.min(1, ((pointX - startX) * dx + (pointY - startY) * dy) / lengthSquared));
		return distanceSquared(startX + projection * dx, startY + projection * dy, pointX, pointY);
	}

	function addImpact(x, y, kind, points) {
		const colors = kind === 'bacteria'
			? ['#ff8294', '#ff405e', '#f8d5dc']
			: ['#ffb0ac', '#d96378', '#ffe1dc'];
		impacts.push({ x, y, kind, points, age: 0, duration: 0.55, colors });
		const particleCount = kind === 'bacteria' ? 12 : 8;
		for (let index = 0; index < particleCount; index += 1) {
			if (particles.length >= maxParticles) particles.shift();
			const angle = Math.random() * Math.PI * 2;
			const speed = 26 + Math.random() * 90;
			particles.push({
				x,
				y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				age: 0,
				duration: 0.28 + Math.random() * 0.3,
				size: 1.5 + Math.random() * 2.5,
				color: colors[index % colors.length],
			});
		}
	}

	function updateEntities(deltaTime) {
		for (const entity of entities) {
			entity.x += (entity.vx + Math.sin(elapsedTime * 0.9 + entity.phase) * 9) * deltaTime;
			entity.y += entity.vy * deltaTime;
			entity.infectionTime = Math.max(0, entity.infectionTime - deltaTime);
			if (entity.x < entity.radius || entity.x > worldWidth - entity.radius) {
				entity.vx *= -0.75;
				entity.x = Math.max(entity.radius, Math.min(worldWidth - entity.radius, entity.x));
			}
		}

		for (let index = 0; index < entities.length; index += 1) {
			const bacteria = entities[index];
			if (bacteria.kind !== 'bacteria') continue;
			for (let cellIndex = 0; cellIndex < entities.length; cellIndex += 1) {
				const cell = entities[cellIndex];
				if (cell.kind !== 'cell') continue;
				const contactRadius = bacteria.radius + cell.radius;
				if (distanceSquared(bacteria.x, bacteria.y, cell.x, cell.y) >= contactRadius * contactRadius) continue;

				cell.kind = 'bacteria';
				cell.vy = Math.max(cell.vy * 1.12, bacteria.vy);
				cell.vx += (cell.x - bacteria.x) * 0.24;
				cell.phase = Math.random() * Math.PI * 2;
				cell.infectionTime = 0.3;
				addImpact(cell.x, cell.y, 'infection', 0);
				statusElement.textContent = 'Infecção detectada: um glóbulo se transformou em bactéria.';
			}
		}

		for (let index = entities.length - 1; index >= 0; index -= 1) {
			const entity = entities[index];
			const collisionRadius = entity.radius + 32;
			if (entity.kind === 'bacteria' && invulnerabilityTime <= 0 &&
				distanceSquared(entity.x, entity.y, playerX, playerY) < collisionRadius * collisionRadius) {
				entities.splice(index, 1);
				loseLife('Uma bactéria atingiu o UFO. Cuidado com os invasores!', true);
				continue;
			}
			if (entity.y - entity.radius > worldHeight) {
				entities.splice(index, 1);
				if (entity.kind === 'bacteria') loseLife('Uma bactéria escapou. Proteja o organismo!');
			}
		}
	}

	function resolveLaserHit(laser, entityIndex) {
		const [entity] = entities.splice(entityIndex, 1);
		if (!entity) return;
		if (entity.kind === 'bacteria') {
			score += 100;
			addImpact(entity.x, entity.y, 'bacteria', 100);
			statusElement.textContent = 'Bactéria eliminada: +100 pontos.';
			if (score >= bossScoreThreshold && !bossTriggered) beginBossEncounter();
		} else {
			score = Math.max(0, score - 50);
			addImpact(entity.x, entity.y, 'cell', -50);
			statusElement.textContent = 'Glóbulo saudável destruído: −50 pontos. Preserve as células!';
		}
		updateScoreDisplay();
		laser.hit = true;
	}

	function updateLasers(deltaTime) {
		for (let laserIndex = lasers.length - 1; laserIndex >= 0; laserIndex -= 1) {
			const laser = lasers[laserIndex];
			const previousX = laser.x;
			const previousY = laser.y;
			laser.distanceTravelled = Math.min(laser.distance, laser.distanceTravelled + laserSpeed * deltaTime);
			laser.x = laser.startX + laser.directionX * laser.distanceTravelled;
			laser.y = laser.startY + laser.directionY * laser.distanceTravelled;
			laser.age += deltaTime;

			if (!laser.hit) {
				if (bossState === 'fight' && boss &&
					segmentDistanceSquared(previousX, previousY, laser.x, laser.y, boss.x, boss.y) <= (boss.radius + 9) ** 2) {
					damageBoss();
					laser.hit = true;
				}
			}

			if (!laser.hit && (bossState === 'idle' || bossState === 'fight')) {
				for (let entityIndex = entities.length - 1; entityIndex >= 0; entityIndex -= 1) {
					const entity = entities[entityIndex];
					const hitRadius = entity.radius + 7;
					if (segmentDistanceSquared(previousX, previousY, laser.x, laser.y, entity.x, entity.y) > hitRadius * hitRadius) continue;
					resolveLaserHit(laser, entityIndex);
					break;
				}
			}
			if (bossState !== 'idle' && bossState !== 'fight') return;

			if (laser.hit || laser.distanceTravelled >= laser.distance || laser.age > 1.2) {
				lasers.splice(laserIndex, 1);
			}
		}
	}

	function updateEffects(deltaTime) {
		for (let index = particles.length - 1; index >= 0; index -= 1) {
			const particle = particles[index];
			particle.age += deltaTime;
			particle.x += particle.vx * deltaTime;
			particle.y += particle.vy * deltaTime;
			particle.vx *= 0.98;
			particle.vy *= 0.98;
			if (particle.age >= particle.duration) particles.splice(index, 1);
		}
		for (let index = impacts.length - 1; index >= 0; index -= 1) {
			impacts[index].age += deltaTime;
			if (impacts[index].age >= impacts[index].duration) impacts.splice(index, 1);
		}
		for (const particle of flowParticles) {
			particle.y += particle.speed * deltaTime;
			if (particle.y > worldHeight + 4) {
				particle.y = -4;
				particle.x = Math.random() * worldWidth;
			}
		}
	}

	function updateWave(deltaTime) {
		waveTime += deltaTime;
		const nextWave = Math.floor(waveTime / waveDuration) + 1;
		if (nextWave !== wave) {
			wave = nextWave;
			updateWaveDisplay();
			statusElement.textContent = `Onda ${String(wave).padStart(2, '0')}: os invasores estão mais rápidos.`;
		}
	}

	function drawSprite(image, x, y, width, height, bounds = null) {
		if (bounds) {
			const scale = Math.min(width / bounds.width, height / bounds.height);
			const drawWidth = bounds.width * scale;
			const drawHeight = bounds.height * scale;
			context.drawImage(
				image,
				bounds.x, bounds.y, bounds.width, bounds.height,
				x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight
			);
			return;
		}
		context.drawImage(image, x - width / 2, y - height / 2, width, height);
	}

	function drawBackground() {
		if (backgroundCanvas) context.drawImage(backgroundCanvas, 0, 0, worldWidth, worldHeight);
		for (const particle of flowParticles) {
			context.beginPath();
			context.ellipse(particle.x, particle.y, particle.size, particle.size * 0.52, 0, 0, Math.PI * 2);
			context.fillStyle = `rgba(255, 197, 200, ${particle.alpha})`;
			context.fill();
		}
		context.beginPath();
		context.moveTo(worldWidth * 0.13, worldHeight * 0.25 + Math.sin(elapsedTime * 0.3) * 8);
		context.bezierCurveTo(
			worldWidth * 0.35, worldHeight * 0.19,
			worldWidth * 0.66, worldHeight * 0.31,
			worldWidth * 0.88, worldHeight * 0.23 + Math.cos(elapsedTime * 0.25) * 7
		);
		context.strokeStyle = '#ec82920b';
		context.lineWidth = 24;
		context.stroke();
	}

	function drawEntities() {
		const bacteriaSize = Math.min(78, Math.max(44, worldWidth * 0.14));
		const cellSize = Math.min(72, Math.max(42, worldWidth * 0.13));
		for (const entity of entities) {
			const movingFrame = Math.floor((elapsedTime + entity.phase) / 0.32) % 2 === 0;
			const spriteName = entity.kind === 'bacteria'
				? (movingFrame ? 'bacteriaMoving' : 'bacteriaStill')
				: (movingFrame ? 'cellMoving' : 'cellStill');
			const size = entity.kind === 'bacteria' ? bacteriaSize : cellSize;
			drawSprite(sprites[spriteName], entity.x, entity.y, size, size, spriteBounds[spriteName]);

			if (entity.infectionTime > 0) {
				const progress = 1 - entity.infectionTime / 0.3;
				context.beginPath();
				context.arc(entity.x, entity.y, entity.radius * (0.76 + progress * 0.8), 0, Math.PI * 2);
				context.strokeStyle = `rgba(120, 232, 247, ${1 - progress})`;
				context.lineWidth = 2;
				context.stroke();
			}
		}
	}

	function drawLasers() {
		for (const laser of lasers) {
			const fade = Math.max(0, 1 - laser.age / 0.26);
			const tailDistance = Math.max(0, laser.distanceTravelled - 60);
			context.save();
			context.globalAlpha = fade;
			context.beginPath();
			context.moveTo(laser.startX + laser.directionX * tailDistance, laser.startY + laser.directionY * tailDistance);
			context.lineTo(laser.x, laser.y);
			context.strokeStyle = '#4fe7f4';
			context.lineWidth = 8;
			context.shadowColor = '#59f0ff';
			context.shadowBlur = 12;
			context.stroke();
			context.shadowBlur = 0;
			context.beginPath();
			context.arc(laser.x, laser.y, 4.5, 0, Math.PI * 2);
			context.fillStyle = '#ffffff';
			context.fill();
			context.restore();
		}
	}

	function drawEffects() {
		for (const particle of particles) {
			const opacity = 1 - particle.age / particle.duration;
			context.globalAlpha = opacity;
			context.fillStyle = particle.color;
			context.fillRect(particle.x, particle.y, particle.size, particle.size);
		}
		context.globalAlpha = 1;

		for (const impact of impacts) {
			const progress = impact.age / impact.duration;
			const radius = 8 + progress * (impact.kind === 'infection' ? 30 : 22);
			context.beginPath();
			context.arc(impact.x, impact.y, radius, 0, Math.PI * 2);
			context.strokeStyle = impact.kind === 'infection'
				? `rgba(99, 231, 245, ${1 - progress})`
				: `rgba(255, 164, 174, ${(1 - progress) * 0.72})`;
			context.lineWidth = impact.kind === 'infection' ? 2 : 1.5;
			context.stroke();

			if (impact.points) {
				context.globalAlpha = Math.min(1, (1 - progress) * 1.8);
				context.fillStyle = impact.points > 0 ? '#ffd8d9' : '#ffc2b9';
				context.font = '700 17px Arial, sans-serif';
				context.textAlign = 'center';
				context.fillText(`${impact.points > 0 ? '+' : '−'}${Math.abs(impact.points)}`, impact.x, impact.y - 20 - progress * 28);
				context.globalAlpha = 1;
			}
		}
	}

	function drawFrame() {
		if (!worldWidth || !worldHeight || !sprites) return;
		context.clearRect(0, 0, worldWidth, worldHeight);
		drawBackground();
		drawEntities();
		drawBossEncounter();
		drawLasers();
		drawEffects();

		const bob = Math.sin(elapsedTime * 2.8) * 3;
		context.save();
		context.globalAlpha = invulnerabilityTime > 0 && Math.floor(elapsedTime * 10) % 2 === 0 ? 0.5 : 1;
		const ufoWidth = Math.min(110, Math.max(68, worldWidth * 0.2));
		drawSprite(sprites.ufo, playerX, playerY + bob, ufoWidth, ufoWidth * 0.69);
		context.restore();
	}

	function runFrame(timestamp) {
		if (!gameRunning) return;
		const deltaTime = previousFrameTime ? Math.min((timestamp - previousFrameTime) / 1000, 0.05) : 0;
		previousFrameTime = timestamp;
		playerY = worldHeight - Math.max(54, worldHeight * 0.09);
		const canMovePlayer = bossState === 'idle' || bossState === 'fight';
		if (canMovePlayer) {
			if (pressedKeys.has('left')) playerX -= playerSpeed * deltaTime;
			if (pressedKeys.has('right')) playerX += playerSpeed * deltaTime;
			playerX = Math.max(42, Math.min(worldWidth - 42, playerX));
		}

		if (bossState === 'idle') {
			elapsedTime += deltaTime;
			invulnerabilityTime = Math.max(0, invulnerabilityTime - deltaTime);
			updateWave(deltaTime);
			spawnTime += deltaTime;
			bacteriaSpawnTime += deltaTime;
			const bacteriaCount = entities.filter((entity) => entity.kind === 'bacteria').length;
			if (bacteriaSpawnTime >= nextBacteriaSpawnInterval() &&
				bacteriaCount < 2 && entities.length < entityLimit() &&
				spawnEntity('bacteria')) {
				bacteriaSpawnTime = 0;
			}
			if (spawnTime >= nextSpawnInterval() &&
				entities.length < entityLimit() - 1 &&
				spawnEntity('cell')) {
				spawnTime = 0;
			}
			updateEntities(deltaTime);
			updateLasers(deltaTime);
			updateEffects(deltaTime);
		} else {
			updateBossEncounter(deltaTime);
			if (bossState === 'fight') {
				elapsedTime += deltaTime;
				invulnerabilityTime = Math.max(0, invulnerabilityTime - deltaTime);
				updateLasers(deltaTime);
				updateEffects(deltaTime);
			}
		}
		drawFrame();
		if (gameRunning) animationFrame = requestAnimationFrame(runFrame);
	}

	function pointFromEvent(event) {
		const bounds = canvas.getBoundingClientRect();
		return {
			x: (event.clientX - bounds.left) * worldWidth / bounds.width,
			y: (event.clientY - bounds.top) * worldHeight / bounds.height,
		};
	}

	function playFallbackLaserSound() {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		if (!AudioContext) {
			const error = new Error('Este navegador não oferece suporte ao áudio do laser.');
			statusElement.textContent = error.message;
			console.error(error);
			return;
		}

		if (!audioContext) audioContext = new AudioContext();
		const playTone = () => {
			const now = audioContext.currentTime;
			const oscillator = audioContext.createOscillator();
			const gain = audioContext.createGain();
			oscillator.type = 'sawtooth';
			oscillator.frequency.setValueAtTime(900, now);
			oscillator.frequency.exponentialRampToValueAtTime(170, now + 0.12);
			gain.gain.setValueAtTime(0.0001, now);
			gain.gain.exponentialRampToValueAtTime(0.13, now + 0.008);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
			oscillator.connect(gain);
			gain.connect(audioContext.destination);
			oscillator.start(now);
			oscillator.stop(now + 0.15);
		};
		if (audioContext.state === 'suspended') {
			audioContext.resume().then(playTone).catch((error) => {
				statusElement.textContent = 'O navegador bloqueou o áudio do laser.';
				console.error(error);
			});
		} else {
			playTone();
		}
	}

	function playLaserSound() {
		const audio = laserSounds[laserSoundIndex];
		laserSoundIndex = (laserSoundIndex + 1) % laserSounds.length;
		audio.currentTime = 0;
		const playback = audio.play();
		if (playback) {
			playback.catch((error) => {
				if (!audioFallbackReported) {
					audioFallbackReported = true;
					statusElement.textContent = 'Laser.mp3 não foi decodificado; usando áudio de reserva.';
					console.error('Unable to decode Laser.mp3; using the synthesized laser sound.', error);
				}
				playFallbackLaserSound();
			});
		}
	}

	function shoot(target) {
		if (!gameRunning || !['idle', 'fight'].includes(bossState) || lasers.length >= 16) return;
		const startX = playerX;
		const startY = playerY - 26;
		const deltaX = target.x - startX;
		const deltaY = target.y - startY;
		const distance = Math.hypot(deltaX, deltaY) || 1;
		lasers.push({
			startX,
			startY,
			x: startX,
			y: startY,
			directionX: deltaX / distance,
			directionY: deltaY / distance,
			distance,
			distanceTravelled: 0,
			age: 0,
			hit: false,
		});
		playLaserSound();
	}

	function releaseMobileMove(event) {
		const direction = event.currentTarget.dataset.biodefenseMove;
		if (!direction) return;
		pressedKeys.delete(direction);
		event.currentTarget.classList.remove('is-pressed');
		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
	}

	memoryGameElement.addEventListener('click', (event) => {
		if (!(event.target instanceof Element)) return;
		const pad = event.target.closest('button[data-memory-pad]');
		if (!pad) return;
		handleMemoryPadInput(Number(pad.dataset.memoryPad));
	});

	startButton.addEventListener('click', openGame);
	beginButton.addEventListener('click', () => {
		resetGame();
	});
	backButton.addEventListener('click', returnToMenu);
	restartButton.addEventListener('click', resetGame);
	bossContinueButton.addEventListener('click', advanceBossDialogue);
	mobileMoveButtons.forEach((button) => {
		button.addEventListener('pointerdown', (event) => {
			if (!gameRunning || (bossState !== 'idle' && bossState !== 'fight')) return;
			event.preventDefault();
			const direction = button.dataset.biodefenseMove;
			if (direction !== 'left' && direction !== 'right') return;
			button.setPointerCapture(event.pointerId);
			pressedKeys.add(direction);
			button.classList.add('is-pressed');
		});
		button.addEventListener('pointerup', releaseMobileMove);
		button.addEventListener('pointercancel', releaseMobileMove);
		button.addEventListener('lostpointercapture', releaseMobileMove);
	});
	canvas.addEventListener('pointermove', (event) => {
		aimPoint = pointFromEvent(event);
	});
	canvas.addEventListener('pointerdown', (event) => {
		if (!gameRunning || event.button !== 0) return;
		event.preventDefault();
		aimPoint = pointFromEvent(event);
		shoot(aimPoint);
	});

	window.addEventListener('keydown', (event) => {
		if (!gameRunning || screenElement.hidden) return;
		const key = event.key.toLowerCase();
		if (bossState === 'memory-input' && /^[1-4]$/.test(key)) {
			handleMemoryPadInput(Number(key) - 1);
			event.preventDefault();
			return;
		}
		if (key === 'arrowleft' || key === 'a') {
			pressedKeys.add('left');
			event.preventDefault();
		} else if (key === 'arrowright' || key === 'd') {
			pressedKeys.add('right');
			event.preventDefault();
		} else if (key === 'arrowup' || key === 'w') {
			aimPoint.y = Math.max(0, aimPoint.y - 36);
			event.preventDefault();
		} else if (key === 'arrowdown' || key === 's') {
			aimPoint.y = Math.min(worldHeight, aimPoint.y + 36);
			event.preventDefault();
		} else if (key === ' ' || key === 'spacebar') {
			shoot(aimPoint);
			event.preventDefault();
		}
	});

	window.addEventListener('keyup', (event) => {
		const key = event.key.toLowerCase();
		if (key === 'arrowleft' || key === 'a') pressedKeys.delete('left');
		if (key === 'arrowright' || key === 'd') pressedKeys.delete('right');
	});

	window.addEventListener('blur', () => {
		pressedKeys.clear();
		mobileMoveButtons.forEach((button) => button.classList.remove('is-pressed'));
	});
	window.addEventListener('resize', () => {
		if (screenElement.hidden) return;
		resizeArena();
		drawFrame();
	});
	new ResizeObserver(() => {
		if (screenElement.hidden) return;
		resizeArena();
		drawFrame();
	}).observe(canvas);
})();
