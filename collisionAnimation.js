export class CollisionAnimation {
	constructor(game, x, y) {
		this.game = game;
		this.image = document.getElementById('boom');
		this.spriteWidth = 100;
		this.spriteHeight = 90;
		this.spriteModifier = Math.random() + 0.5;
		this.width = this.spriteWidth * this.spriteModifier;
		this.height = this.spriteHeight * this.spriteModifier;
		this.x = x - this.width * 0.5;
		this.y = y - this.height * 0.5;
		this.frameX = 0;
		this.maxFrame = 4;
		this.markedForDeletion = false;
		this.fps = 20;
		this.frameInterval = 1000 / this.fps;
		this.frameTimer = 0;
		this.collisionsSound = new Audio();
		this.collisionsSound.src = 'assets/boom.mp3';
	}
	draw(context) {
		context.drawImage(
			this.image,
			this.frameX * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}
	update(deltaTime) {
		this.x -= this.game.speed;
		// sprite animation
		if (this.frameTimer > this.frameInterval) {
			this.frameTimer = 0;
			this.frameX++;
		} else {
			this.frameTimer += deltaTime;
		}
		if (this.frameX === 1) this.collisionsSound.play();
		if (this.frameX > this.maxFrame) this.markedForDeletion = true;
	}
}
