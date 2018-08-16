class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.image("apptitle", "assets/sprites/apptitle.png");
    }

    create() {
        this.scene.start("PreloadScene");
    }
}