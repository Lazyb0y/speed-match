class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    init() {
        this.canPlay = false;
        this.timedEvent = null;

        this.previousFrame = -1;
        this.currentFrame = -1;

        this.symbol = null;

        this.scoreText = null;
        this.bestScoreText = null;

        this.score = 0;
    }

    create() {
        /* Adding UI buttons */
        let noButton = this.add.sprite(0, SpeedMatch.game.config.height, "no");
        noButton.setOrigin(0, 1);
        noButton.setInteractive();
        noButton.on("pointerdown", this.handleNo, this);

        let yesButton = this.add.sprite(SpeedMatch.game.config.width, SpeedMatch.game.config.height, "yes");
        yesButton.setOrigin(1, 1);
        yesButton.setInteractive();
        yesButton.on("pointerdown", this.handleYes, this);

        /* Loading symbols */
        this.symbol = this.add.sprite(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2, "symbols", 0);
        this.symbol.setOrigin(0.5, 0.5);

        /* UI scores */
        let scoreX = SpeedMatch.game.config.width / 2;
        let scoreY = (SpeedMatch.game.config.height / 2) - SpeedMatch.GameOptions.tileSize;
        this.add.image(scoreX, scoreY, "scorepanel");
        this.add.image(scoreX, scoreY - 90, "scorelabels");

        let scoreTextX = SpeedMatch.game.config.width / 8;
        let scoreTextY = (SpeedMatch.game.config.height / 2) - SpeedMatch.GameOptions.tileSize - 45;
        this.scoreText = this.add.bitmapText(scoreTextX, scoreTextY, "font", "0", 100);

        let bestScoreTextX = (SpeedMatch.game.config.width / 8) * 4.3;
        let bestScoreTextY = (SpeedMatch.game.config.height / 2) - SpeedMatch.GameOptions.tileSize - 45;
        this.bestScoreText = this.add.bitmapText(bestScoreTextX, bestScoreTextY, "font", "0", 100);

        this.showNextSymbol();
    }

    scheduleNextTimer() {
        let timerConfig = {
            delay: SpeedMatch.GameOptions.tileTimerDelay,
            callback: this.onTimerEvent,
            callbackScope: this,
            paused: false
        };

        if (this.timedEvent === null) {
            this.timedEvent = this.time.addEvent(timerConfig);
        }
        else {
            this.timedEvent.remove(false);
            this.timedEvent = this.time.addEvent(timerConfig);
        }
        this.timedEvent.paused = false;
    }

    onTimerEvent() {
        this.canPlay = false;
        this.timedEvent.paused = true;
        if (this.previousFrame === -1) {
            this.showNextSymbol();
        }
        else {
            this.timedEvent.remove(false);
            this.scene.start("EndScene");
        }
    }

    showNextSymbol() {
        this.previousFrame = this.currentFrame;
        let showPrevious = Phaser.Math.Between(0, 100) > 50 && this.currentFrame !== -1;
        if (showPrevious) {
        }
        else {
            this.currentFrame = Phaser.Math.Between(0, SpeedMatch.GameOptions.totalFrameCount - 1);
        }

        /* Showing symbol appearing animation */
        this.symbol.alpha = 0;
        this.symbol.setFrame(this.currentFrame);
        this.tweens.add({
            targets: [this.symbol],
            alpha: 1,
            duration: SpeedMatch.GameOptions.animations.symbolAppearDelay,
            callbackScope: this,
            onComplete: function () {
                this.scheduleNextTimer();
                if (this.previousFrame !== -1) {
                    this.canPlay = true;
                }
            }
        });
    }

    handleNo() {
        if (!this.canPlay) {
            return;
        }
        this.canPlay = false;
        this.timedEvent.paused = true;

        if (this.previousFrame !== this.currentFrame) {
            this.score++;
            this.showNextSymbol();
        }
        else {
            this.timedEvent.remove(false);
            this.scene.start("EndScene");
        }
    }

    handleYes() {
        if (!this.canPlay) {
            return;
        }
        this.canPlay = false;
        this.timedEvent.paused = true;

        if (this.previousFrame === this.currentFrame) {
            this.score++;
            this.showNextSymbol();
        }
        else {
            this.timedEvent.remove(false);
            this.scene.start("EndScene");
        }
    }
}