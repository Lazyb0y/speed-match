class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        /* Loading images and sprites */
        this.load.image("yes", "assets/sprites/yes.png");
        this.load.image("no", "assets/sprites/no.png");

        /* Loading spritesheet */
        this.load.spritesheet("symbols", "assets/sprites/symbols.png", {
            frameWidth: SpeedMatch.GameOptions.tileSize,
            frameHeight: SpeedMatch.GameOptions.tileSize
        });
    }

    create() {
        this.scene.start("GameScene");
    }
}