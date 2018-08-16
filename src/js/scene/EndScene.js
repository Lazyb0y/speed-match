class EndScene extends Phaser.Scene {
    constructor() {
        super("EndScene");
    }

    init(data) {
        this.data = data;
    }

    preload() {
    }

    create() {
        console.log("Game End: " + this.data.score);
    }
}