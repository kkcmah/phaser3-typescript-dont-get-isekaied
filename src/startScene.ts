import "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "./consts";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("start");
  }

  create() {
    this.add.text(
      GAME_WIDTH * 0.5 - 120,
      GAME_HEIGHT * 0.5 - 80,
      "Don't get isekai'd",
      {
        color: "#000000",
        fontSize: "20px",
      }
    );

    this.add.text(
      GAME_WIDTH * 0.5 - 100,
      GAME_HEIGHT * 0.5 - 20,
      "Arrow keys to move",
      {
        color: "#000000",
        fontSize: "15px",
      }
    );

    const clickStart = this.add.text(
      GAME_WIDTH * 0.5 - 110,
      GAME_HEIGHT * 0.5,
      "Click to start!",
      {
        color: "#000000",
        fontSize: "20px",
      }
    );

    this.tweens.add({
      targets: clickStart,
      scaleX: 1.2,
      scaleY: 1.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.add.text(
      GAME_WIDTH * 0.5 - 300,
      GAME_HEIGHT - 100,
      ["Pixel Car Pack", "Created/distributed by Kenney (www.kenney.nl)"],
      { color: "#000000", fontSize: "15px" }
    );

    this.input.on("pointerdown", () => {
      this.scene.stop("start");
      this.scene.start("game");
    });
  }
}
