class EndScene extends Phaser.Scene {
    constructor() {
        super("EndScene");
    }

    init(data) {
        this.data = data;

        this.appIcon = null;

        this.previousClientWidth = 0;
        this.previousClientHeight = 0;

        this.isPortraitMode = true;
    }

    create() {
        /* Showing application title */
        this.appIcon = this.add.image(SpeedMatch.game.config.width / 2, 100, "apptitle");
        this.appIcon.setOrigin(0.5, 0);

        /* Score */
        let scoreTextBox = this.add.graphics();
        scoreTextBox.fillStyle(0x34495e, 0.8);
        scoreTextBox.fillRect(0, SpeedMatch.game.config.height / 2 - 145, SpeedMatch.game.config.width, 200);

        this.scoreText = this.add.bitmapText(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2, "font", this.data.score, 200);
        this.scoreText.setOrigin(0.5, 0.5);

        /* Best Score */
        this.bestScoreText = this.add.bitmapText(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2 + 100, "timerfont", "BEST: " + this.data.bestScore, 60);
        this.bestScoreText.setOrigin(0.5, 0);

        if (this.data.bestScore === this.data.score && this.data.bestScore !== 0) {
            this.newBest = this.add.image(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2 - 160, "newbest");
            this.newBest.setOrigin(0.5, 1);

            this.crown = this.add.image(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2 - 270, "crown");
            this.crown.setOrigin(0.5, 1);
        }

        /* Start button */
        let startButton = this.add.image(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height - 100, "start");
        startButton.setOrigin(0.5, 0.5);
        startButton.setInteractive();
        startButton.on("pointerdown", function () {
            this.scene.start("GameScene");
        }, this);
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
    }

    handleScreenSizeChange() {
        if (this.previousClientWidth > this.previousClientHeight) {
            this.isPortraitMode = false;
            document.getElementById("turn").style.display = "block";
        }
        else {
            this.isPortraitMode = true;
            document.getElementById("turn").style.display = "none";
        }
    }
}