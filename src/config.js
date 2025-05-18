import Phaser from "phaser";
import { mainScene } from "./mainScene.js"

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 500,
  backgroundColor: 0x000000,
  scene:[mainScene]
}

export { config }