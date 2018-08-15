class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    init() {
    }

    create() {
        /* Adding UI buttons */
        let noButton = this.add.sprite(0, SpeedMatch.game.config.height, "no");
        noButton.setOrigin(0, 1);

        let yesButton = this.add.sprite(SpeedMatch.game.config.width, SpeedMatch.game.config.height, "yes");
        yesButton.setOrigin(1, 1);

        /* Loading symbols */
        let symbols = this.add.sprite(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 2, "symbols", 0);
        symbols.setOrigin(0.5, 0.5);
    }
}