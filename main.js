import Player from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemy.js';
import { UI } from './ui.js';

window.addEventListener('DOMContentLoaded', function () {
	const canvas = document.getElementById('canvas1');
	const ctx = canvas.getContext('2d');
	const music = document.getElementById('music');
	const over = document.getElementById('over');
	const startBtn = document.querySelector('.startBtn');
	const restartBtn = document.querySelector('.restartBtn');
	const menu = document.querySelector('.menu');
	const restartMenu = document.querySelector('.restartMenu');
	const scoreInfo = document.querySelector('.scoreInfo');
	canvas.width = 900;
	canvas.height = 500;

	class Game {
		constructor(menu, restartMenu, width, height) {
			this.width = width;
			this.height = height;
			this.music = music;
			this.overMusic = over;
			this.groundMargin = 80;
			this.speed = 0;
			this.maxSpeed = 6;
			this.backgorund = new Background(this);
			this.player = new Player(this);
			this.input = new InputHandler(this);
			this.Ui = new UI(this);
			this.enemies = [];
			this.particles = [];
			this.collisions = [];
			this.floatingMessage = [];
			this.maxParticles = 50;
			this.enemyTimer = 0;
			this.enemyInterval = 1000;
			this.debug = false;
			this.score = 0;
			this.fontColor = 'black';
			this.time = 0;
			// this.maxTime = 30000;
			this.menu = menu;
			this.restartMenu = restartMenu;
			this.scoreInfo = scoreInfo;
			this.startGame = false;
			this.gameOver = false;
			this.lives = 3;
			this.superModeMaxTime = 100;
			this.superModeCharge = 100;
			this.player.currentState = this.player.states[0];
			this.player.currentState.enter();
		}
		update(deltaTime) {
			if (this.startGame) {
				this.time += deltaTime;
				// if (this.time > this.maxTime) this.gameOver = true;
				this.backgorund.update();
				this.player.update(this.input.keys, deltaTime);
				// adding enemies
				if (this.enemyTimer > this.enemyInterval) {
					this.addEnemy();
					this.enemyTimer = 0;
				} else this.enemyTimer += deltaTime;
				this.enemies.forEach((enemy) => {
					enemy.update(deltaTime);
					this.enemies = this.enemies.filter(
						(enemy) => !enemy.markedForDeletion
					);
				});
				// adding floating message
				this.floatingMessage.forEach((message) => {
					message.update();
				});
				// adding particles
				this.particles.forEach((particle) => {
					particle.update();
					this.particles = this.particles.filter(
						(particle) => !particle.markedforDeletion
					);
				});
				if (this.particles.length > this.maxParticles) {
					this.particles.length = this.maxParticles;
				}
				// handle collision sprites
				this.collisions.forEach((collision) => {
					collision.update(deltaTime);
					this.collisions = this.collisions.filter(
						(collision) => !collision.markedforDeletion
					);
				});
				this.floatingMessage = this.floatingMessage.filter(
					(message) => !message.markedForDeletion
				);
			}
		}
		draw(context) {
			this.backgorund.draw(context);
			if (this.startGame) {
				this.player.draw(context);
				this.enemies.forEach((enemy) => {
					enemy.draw(context);
				});
				this.floatingMessage.forEach((message) => {
					message.draw(context);
				});
				this.particles.forEach((particle) => {
					particle.draw(context);
				});
				this.collisions.forEach((collision) => {
					collision.draw(context);
				});
				this.Ui.draw(context);
			}
		}
		addEnemy() {
			if (this.speed > 0 && Math.random() < 0.5) {
				this.enemies.push(new GroundEnemy(this));
			} else if (this.speed > 0) {
				this.enemies.push(new ClimbingEnemy(this));
			}
			this.enemies.push(new FlyingEnemy(this));
		}
		restart() {
			this.music.currentTime = 0
			this.player.currentState = this.player.states[0];
			this.speed = 0;
			this.enemies = [];
			this.particles = [];
			this.collisions = [];
			this.floatingMessage = [];
			this.enemyTimer = 0;
			this.score = 0;
			this.time = 0;
			this.startGame = true;
			this.gameOver = false;
			this.lives = 3;
			this.superModeCharge = 100;
			this.player.restart();
			this.player.currentState.enter();
			animate(0);
		}
	}

	const game = new Game(menu, restartMenu, canvas.width, canvas.height);

	let lastTime = 0;
	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.update(deltaTime);
		game.draw(ctx);
		if (!game.gameOver) requestAnimationFrame(animate);
	}

	animate(0);
	startBtn.addEventListener('click', () => {
		game.startGame = true;
		game.input.setKeys();
		game.menu.style.display = 'none';
		game.music.play();
	});
	restartBtn.addEventListener('click', () => {
		game.startGame = true;
		game.restartMenu.style.display = 'none';
		game.restart();
		game.music.play();
	});
});
