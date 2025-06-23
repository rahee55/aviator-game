import Phaser from "phaser";
import { mainScene } from "./mainScene.js";

let screenType = "desktop";

switch (true) {
  case window.innerWidth < 500:
    screenType = "mobile";
    break;
}


let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: 500,
  backgroundColor: 0x000000,
  scene: [mainScene],
};

if (screenType === "mobile") {
  config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: 500,
    backgroundColor: 0x000000,
    scene: [mainScene],
  };
}

export { config };
