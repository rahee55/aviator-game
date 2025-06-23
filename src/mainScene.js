import { Scene } from "phaser";

class mainScene extends Scene {
  constructor() {
    super({ key: "mainScene" });
    this.aviatorJet = null;
    this.trailGraphics = null;
    this.trailPoints = [];
    this.screenType = "desktop";
    this.progress = 0;
    this.multiplier = 1;
    this.planeDefaultPosition = null;
  }

  preload() {
    this.load.spritesheet("aviator", "/sprite2.png", {
      frameWidth: 100,
      frameHeight: 48,
    });
    this.load.image("bgR", "/bgSun.svg");
    this.load.image("bgbright", "/blur.svg");
    this.load.image("vimaan_1", "/vimaan1.svg");
    this.load.image("vimaan_2", "/vimaan2.svg");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    if (this.scale.width < 500) this.screenType = "mobile";

    const bg = this.add.image(-1, 500, "bgR");

    if (!this.anims.exists("aviatorsJ")) {
      this.anims.create({
        key: "aviatorsJ",
        frames: [{ key: "vimaan_1" }, { key: "vimaan_2" }],
        frameRate: 6,
        repeat: -1,
      });
    }
    switch (true) {
      case width <= 320:
        this.planeDefaultPosition = {
          width: width * 0.18,
          height: height * 0.84,
        };
        break;
      case width <= 332:
        this.planeDefaultPosition = {
          width: width * 0.21,
          height: height * 0.83,
        };
        break;
      case width <= 348:
        this.planeDefaultPosition = {
          width: width * 0.21,
          height: height * 0.8,
        };
        break;
      case width <= 363:
        this.planeDefaultPosition = {
          width: width * 0.21,
          height: height * 0.77,
        };
        break;
      case width <= 378:
        this.planeDefaultPosition = {
          width: width * 0.21,
          height: height * 0.85,
        };
        break;
      case width <= 402:
        this.planeDefaultPosition = {
          width: width * 0.14,
          height: height * 0.94,
        };
        break;
      case width <= 413:
        this.planeDefaultPosition = {
          width: width * 0.17,
          height: height * 0.79,
        };
        break;
      case width <= 463:
        this.planeDefaultPosition = {
          width: width * 0.13,
          height: height * 0.94,
        };
        break;
      case width <= 588:
        this.planeDefaultPosition = {
          width: width * 0.14,
          height: height * 0.785,
        };
        break;
      case width <= 840:
        this.planeDefaultPosition = {
          width: width * 0.11,
          height: height * 0.92,
        };
        break;
      case width <= 880:
        this.planeDefaultPosition = {
          width: width * 0.115,
          height: height * 0.87,
        };
        break;
      case width == 888 && height == 528:
        this.planeDefaultPosition = {
          width: width * 0.115,
          height: height * 0.88,
        };
        break;
      case width <= 950:
        this.planeDefaultPosition = {
          width: width * 0.11,
          height: height * 0.87,
        };
        break;
      case width <= 1010:
        this.planeDefaultPosition = {
          width: width * 0.08,
          height: height * 0.875,
        };
        break;
      default:
        this.planeDefaultPosition = {
          width: width * 0.065,
          height: height * 0.92,
        };
        break;
    }

    this.bezierGraphics = this.add.graphics();
    this.trailGraphics = this.add.graphics();
    this.trailGraphics.lineStyle(3, 0xff0044, 1);

    const textStyle = {
      font: "bold 70px Arial",
      fill: "#ffffff",
    };

    if (this.screenType === "mobile") {
      this.text = this.add.text(150, 230, "1.00X", textStyle).setScale(0.9);
      this.aviatorJet = this.add
        .sprite(
          this.planeDefaultPosition.width,
          this.planeDefaultPosition.height,
          "vimaan_1"
        )
        .setScale(0.7);
      this.add.image(200, 250, "bgbright").setScale(1.2);
    } else {
      this.text = this.add.text(450, 230, "1.00X", textStyle);
      this.aviatorJet = this.add.sprite(
        this.planeDefaultPosition.width,
        this.planeDefaultPosition.height,
        "vimaan_1"
      );
      this.add.image(500, 250, "bgbright").setScale(1.2);
    }

    this.aviatorJet.play("aviatorsJ");
    this.drawBezierCurve(0);
    this.lastUpdateTime = 0;
    this.stopTriggered = true;

    this.add
      .text(130, 20, "Start", {
        font: "bold 30px Arial",
        fill: "#ffffff",
        backgroundColor: "#ff0044",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => this.startFlight(bg));

    this.add
      .text(20, 20, "Reset", {
        font: "bold 28px Arial",
        fill: "#ffffff",
        backgroundColor: "#f00f00",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => this.restartAviatorJet());

    this.add
      .text(230, 20, "Fly", {
        font: "bold 28px Arial",
        fill: "#ffffff",
        backgroundColor: "#ff0044",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.tweens.killAll();
        this.tweens.add({
          targets: this.aviatorJet,
          x: 1900,
          y: 150,
          duration: 600,
        });
        this.multiplier = 1;
        this.text.setText("1.00X");
        this.stopTriggered = true;
        this.bezierGraphics.clear();
      });
  }

  startFlight(bg) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.stopTriggered = false;
    const startX = width * 0.014;
    const startY = height * 0.095;
    const endX = this.screenType === "mobile" ? window.innerWidth - 100 : 770;
    const endY = 60;
    const steps = 6;

    const curvePoints = [];
    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      const x = Phaser.Math.Linear(startX, endX, s);
      const y = Phaser.Math.Linear(startY, endY, Math.pow(s, 2.5));
      curvePoints.push(new Phaser.Math.Vector2(x, y));
    }

    const path = new Phaser.Curves.Spline(curvePoints);
    this.aviatorJet.setPosition(curvePoints[0].x, curvePoints[0].y);
    this.bezierGraphics.clear();

    let hasReachedEnd = false;

    this.tweens.add({
      targets: { t: 0 },
      t: 1,

      duration: 7000,
      onUpdate: (tween) => {
        const t = Phaser.Math.Easing.Sine.Out(tween.getValue());
        const point = path.getPoint(t);
        this.aviatorJet.setPosition(point.x, point.y);

        if (t >= 1 && !hasReachedEnd) {
          hasReachedEnd = true;
          this.tweens.add({
            targets: this.aviatorJet,
            x: "+=30",
            y: "+=120",
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });
        }
      },
    });

    const bgTween = this.tweens.add({
      targets: bg,
      angle: 360,
      duration: 50000,
      ease: "Linear",
      repeat: -1,
    });

    const newStopTime = Phaser.Math.Between(20000, 60000);
    this.time.delayedCall(newStopTime, () => {
      this.stopTriggered = true;
      this.tweens.add({
        targets: this.aviatorJet,
        x: this.cameras.main.width + 200,
        y: 100,
        duration: 600,
      });
      this.bezierGraphics.clear();
      this.text.setFill("#F00F00");
      this.tweens.killTweensOf(bg);
    });
  }

