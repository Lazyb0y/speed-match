class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        /* Loading images and sprites */
        this.load.image("yes", "assets/sprites/yes.png");
        this.load.image("no", "assets/sprites/no.png");
        this.load.image("scorelabels", "assets/sprites/scorelabels.png");
        this.load.image("scorepanel", "assets/sprites/scorepanel.png");

        /* Loading spritesheet */
        this.load.spritesheet("symbols", "assets/sprites/symbols.png", {
            frameWidth: SpeedMatch.GameOptions.tileSize,
            frameHeight: SpeedMatch.GameOptions.tileSize
        });

        /* Loading font */
        this.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
    }

    create() {
        this.scene.start("GameScene");
    }
}