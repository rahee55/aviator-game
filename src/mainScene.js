import { Scene } from "phaser";

class mainScene extends Scene {
  constructor() {
    super({
      key: "mainScene",
    });
    this.aviatorJet = null;
    this.trailGraphics = null;
    this.trailPoints = [];
    this.vimaan = null;
  }

  preload() {
    this.load.spritesheet("aviator", "/sprite2.png", {
      frameWidth: 200 / 2,
      frameHeight: 48 / 1,
    });
    this.load.image("bgR", "/bgSun.svg");
    this.load.image("bgbright", "/blur.svg");

    this.load.image(`vimaan_1`, `/vimaan1.svg`);
    this.load.image(`vimaan_2`, `/vimaan2.svg`);
  }

  create() {
    let bg = this.add.image(-1, 500, "bgR");

    this.anims.create({
      key: "aviators",
      frames: [{ key: "vimaan_1" }, { key: "vimaan_2" }],
      frameRate: 10,
      repeat: -1,
    });

    this.aviatorJet = this.add.sprite(80, 459, "vimaan_1");
    this.aviatorJet.play("aviators");

    this.tweens.add({
      targets: this.aviatorJet,
      duration: 4000,
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

    let randomStopTime = Phaser.Math.Between(20000, 60000);

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

        this.aviatorJet.setPosition(80, 459);
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
          new Phaser.Math.Vector2(70, 464),
          new Phaser.Math.Vector2(220, 449),
          new Phaser.Math.Vector2(370, 414),
          new Phaser.Math.Vector2(520, 359),
          new Phaser.Math.Vector2(670, 269),
          new Phaser.Math.Vector2(770, 189),
        ];

        this.path = new Phaser.Curves.Spline(this.curvePoints);

        this.aviatorJet.setPosition(
          this.curvePoints[0].x,
          this.curvePoints[0].y
        );

        this.trailPoints = [];
        this.trailGraphics.clear();

        let hasReachedEnd = false;

        this.tweens.add({
          targets: { t: 0 },
          t: 1,
          duration: 4000,
          onUpdate: (tween) => {
            const t = tween.getValue();
            const point = this.path.getPoint(t);
            this.aviatorJet.setPosition(point.x, point.y);

            if (t >= 1 && !hasReachedEnd) {
              hasReachedEnd = true;

              this.tweens.add({
                targets: this.aviatorJet,
                y: "+=150",
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut",
              });
            }
          },
        });

        let bgT = this.tweens.add({
          targets: bg,
          angle: 360,
          duration: 50000,
          ease: "Linear",
          repeat: -1,
        });

        let newStopTime = Phaser.Math.Between(20000, 60000);
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
      .text(230, 20, "Fly", {
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
          duration: 600
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
      this.trailPoints.push(new Phaser.Math.Vector2(jet.x - 55, jet.y + 31));
    }
    if (this.trailPoints.length > 1) {
      this.trailGraphics.clear();

      this.trailGraphics.lineStyle(4, 0xff0044, 1);
      this.trailGraphics.beginPath();
      this.trailGraphics.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);
      for (let i = 1; i < this.trailPoints.length; i++) {
        this.trailGraphics.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
      }

      this.trailGraphics.strokePath();
      const baseY = 700;
      this.trailGraphics.fillStyle(0xff0044, 0.3);
      this.trailGraphics.beginPath();
      this.trailGraphics.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);
      for (let i = 1; i < this.trailPoints.length; i++) {
        this.trailGraphics.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
      }

      const last = this.trailPoints[this.trailPoints.length - 1];
      const first = this.trailPoints[0];

      this.trailGraphics.lineTo(last.x, baseY);
      this.trailGraphics.lineTo(first.x, baseY);
      this.trailGraphics.closePath();
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
