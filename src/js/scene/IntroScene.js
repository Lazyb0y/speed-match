class IntroScene extends Phaser.Scene {
    constructor() {
        super("IntroScene");
    }

    init() {
        this.appIcon = null;

        this.previousClientWidth = 0;
        this.previousClientHeight = 0;

        this.isPortraitMode = true;
    }

    create() {
        /* Showing application title */
        this.appIcon = this.add.image(SpeedMatch.game.config.width / 2, 100, "apptitle");
        this.appIcon.setOrigin(0.5, 0);

        let gameIntro = this.add.image(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2 - 200, "gameintro");
        gameIntro.setOrigin(0.5, 0.5);

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