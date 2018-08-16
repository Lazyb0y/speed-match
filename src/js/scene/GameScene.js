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
        this.hints = null;

        this.scoreText = null;
        this.bestScoreText = null;
        this.timerText = null;

        this.score = 0;
        this.bestScore = 0;

        this.previousClientWidth = 0;
        this.previousClientHeight = 0;

        this.isPortraitMode = true;
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

        this.hints = this.add.sprite(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2 + SpeedMatch.GameOptions.tileSize / 2 + 100, "gamemessages", 0);
        this.hints.setOrigin(0.5, 0.5);

        this.timerText = this.add.bitmapText(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2 - SpeedMatch.GameOptions.tileSize / 2 - 50, "timerfont", SpeedMatch.GameOptions.tileTimerDelay.toString(), 100);
        this.timerText.setOrigin(0.5, 0.5);

        /* UI scores */
        let scoreX = SpeedMatch.game.config.width / 2;
        let scoreY = (SpeedMatch.game.config.height / 2) - SpeedMatch.GameOptions.tileSize + 50;
        this.add.image(scoreX, scoreY, "scorepanel");
        this.add.image(scoreX, scoreY - 90, "scorelabels");

        let scoreTextX = SpeedMatch.game.config.width / 8;
        let scoreTextY = (SpeedMatch.game.config.height / 2) - SpeedMatch.GameOptions.tileSize + 5;
        this.scoreText = this.add.bitmapText(scoreTextX, scoreTextY, "font", "0", 100);

        let bestScoreTextX = (SpeedMatch.game.config.width / 8) * 4.3;
        let bestScoreTextY = (SpeedMatch.game.config.height / 2) - SpeedMatch.GameOptions.tileSize + 5;
        this.bestScoreText = this.add.bitmapText(bestScoreTextX, bestScoreTextY, "font", "0", 100);

        /* Showing best score from local storage */
        this.bestScore = localStorage.getItem(SpeedMatch.GameOptions.storage.bestScore);
        if (this.bestScore == null) {
            this.bestScore = 0;
        }
        this.bestScoreText.text = this.bestScore.toString();

        this.showNextSymbol();
    }

    update() {
        if (!this.sys.game.device.os.desktop) {
            let clientWidth = document.documentElement.clientWidth;
            let clientHeight = document.documentElement.clientHeight;
            if (clientWidth !== this.previousClientWidth || clientHeight !== this.previousClientHeight) {
                this.previousClientWidth = clientWidth;
                this.previousClientHeight = clientHeight;
                this.handleScreenSizeChange();
            }
        }

        if (this.timedEvent !== null) {
            this.timerText.text = (this.timedEvent.delay / 1000 - this.timedEvent.getElapsedSeconds()).toFixed(2);
        }
    }

    handleScreenSizeChange() {
        if (this.previousClientWidth > this.previousClientHeight) {
            if (this.timedEvent !== null) {
                this.timedEvent.paused = true;
            }
            this.isPortraitMode = false;
            document.getElementById("turn").style.display = "block";
        }
        else {
            if (this.timedEvent !== null) {
                this.timedEvent.paused = false;
            }
            this.isPortraitMode = true;
            document.getElementById("turn").style.display = "none";
        }
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
            this.scene.start("EndScene", {
                score: this.score,
                bestScore: this.bestScore
            });
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

        if (this.previousFrame === -1) {
            this.hints.setFrame(0);
        }
        else {
            this.hints.setFrame(1);
        }
    }

    incrementScore() {
        this.score++;
        this.scoreText.text = this.score.toString();

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.bestScoreText.text = this.bestScore.toString();
            localStorage.setItem(SpeedMatch.GameOptions.storage.bestScore, this.bestScore);
        }
    }

    handleNo() {
        if (!this.canPlay) {
            return;
        }
        this.canPlay = false;
        this.timedEvent.paused = true;

        if (this.previousFrame !== this.currentFrame) {
            this.incrementScore();
            this.showNextSymbol();
        }
        else {
            this.timedEvent.remove(false);
            this.scene.start("EndScene", {
                score: this.score,
                bestScore: this.bestScore
            });
        }
    }

    handleYes() {
        if (!this.canPlay) {
            return;
        }
        this.canPlay = false;
        this.timedEvent.paused = true;

        if (this.previousFrame === this.currentFrame) {
            this.incrementScore();
            this.showNextSymbol();
        }
        else {
            this.timedEvent.remove(false);
            this.scene.start("EndScene", {
                score: this.score,
                bestScore: this.bestScore
            });
        }
    }
}