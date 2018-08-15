class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    init() {
        this.canPlay = false;
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
        let symbols = this.add.sprite(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2, "symbols", 0);
        symbols.setOrigin(0.5, 0.5);
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