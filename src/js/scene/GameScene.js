class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    init() {
        this.canPlay = false;
        this.buttonAppearing = false;
        this.timedEvent = null;

        this.previousFrame = -1;
        this.currentFrame = -1;

        this.symbol = null;
        this.appIcon = null;
        this.hints = null;

        this.yesButton = null;
        this.noButton = null;

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
        /* Showing application title */
        this.appIcon = this.add.image(SpeedMatch.game.config.width / 2, 100, "apptitle");
        this.appIcon.setOrigin(0.5, 0);

        /* Adding UI buttons */
        this.noButton = this.add.sprite(0, SpeedMatch.game.config.height + 300, "no");
        this.noButton.setOrigin(0, 1);
        this.noButton.setInteractive();
        this.noButton.on("pointerdown", this.handleNo, this);

        this.yesButton = this.add.sprite(SpeedMatch.game.config.width, SpeedMatch.game.config.height + 300, "yes");
        this.yesButton.setOrigin(1, 1);
        this.yesButton.setInteractive();
        this.yesButton.on("pointerdown", this.handleYes, this);

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

        /* Initializing sounds */
        this.correctSound = this.sound.add("correct");
        this.incorrectSound = this.sound.add("incorrect");
        this.showNextSymbol();
    }

    update() {
        if (this.sys.game.device.os.android || this.sys.game.device.os.iPhone || this.sys.game.device.os.iPad) {
            let clientWidth = document.documentElement.clientWidth;
            let clientHeight = document.documentElement.clientHeight;
            if (clientWidth !== this.previousClientWidth || clientHeight !== this.previousClientHeight) {
                this.previousClientWidth = clientWidth;
                this.previousClientHeight = clientHeight;
                this.handleScreenSizeChange();
            }
        }

        if (this.timedEvent !== null) {
            let remainingTime = this.timedEvent.delay / 1000 - this.timedEvent.getElapsedSeconds();
            this.timerText.text = (remainingTime).toFixed(2);

            /* Buttons appearing animation */
            if (!this.buttonAppearing && remainingTime <= SpeedMatch.GameOptions.animations.buttonAppearDelay / 1000) {
                this.buttonAppearing = true;
                this.tweens.add({
                    targets: [this.noButton, this.yesButton],
                    y: SpeedMatch.game.config.height,
                    duration: SpeedMatch.GameOptions.animations.buttonAppearDelay,
                    callbackScope: this
                });
            }
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

    gameFinish() {
        this.timedEvent.remove(false);
        this.incorrectSound.play();

        let timerConfig = {
            delay: SpeedMatch.GameOptions.animations.gameFinishedDelay,
            callback: function () {
                this.scene.start("EndScene", {
                    score: this.score,
                    bestScore: this.bestScore
                });
            },
            callbackScope: this,
            paused: false
        };

        this.time.addEvent(timerConfig);
        this.tweens.add({
            targets: [this.noButton, this.yesButton],
            y: SpeedMatch.game.config.height + 300,
            duration: SpeedMatch.GameOptions.animations.buttonAppearDelay,
            callbackScope: this
        });
    }

    scheduleNextTimer() {
        let timerConfig = {
            delay: this.timedEvent === null ? SpeedMatch.GameOptions.tileTimerInitialDelay : SpeedMatch.GameOptions.tileTimerDelay,
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
            this.gameFinish();
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
        this.correctSound.play();

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
            this.gameFinish();
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
            this.gameFinish();
        }
    }
}