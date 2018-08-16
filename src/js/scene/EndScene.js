class EndScene extends Phaser.Scene {
    constructor() {
        super("EndScene");
    }

    init(data) {
        this.data = data;

        this.appIcon = null;

        this.previousClientWidth = 0;
        this.previousClientHeight = 0;

        this.isPortraitMode = true;
    }

    create() {
        /* Showing application title */
        this.appIcon = this.add.image(SpeedMatch.game.config.width / 2, 100, "apptitle");
        this.appIcon.setOrigin(0.5, 0);

        console.log("Game End: " + this.data.score);
    }

    update() {
        if (!this.sys.game.device.os.desktop) {
            let clientWidth = document.documentElement.clientWidth;
            let clientHeight = document.documentElement.clientHeight;
            if (clientWidth !== this.previousClientWidth || clientHeight !== this.previousClientHeight) {
                this.previousClientWidth = clientWidth;
                this.previousClientHeight = clientHeight;
                this.handleScreenSizeChange();
            }
        }
    }

    handleScreenSizeChange() {
        if (this.previousClientWidth > this.previousClientHeight) {
            this.isPortraitMode = false;
            document.getElementById("turn").style.display = "block";
        }
        else {
            this.isPortraitMode = true;
            document.getElementById("turn").style.display = "none";
        }
    }
}