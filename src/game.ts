import "phaser";
import StartScene from "./startScene";
import GameScene from "./gameScene";
import { GAME_WIDTH, GAME_HEIGHT } from "./consts";

export const config = {
  type: Phaser.AUTO,
  backgroundColor: "#dddddd",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 200 },
      enableBody: true,
    },
  },
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [StartScene, GameScene],
};

const game = new Phaser.Game(config);
