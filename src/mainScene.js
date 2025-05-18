import { Scene } from "phaser";

class mainScene extends Scene {
  constructor() {
    super({
      key: "mainScene",
    });
    this.aviatorJet = null;
    this.trailGraphics = null;
    this.trailPoints = [];
  }

  preload() {
    this.load.spritesheet("aviator", "/sprite3.png", {
      frameWidth: 300 / 2,
      frameHeight: 71 / 1,
    });
    this.load.image("bgR", "/bgSun.svg");
    this.load.image("bgbright", "/blur.svg");
  }

  create() {
    let bg = this.add.image(-1, 500, "bgR");
    this.aviatorJet = this.add.sprite(0, 499, "aviator");
    this.anims.create({
      key: "aviators",
      frames: this.anims.generateFrameNumbers("aviator", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // this.aviatorJet.play("aviators");

    let points = [
      new Phaser.Math.Vector2(0, 500),
      new Phaser.Math.Vector2(150, 480),
      new Phaser.Math.Vector2(300, 445),
      new Phaser.Math.Vector2(450, 390),
      new Phaser.Math.Vector2(600, 310),
      new Phaser.Math.Vector2(700, 230),
    ];

    this.path = new Phaser.Curves.Path(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.path.lineTo(points[i].x, points[i].y);
    }

    this.aviatorJet.setPosition(points[0].x, points[0].y);

    this.tweens.add({
      targets: this.aviatorJet,
      duration: 3000,
      ease: "Linear",
      repeat: 0,
      onUpdate: (tween) => {
        let t = tween.progress;
        let pos = this.path.getPoint(t);
        this.aviatorJet.setPosition(pos.x, pos.y);
      },
    });

    this.trailGraphics = this.add.graphics();
    this.trailGraphics.lineStyle(3, 0xff0044, 1);
    this.trailPoints = [];

    this.multiplier = 1;
    this.text = this.add.text(450, 230, "1.00X", {
      font: "bold 70px Arial",
      color: "#ffffff",
    });

    this.lastUpdateTime = 0;

    let randomStopTime = Phaser.Math.Between(0, 10000);

    this.stopTriggered = true;

    this.time.delayedCall(randomStopTime, () => {
      this.stopTriggered = true;

      this.trailGraphics.clear();
      this.trailPoints = [];
    });

    let resetButton = this.add
      .text(20, 20, "Reset", {
        font: "bold 28px Arial",
        fill: "#ffffff",
        backgroundColor: "#f00f00",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .setDepth(10)
      .on("pointerdown", () => {
        this.tweens.killAll();
        this.aviatorJet.setPosition(0, 489);
        this.aviatorJet.anims.stop();
        this.aviatorJet.setFrame(0);
        this.trailGraphics.clear();
        this.trailPoints = [];

        this.multiplier = 1;
        this.text.setText("1.00X");

        this.stopTriggered = true;
      });

    this.add
      .text(130, 20, "Start", {
        font: "bold 30px Arial",
        color: "#ffffff",
        backgroundColor: "#ff0044",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.stopTriggered = false;
        let light = this.add.image(500, 250, "bgbright").setScale(1.2);
        this.aviatorJet.play("aviators");

        this.curvePoints = [
          new Phaser.Math.Vector2(0, 500),
          new Phaser.Math.Vector2(150, 480),
          new Phaser.Math.Vector2(300, 445),
          new Phaser.Math.Vector2(450, 390),
          new Phaser.Math.Vector2(600, 310),
          new Phaser.Math.Vector2(700, 230),
        ];

        this.path = new Phaser.Curves.Spline(this.curvePoints);

        this.aviatorJet.setPosition(
          this.curvePoints[0].x,
          this.curvePoints[0].y
        );

        this.trailPoints = [];
        this.trailGraphics.clear();

        let trailPointCollector = { t: 0 };

        this.tweens.add({
          targets: { t: 0 },
          t: 1,
          duration: 3000,
          onUpdate: (tween) => {
            const t = tween.getValue();
            const point = this.path.getPoint(t);
            this.aviatorJet.setPosition(point.x, point.y);
          },
        });

        let bgT = this.tweens.add({
          targets: bg,
          angle: 360,
          duration: 50000,
          ease: "Linear",
          repeat: -1,
        });

        let newStopTime = Phaser.Math.Between(2000, 10000);
        this.time.delayedCall(newStopTime, () => {
          this.stopTriggered = true;
          this.tweens.add({
            targets: this.aviatorJet,
            x: 1900,
            y: 100,
            duration: 600,
          });
          this.trailGraphics.clear();
          this.trailPoints = [];

          this.multiplier = 1;
          this.text.setText("1.00X");
          this.tweens.killTweensOf(bg);

          light.destroy();
        });
      });

    let crashButton = this.add
      .text(230, 20, "FLY", {
        font: "bold 28px Arial",
        fill: "#ffffff",
        backgroundColor: "#ff0044",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .setDepth(10)
      .on("pointerdown", () => {
        this.tweens.add({
          targets: this.aviatorJet,
          x: 1900,
          y: 150,
          duration: 600,
        });

        this.trailGraphics.clear();
        this.trailPoints = [];
      });
  }

  update(time) {
    const jet = this.aviatorJet;

    if (this.stopTriggered) {
      return;
    }

    if (
      jet &&
      (this.trailPoints.length === 0 ||
        !Phaser.Math.Fuzzy.Equal(jet.x, jet.y, 1))
    ) {
      this.trailPoints.push(new Phaser.Math.Vector2(jet.x, jet.y));
    }
    if (this.trailPoints.length > 1) {
      this.trailGraphics.clear();

      this.trailGraphics.lineStyle(3, 0xff0044, 1);
      this.trailGraphics.beginPath();
      this.trailGraphics.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);

      for (let i = 1; i < this.trailPoints.length; i++) {
        this.trailGraphics.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
      }

      this.trailGraphics.strokePath();

      const start = this.trailPoints[0];
      const end = this.trailPoints[this.trailPoints.length - 1];
      const baseY = 500;

      this.trailGraphics.fillStyle(0xff0044, 0.3);
      this.trailGraphics.moveTo(start.x, start.y);
      for (let i = 1; i < this.trailPoints.length; i++) {
        this.trailGraphics.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
      }
      this.trailGraphics.lineTo(end.x, 700);
      this.trailGraphics.lineTo(start.x, 700);
      this.trailGraphics.fillPath();
    }

    if (time - this.lastUpdateTime > 100) {
      this.multiplier += 0.03;
      this.text.setText(this.multiplier.toFixed(2) + "X");
      this.lastUpdateTime = time;
    }
  }
}

export { mainScene };
