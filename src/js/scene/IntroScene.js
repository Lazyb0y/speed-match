class IntroScene extends Phaser.Scene {
    constructor() {
        super("IntroScene");
    }

    init() {
        this.appIcon = null;
    }

    create() {
        /* Showing application title */
        this.appIcon = this.add.image(SpeedMatch.game.config.width / 2, 100, "apptitle");
        this.appIcon.setOrigin(0.5, 0);

        let gameIntro = this.add.image(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2, "gameintro");
        gameIntro.setOrigin(0.5, 0.5);

        /* Start button */
        let startButton = this.add.image(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height - 100, "start");
        startButton.setOrigin(0.5, 0.5);
        startButton.setInteractive();
        startButton.on("pointerdown", function () {
            this.scene.start("GameScene");
        }, this);
    }
}