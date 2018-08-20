class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    init() {
        this.appIcon = null;
    }

    preload() {
        /* Showing application title */
        this.appIcon = this.add.image(SpeedMatch.game.config.width / 2, SpeedMatch.game.config.height / 4 - 100, "apptitle");
        this.appIcon.setOrigin(0.5, 0);

        /* Adding and configuring progress bar */
        this.setupProgressBar();

        /* Loading images and sprites */
        this.load.image("yes", "assets/sprites/yes.png");
        this.load.image("no", "assets/sprites/no.png");
        this.load.image("scorelabels", "assets/sprites/scorelabels.png");
        this.load.image("scorepanel", "assets/sprites/scorepanel.png");
        this.load.image("gameintro", "assets/sprites/gameintro.png");
        this.load.image("start", "assets/sprites/start.png");

        /* Loading spritesheet */
        this.load.spritesheet("symbols", "assets/sprites/symbols.png", {
            frameWidth: SpeedMatch.GameOptions.tileSize,
            frameHeight: SpeedMatch.GameOptions.tileSize
        });

        this.load.spritesheet("gamemessages", "assets/sprites/gamemessages.png", {
            frameWidth: 700,
            frameHeight: 100
        });

        /* Loading sound effect */
        this.load.audio("correct", ["assets/sounds/correct.ogg", "assets/sounds/correct.mp3"]);
        this.load.audio("incorrect", ["assets/sounds/incorrect.ogg", "assets/sounds/incorrect.mp3"]);

        /* Loading font */
        this.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
        this.load.bitmapFont("timerfont", "assets/fonts/timerfont.png", "assets/fonts/timerfont.fnt");
    }

    create() {
        this.tweens.add({
            targets: [this.appIcon],
            y: 100,
            duration: SpeedMatch.GameOptions.tileTimerDelay,
            callbackScope: this,
            onComplete: function () {
                this.scene.start("IntroScene");
            }
        });
    }

    setupProgressBar() {
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x34495e, 0.8);
        progressBox.fillRect(SpeedMatch.game.config.width / 4, SpeedMatch.game.config.height - (SpeedMatch.game.config.height / 4), SpeedMatch.game.config.width / 2, 50);

        let width = this.cameras.main.width / 2;
        let height = (this.cameras.main.height / 4) * 3;

        /* Initializing text for progress status */
        let loadingText = this.make.text({
            x: width,
            y: height - 30,
            text: 'Loading...',
            style: {
                font: '34px monospace',
                fill: '#16a085'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width,
            y: height + 25,
            text: '0%',
            style: {
                font: '30px monospace',
                fill: '#16a085'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: width,
            y: height + 80,
            text: '',
            style: {
                font: '30px monospace',
                fill: '#16a085'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        /* Load modules callback */
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x34495e, 1);
            progressBar.fillRect(SpeedMatch.game.config.width / 4 + 20, SpeedMatch.game.config.height - (SpeedMatch.game.config.height / 4) + 10, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }
}