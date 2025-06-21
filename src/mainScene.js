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

    this.bezierGraphics = this.add.graphics();
    this.trailGraphics = this.add.graphics();
    this.trailGraphics.lineStyle(3, 0xff0044, 1);

    const textStyle = {
      font: "bold 70px Arial",
      fill: "#ffffff",
    };

    if (this.screenType === "mobile") {
      this.text = this.add.text(150, 230, "1.00X", textStyle).setScale(0.9);
      this.aviatorJet = this.add.sprite(50, 474, "vimaan_1").setScale(0.7);
      this.add.image(200, 250, "bgbright").setScale(1.2);
    } else {
      this.text = this.add.text(450, 230, "1.00X", textStyle);
      this.aviatorJet = this.add.sprite(80, 434, "vimaan_1");
      this.add.image(500, 250, "bgbright").setScale(1.2);
    }

    this.aviatorJet.play("aviatorsJ");
    this.lastUpdateTime = 0;
    this.stopTriggered = true;

    this.add.text(130, 20, "Start", {
      font: "bold 30px Arial",
      fill: "#ffffff",
      backgroundColor: "#ff0044",
      padding: { x: 10, y: 5 },
    }).setInteractive().on("pointerdown", () => this.startFlight(bg));

    this.add.text(20, 20, "Reset", {
      font: "bold 28px Arial",
      fill: "#ffffff",
      backgroundColor: "#f00f00",
      padding: { x: 10, y: 5 },
    }).setInteractive().on("pointerdown", () => this.scene.restart());

    this.add.text(230, 20, "Fly", {
      font: "bold 28px Arial",
      fill: "#ffffff",
      backgroundColor: "#ff0044",
      padding: { x: 10, y: 5 },
    }).setInteractive().on("pointerdown", () => {
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
      this.trailGraphics.clear();
    });
  }

  startFlight(bg) {
    this.stopTriggered = false;
    const startX = this.screenType === "mobile" ? 50 : 80;
    const startY = this.screenType === "mobile" ? 474 : 434;
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
    this.trailGraphics.clear();

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
      this.trailGraphics.clear();
      this.text.setFill("#F00F00");
      this.tweens.killTweensOf(bg);
    });
  }

  update(time) {
    if (this.stopTriggered) return;

    this.progress += 0.001;
    this.drawBezierCurve(this.progress);

    if (time - this.lastUpdateTime > 100) {
      this.multiplier += 0.03;
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
    this.bezierGraphics.lineStyle(4, 0xe50439, 1);

    const startPoint = new Phaser.Math.Vector2(width * 0.039, height * 0.925);
    const cp1 = new Phaser.Math.Vector2(width * 0.15, height * 0.95);
    const cp2 = new Phaser.Math.Vector2(width * 0.45, height * 0.76);
    const endPoint = new Phaser.Math.Vector2(this.aviatorJet.x - 48, this.aviatorJet.y + 28);

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = Phaser.Math.Interpolation.CubicBezier(t, startPoint.x, cp1.x, cp2.x, endPoint.x);
      const y = Phaser.Math.Interpolation.CubicBezier(t, startPoint.y, cp1.y, cp2.y, endPoint.y);
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
    curvePoints.forEach((pt) => this.bezierGraphics.lineTo(pt.x, pt.y));
    this.bezierGraphics.lineTo(endPoint.x, height - 30);
    this.bezierGraphics.lineTo(startPoint.x, height - 30);
    this.bezierGraphics.closePath();
    this.bezierGraphics.fillStyle(0xff0000, 0.32);
    this.bezierGraphics.fillPath();
  }
}

export { mainScene };