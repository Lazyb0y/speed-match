var SpeedMatch = SpeedMatch || {};

SpeedMatch.GameOptions = {};

/* Resizing the game to cover the wider area possible */
function resizeGame() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = SpeedMatch.game.config.width / SpeedMatch.game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

window.onload = function () {
    SpeedMatch.GameConfig = {
        width: 480,
        height: 640,
        backgroundColor: 0xecf0f1,
        scene: [BootScene, PreloadScene, GameScene]
    };

    /* Initializing the Phaser 3 framework */
    SpeedMatch.game = new Phaser.Game(SpeedMatch.GameConfig);
    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame);
};