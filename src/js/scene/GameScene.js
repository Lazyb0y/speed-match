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
    }

    create() {
        /* Adding UI buttons */
        let noButton = this.add.sprite(0, SpeedMatch.game.config.height, "no");
        noButton.setOrigin(0, 1);
        noButton.setInteractive();
        noButton.on("pointerdown", this.handleNo);

        let yesButton = this.add.sprite(SpeedMatch.game.config.width, SpeedMatch.game.config.height, "yes");
        yesButton.setOrigin(1, 1);
        yesButton.setInteractive();
        yesButton.on("pointerdown", this.handleYes);

        /* Loading symbols */
        this.symbol = this.add.sprite(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2, "symbols", 0);
        this.symbol.setOrigin(0.5, 0.5);

        this.scheduleNextTimer();
    }

    scheduleNextTimer() {
        this.timedEvent = this.time.addEvent({
            delay: SpeedMatch.GameOptions.tileTimerDelay,
            callback: this.onTimerEvent,
            callbackScope: this
        });
    }

    onTimerEvent() {
        this.previousFrame = this.currentFrame;
        let showPrevious = Phaser.Math.Between(0, 100) > 50 && this.currentFrame !== -1;
        if (showPrevious) {
            console.log("same: " + this.currentFrame);
        }
        else {
            this.currentFrame = Phaser.Math.Between(0, SpeedMatch.GameOptions.totalFrameCount - 1);
            if (this.currentFrame === this.previousFrame) {
                console.log("same: " + this.currentFrame);
            }
            else {
                console.log("not : " + this.currentFrame);
            }
        }

        this.symbol.setFrame(this.currentFrame);
        this.scheduleNextTimer();
    }

    handleNo() {
        if (!this.canPlay) {
            return;
        }
        this.canPlay = false;
        console.log("pressed NO");
    }

    handleYes() {
        if (!this.canPlay) {
            return;
        }
        this.canPlay = false;
        console.log("pressed YES");
    }
}