  update(time) {
    if (this.stopTriggered) return;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    let speed;
    switch (true) {
      case this.progress < 0.3:
        speed = 0.00275;
        break;
      case this.progress < 0.45:
        speed = 0.0001;
        break;
      case this.progress < 0.6:
        speed = 0.00003;
        break;
      default:
        speed = 0.00002;
        break;
    }

    this.progress += speed;
    if (this.progress >= 1) {
      this.progress = 0.6;
    }
    mainScene.sharedProgress = this.progress;
    const t = this.progress;
    let x, y;

    switch (true) {
      case width <= 320:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.18, width * 0.3],
            stageProgress
          );
          y = height * 0.84;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.3, width * 0.4],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.79, height * 0.6],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.4, width * 0.6],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.6, height * 0.1],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.6, width * 0.75],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.1, height * 0.45],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.75, width * 0.6],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.45, height * 0.1],
            easedProgress
          );
        }
        break;
      case width <= 333:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.21, width * 0.3],
            stageProgress
          );
          y = height * 0.83;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.3, width * 0.4],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.83, height * 0.6],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.4, width * 0.65],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.6, height * 0.08],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.65, width * 0.8],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.08, height * 0.35],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.8, width * 0.65],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.35, height * 0.08],
            easedProgress
          );
        }
        break;
      case width <= 348:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.21, width * 0.3],
            stageProgress
          );
          y = height * 0.798;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.3, width * 0.4],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.798, height * 0.6],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.4, width * 0.68],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.6, height * 0.1],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.68, width * 0.82],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.1, height * 0.45],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.82, width * 0.68],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.45, height * 0.1],
            easedProgress
          );
        }
        break;
      case width <= 363:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.21, width * 0.3],
            stageProgress
          );
          y = height * 0.77;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.3, width * 0.45],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.77, height * 0.57],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.45, width * 0.7],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.57, height * 0.1],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.7, width * 0.82],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.1, height * 0.5],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.82, width * 0.7],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.5, height * 0.1],
            easedProgress
          );
        }
        break;
      case width <= 378:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.21, width * 0.3],
            stageProgress
          );
          y = height * 0.85;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.3, width * 0.5],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.85, height * 0.55],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.5, width * 0.7],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.55, height * 0.08],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.7, width * 0.85],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.08, height * 0.45],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.85, width * 0.7],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.45, height * 0.08],
            easedProgress
          );
        }
        break;
      case width <= 402:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.14, width * 0.3],
            stageProgress
          );
          y = height * 0.94;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.3, width * 0.5],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.858, height * 0.55],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.5, width * 0.72],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.55, height * 0.08],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.72, width * 0.84],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.08, height * 0.45],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.84, width * 0.72],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.45, height * 0.08],
            easedProgress
          );
        }
        break;
      case width <= 413:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.17, width * 0.3],
            stageProgress
          );
          y = height * 0.79;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.3, width * 0.4],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.79, height * 0.6],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.4, width * 0.73],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.6, height * 0.1],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.73, width * 0.85],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.1, height * 0.45],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.85, width * 0.73],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.45, height * 0.1],
            easedProgress
          );
        }
        break;
      case width <= 463:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.13, width * 0.3],
            stageProgress
          );
          y = height * 0.94;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.3, width * 0.45],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.85, height * 0.6],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.45, width * 0.73],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.6, height * 0.08],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.73, width * 0.85],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.08, height * 0.35],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.85, width * 0.73],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.35, height * 0.08],
            easedProgress
          );
        }
        break;
      case width <= 588:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.14, width * 0.2],
            stageProgress
          );
          y = height * 0.785;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.2, width * 0.5],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.785, height * 0.71],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.5, width * 0.78],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.71, height * 0.1],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.78, width * 0.88],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.1, height * 0.5],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.88, width * 0.78],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.5, height * 0.1],
            easedProgress
          );
        }
        break;
      case width <= 840:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.11, width * 0.2],
            stageProgress
          );
          y = height * 0.92;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.2, width * 0.5],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.86, height * 0.71],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.5, width * 0.82],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.71, height * 0.08],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.82, width * 0.9],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.08, height * 0.35],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.9, width * 0.82],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.35, height * 0.08],
            easedProgress
          );
        }
        break;
      case width <= 880:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.115, width * 0.2],
            stageProgress
          );
          y = height * 0.87;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.2, width * 0.5],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.87, height * 0.71],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.5, width * 0.82],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.71, height * 0.08],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.82, width * 0.9],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.08, height * 0.35],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.9, width * 0.82],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.35, height * 0.08],
            easedProgress
          );
        }
        break;
      case width <= 950:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.115, width * 0.2],
            stageProgress
          );
          y = height * 0.87;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.2, width * 0.5],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.87, height * 0.71],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.5, width * 0.8],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.71, height * 0.07],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.8, width * 0.9],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.07, height * 0.35],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.9, width * 0.8],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.35, height * 0.07],
            easedProgress
          );
        }
        break;
      case width <= 1010:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.08, width * 0.2],
            stageProgress
          );
          y = height * 0.8715;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.2, width * 0.5],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.8715, height * 0.71],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.5, width * 0.8],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.71, height * 0.07],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.8, width * 0.9],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.07, height * 0.35],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.9, width * 0.8],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.35, height * 0.07],
            easedProgress
          );
        }
        break;
      default:
        if (t < 0.3) {
          const stageProgress = t / 0.3;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.065, width * 0.2],
            stageProgress
          );
          y = height * 0.92;
        } else if (t < 0.45) {
          const stageProgress = (t - 0.3) / 0.15;
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.2, width * 0.5],
            stageProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.89, height * 0.71],
            stageProgress
          );
        } else if (t < 0.6) {
          const stageProgress = (t - 0.45) / 0.15;
          const easedProgress = Phaser.Math.Easing.Sine.Out(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.5, width * 0.88],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.71, height * 0.07],
            easedProgress
          );
        } else if (t < 0.8) {
          const stageProgress = (t - 0.6) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.88, width * 0.93],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.07, height * 0.35],
            easedProgress
          );
        } else {
          const stageProgress = (t - 0.8) / 0.2;
          const easedProgress = Phaser.Math.Easing.Sine.InOut(stageProgress);
          x = Phaser.Math.Interpolation.Linear(
            [width * 0.93, width * 0.88],
            easedProgress
          );
          y = Phaser.Math.Interpolation.Linear(
            [height * 0.35, height * 0.07],
            easedProgress
          );
        }
        break;
    }
    this.aviatorJet.setPosition(x, y);

    this.drawBezierCurve(t);

    this.progress += 0.001;

    if (time - this.lastUpdateTime > 100) {
      this.multiplier += 0.01;
      this.text.setText(this.multiplier.toFixed(2) + "X");
      this.lastUpdateTime = time;
    }
  }

  drawBezierCurve(progress) {
    const segments = 100;
    const curvePoints = [];
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.bezierGraphics.clear();
    if (width < 378) {
      this.bezierGraphics.lineStyle(4, 0xe50439, 1);
    } else {
      this.bezierGraphics.lineStyle(4, 0xe50439, 1);
    }

    let startPoint;

    switch (true) {
      case width <= 320:
        startPoint = new Phaser.Math.Vector2(width * 0.04, height * 0.885);
        break;
      case width <= 333:
        startPoint = new Phaser.Math.Vector2(width * 0.09, height * 0.9);
        break;
      case width <= 348:
        startPoint = new Phaser.Math.Vector2(width * 0.09, height * 0.87);
        break;
      case width <= 363:
        startPoint = new Phaser.Math.Vector2(width * 0.083, height * 0.858);
        break;
      case width <= 378:
        startPoint = new Phaser.Math.Vector2(width * 0.083, height * 0.89);
        break;
      case width <= 402:
        startPoint = new Phaser.Math.Vector2(width * 0.038, height * 0.99);
        break;
      case width <= 413:
        startPoint = new Phaser.Math.Vector2(width * 0.075, height * 0.87);
        break;
      case width <= 463:
        startPoint = new Phaser.Math.Vector2(width * 0.04, height * 0.99);
        break;
      case width <= 588:
        startPoint = new Phaser.Math.Vector2(width * 0.057, height * 0.865);
        break;
      case width <= 840:
        startPoint = new Phaser.Math.Vector2(width * 0.029, height * 0.99);
        break;
      case width <= 880:
        startPoint = new Phaser.Math.Vector2(width * 0.039, height * 0.93);
        break;
      case width <= 950:
        startPoint = new Phaser.Math.Vector2(width * 0.035, height * 0.936);
        break;
      case width <= 1010:
        startPoint = new Phaser.Math.Vector2(width * 0.03, height * 0.935);
        break;
      default:
        startPoint = new Phaser.Math.Vector2(width * 0.015, height * 0.99);
        break;
    }

    let controlPoints;

    switch (true) {
      case width <= 320:
        if (progress < 0.33) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.899),
            new Phaser.Math.Vector2(width * 0.17, height * 0.875),
            new Phaser.Math.Vector2(width * 0.7, height * 0.1),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.899),
            new Phaser.Math.Vector2(width * 0.17, height * 0.875),
            new Phaser.Math.Vector2(width * 0.7, height * 0.1),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        }
        break;
      case width <= 333:
        if (progress < 0.15) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.9),
            new Phaser.Math.Vector2(width * 0.1, height * 0.9),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.15, height * 0.9),
            new Phaser.Math.Vector2(width * 0.22, height * 0.89),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        }
        break;
      case width <= 348:
        if (progress < 0.3) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.87),
            new Phaser.Math.Vector2(width * 0.1, height * 0.87),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.18, height * 0.87),
            new Phaser.Math.Vector2(width * 0.22, height * 0.87),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        }
        break;
      case width <= 363:
        if (progress < 0.3) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.858),
            new Phaser.Math.Vector2(width * 0.1, height * 0.858),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else if (progress < 0.33) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.2, height * 0.858),
            new Phaser.Math.Vector2(width * 0.2, height * 0.84),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.2, height * 0.858),
            new Phaser.Math.Vector2(width * 0.3, height * 0.79),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        }
        break;
      case width <= 378:
        if (progress < 0.2) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.89),
            new Phaser.Math.Vector2(width * 0.1, height * 0.89),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.45),
          ];
        } else if (progress < 0.32) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.17, height * 0.89),
            new Phaser.Math.Vector2(width * 0.17, height * 0.88),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.45),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.17, height * 0.89),
            new Phaser.Math.Vector2(width * 0.27, height * 0.84),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.45),
          ];
        }
        break;
      case width <= 402:
        if (progress < 0.3275) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.99),
            new Phaser.Math.Vector2(width * 0.17, height * 0.99),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.99),
            new Phaser.Math.Vector2(width * 0.17, height * 0.99),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        }
        break;
      case width <= 413:
        if (progress < 0.35) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.05, height * 0.87),
            new Phaser.Math.Vector2(width * 0.2, height * 0.87),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.2, height * 0.87),
            new Phaser.Math.Vector2(width * 0.28, height * 0.78),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        }
        break;
      case width <= 463:
        if (progress < 0.33) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.99),
            new Phaser.Math.Vector2(width * 0.17, height * 0.98),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.99),
            new Phaser.Math.Vector2(width * 0.17, height * 0.98),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        }
        break;
      case width <= 588:
        if (progress < 0.3) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.05, height * 0.865),
            new Phaser.Math.Vector2(width * 0.05, height * 0.865),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else if (progress < 0.43) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.865),
            new Phaser.Math.Vector2(width * 0.1, height * 0.86),
            new Phaser.Math.Vector2(width * 0.75, height * 0.1),
            new Phaser.Math.Vector2(width * 0.87, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.15, height * 0.865),
            new Phaser.Math.Vector2(width * 0.45, height * 0.79),
            new Phaser.Math.Vector2(width * 0.8, height * 0.07),
            new Phaser.Math.Vector2(width * 0.9, height * 0.35),
          ];
        }
        break;
      case width <= 840:
        if (progress < 0.15) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.05, height * 0.99),
            new Phaser.Math.Vector2(width * 0.05, height * 0.99),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else if (progress < 0.43) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.15, height * 0.98),
            new Phaser.Math.Vector2(width * 0.15, height * 0.98),
            new Phaser.Math.Vector2(width * 0.75, height * 0.1),
            new Phaser.Math.Vector2(width * 0.87, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.15, height * 0.95),
            new Phaser.Math.Vector2(width * 0.45, height * 0.76),
            new Phaser.Math.Vector2(width * 0.8, height * 0.07),
            new Phaser.Math.Vector2(width * 0.9, height * 0.35),
          ];
        }
        break;
      case width <= 880:
        if (progress < 0.3) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.05, height * 0.93),
            new Phaser.Math.Vector2(width * 0.05, height * 0.93),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else if (progress < 0.41) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.12, height * 0.93),
            new Phaser.Math.Vector2(width * 0.12, height * 0.925),
            new Phaser.Math.Vector2(width * 0.75, height * 0.1),
            new Phaser.Math.Vector2(width * 0.87, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.15, height * 0.94),
            new Phaser.Math.Vector2(width * 0.45, height * 0.76),
            new Phaser.Math.Vector2(width * 0.8, height * 0.07),
            new Phaser.Math.Vector2(width * 0.9, height * 0.35),
          ];
        }
        break;
      case width <= 950:
        if (progress < 0.15) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.05, height * 0.936),
            new Phaser.Math.Vector2(width * 0.05, height * 0.936),
            new Phaser.Math.Vector2(width * 0.7, height * 0.08),
            new Phaser.Math.Vector2(width * 0.85, height * 0.35),
          ];
        } else if (progress < 0.43) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.1, height * 0.936),
            new Phaser.Math.Vector2(width * 0.13, height * 0.93),
            new Phaser.Math.Vector2(width * 0.75, height * 0.1),
            new Phaser.Math.Vector2(width * 0.87, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.15, height * 0.94),
            new Phaser.Math.Vector2(width * 0.45, height * 0.76),
            new Phaser.Math.Vector2(width * 0.8, height * 0.07),
            new Phaser.Math.Vector2(width * 0.9, height * 0.35),
          ];
        }
        break;
      case width <= 1010:
        if (progress < 0.3) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.05, height * 0.9315),
            new Phaser.Math.Vector2(width * 0.05, height * 0.935),
            new Phaser.Math.Vector2(width * 0.75, height * 0.1),
            new Phaser.Math.Vector2(width * 0.87, height * 0.35),
          ];
        } else if (progress < 0.43) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.08, height * 0.9315),
            new Phaser.Math.Vector2(width * 0.1, height * 0.9315),
            new Phaser.Math.Vector2(width * 0.75, height * 0.1),
            new Phaser.Math.Vector2(width * 0.87, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.15, height * 0.9315),
            new Phaser.Math.Vector2(width * 0.45, height * 0.7625),
            new Phaser.Math.Vector2(width * 0.8, height * 0.07),
            new Phaser.Math.Vector2(width * 0.9, height * 0.35),
          ];
        }

        break;
      default:
        if (progress < 0.15) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.05, height * 0.99),
            new Phaser.Math.Vector2(width * 0.05, height * 0.99),
            new Phaser.Math.Vector2(width * 0.75, height * 0.1),
            new Phaser.Math.Vector2(width * 0.87, height * 0.35),
          ];
        } else if (progress < 0.43) {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.05, height * 0.99),
            new Phaser.Math.Vector2(width * 0.05, height * 0.99),
            new Phaser.Math.Vector2(width * 0.75, height * 0.1),
            new Phaser.Math.Vector2(width * 0.87, height * 0.35),
          ];
        } else {
          controlPoints = [
            new Phaser.Math.Vector2(width * 0.05, height * 0.99),
            new Phaser.Math.Vector2(width * 0.05, height * 0.99),
            new Phaser.Math.Vector2(width * 0.75, height * 0.07),
            new Phaser.Math.Vector2(width * 0.87, height * 0.35),
          ];
        }
        break;
    }

    switch (true) {
      case width <= 588:
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x = Phaser.Math.Interpolation.CubicBezier(
            t,
            startPoint.x,
            controlPoints[0].x,
            controlPoints[1].x,
            this.aviatorJet.x - 35
          );
          const y = Phaser.Math.Interpolation.CubicBezier(
            t,
            startPoint.y,
            controlPoints[0].y,
            controlPoints[1].y,
            this.aviatorJet.y + 20
          );

          curvePoints.push(new Phaser.Math.Vector2(x, y));

          if (i > 0) {
            this.bezierGraphics.lineBetween(
              curvePoints[i - 1].x,
              curvePoints[i - 1].y,
              x,
              y
            );
          }
        }
        this.bezierGraphics.beginPath();
        this.bezierGraphics.moveTo(startPoint.x, startPoint.y);
        curvePoints.forEach((point) => {
          this.bezierGraphics.lineTo(point.x, point.y);
        });
        this.bezierGraphics.lineTo(
          this.aviatorJet.x - 35,
          this.cameras.main.height + 10
        );
        this.bezierGraphics.lineTo(startPoint.x, this.cameras.main.height + 10);
        this.bezierGraphics.closePath();
        this.bezierGraphics.fillStyle(0xff0000, 0.32);
        this.bezierGraphics.fillPath();
        break;
      case width <= 788:
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x = Phaser.Math.Interpolation.CubicBezier(
            t,
            startPoint.x,
            controlPoints[0].x,
            controlPoints[1].x,
            this.aviatorJet.x - 48
          );
          const y = Phaser.Math.Interpolation.CubicBezier(
            t,
            startPoint.y,
            controlPoints[0].y,
            controlPoints[1].y,
            this.aviatorJet.y + 26
          );

          curvePoints.push(new Phaser.Math.Vector2(x, y));

          if (i > 0) {
            this.bezierGraphics.lineBetween(
              curvePoints[i - 1].x,
              curvePoints[i - 1].y,
              x,
              y
            );
          }
        }
        this.bezierGraphics.beginPath();
        this.bezierGraphics.moveTo(startPoint.x, startPoint.y);
        curvePoints.forEach((point) => {
          this.bezierGraphics.lineTo(point.x, point.y);
        });
        this.bezierGraphics.lineTo(
          this.aviatorJet.x - 48,
          this.cameras.main.height - 30
        );
        this.bezierGraphics.lineTo(startPoint.x, this.cameras.main.height - 30);
        this.bezierGraphics.closePath();
        this.bezierGraphics.fillStyle(0xff0000, 0.32);
        this.bezierGraphics.fillPath();
        break;
      case width <= 850:
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x = Phaser.Math.Interpolation.CubicBezier(
            t,
            startPoint.x,
            controlPoints[0].x,
            controlPoints[1].x,
            this.aviatorJet.x - 48
          );
          const y = Phaser.Math.Interpolation.CubicBezier(
            t,
            startPoint.y,
            controlPoints[0].y,
            controlPoints[1].y,
            this.aviatorJet.y + 28
          );

          curvePoints.push(new Phaser.Math.Vector2(x, y));

          if (i > 0) {
            this.bezierGraphics.lineBetween(
              curvePoints[i - 1].x,
              curvePoints[i - 1].y,
              x,
              y
            );
          }
        }
        this.bezierGraphics.beginPath();
        this.bezierGraphics.moveTo(startPoint.x, startPoint.y);
        curvePoints.forEach((point) => {
          this.bezierGraphics.lineTo(point.x, point.y);
        });
        this.bezierGraphics.lineTo(
          this.aviatorJet.x - 48,
          this.cameras.main.height + 10
        );
        this.bezierGraphics.lineTo(startPoint.x, this.cameras.main.height + 10);
        this.bezierGraphics.closePath();
        this.bezierGraphics.fillStyle(0xff0000, 0.32);
        this.bezierGraphics.fillPath();
        break;
      case width <= 950:
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x = Phaser.Math.Interpolation.CubicBezier(
            t,
            startPoint.x,
            controlPoints[0].x,
            controlPoints[1].x,
            this.aviatorJet.x - 56
          );
          const y = Phaser.Math.Interpolation.CubicBezier(
            t,
            startPoint.y,
            controlPoints[0].y,
            controlPoints[1].y,
            this.aviatorJet.y + 31
          );

          curvePoints.push(new Phaser.Math.Vector2(x, y));

          if (i > 0) {
            this.bezierGraphics.lineBetween(
              curvePoints[i - 1].x,
              curvePoints[i - 1].y,
              x,
              y
            );
          }
        }
        this.bezierGraphics.beginPath();
        this.bezierGraphics.moveTo(startPoint.x, startPoint.y);
        curvePoints.forEach((point) => {
          this.bezierGraphics.lineTo(point.x, point.y);
        });
        this.bezierGraphics.lineTo(
          this.aviatorJet.x - 55,
          this.cameras.main.height - 30
        );
        this.bezierGraphics.lineTo(startPoint.x, this.cameras.main.height - 30);
        this.bezierGraphics.closePath();
        this.bezierGraphics.fillStyle(0xff0000, 0.32);
        this.bezierGraphics.fillPath();
        break;
      default:
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x = Phaser.Math.Interpolation.CubicBezier(
            t,
            startPoint.x,
            controlPoints[0].x,
            controlPoints[1].x,
            this.aviatorJet.x - 57
          );
          const y = Phaser.Math.Interpolation.CubicBezier(
            t,
            startPoint.y,
            controlPoints[0].y,
            controlPoints[1].y,
            this.aviatorJet.y + 31
          );

          curvePoints.push(new Phaser.Math.Vector2(x, y));

          if (i > 0) {
            this.bezierGraphics.lineBetween(
              curvePoints[i - 1].x,
              curvePoints[i - 1].y,
              x,
              y
            );
          }
        }
        this.bezierGraphics.beginPath();
        this.bezierGraphics.moveTo(startPoint.x, startPoint.y);
        curvePoints.forEach((point) => {
          this.bezierGraphics.lineTo(point.x, point.y);
        });
        this.bezierGraphics.lineTo(
          this.aviatorJet.x - 55,
          this.cameras.main.height + 10
        );
        this.bezierGraphics.lineTo(startPoint.x, this.cameras.main.height + 10);
        this.bezierGraphics.closePath();
        this.bezierGraphics.fillStyle(0xff0000, 0.32);
        this.bezierGraphics.fillPath();
        break;
    }
  }

  restartAviatorJet() {
    this.tweens.killAll();
    this.bezierGraphics.clear();

    this.aviatorJet.setPosition(
      this.planeDefaultPosition.width,
      this.planeDefaultPosition.height
    );
    this.progress = 0;
    this.text.setText("1.00X");
    this.stopTriggered = true;
  }
}

export { mainScene };
