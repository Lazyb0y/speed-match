class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        /* Loading images and sprites */
        this.load.image("yes", "assets/sprites/yes.png");
        this.load.image("no", "assets/sprites/no.png");
    }

    create() {
        this.scene.start("GameScene");
    }
}