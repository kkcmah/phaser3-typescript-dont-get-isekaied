import "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "./consts";

interface GameState {
  score: number;
  hiScore: number;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  scoreText: Phaser.GameObjects.Text;
  hiScoreText: Phaser.GameObjects.Text;
  vehicleGenLoop: Phaser.Time.TimerEvent;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  active: boolean;
}

const gameState: GameState = {
  score: 0,
  hiScore: 0,
  player: null,
  scoreText: null,
  hiScoreText: null,
  vehicleGenLoop: null,
  cursors: null,
  active: false,
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {
    this.load.atlasXML(
      "spritesheet_cars",
      "assets/spritesheet_cars.png",
      "assets/spritesheet_cars.xml"
    );
    this.load.atlasXML(
      "spritesheet_characters",
      "assets/spritesheet_characters.png",
      "assets/spritesheet_characters.xml"
    );
  }

  create() {
    gameState.active = true;

    const atlasTextureCars = this.textures.get("spritesheet_cars");
    const carNames = atlasTextureCars.getFrameNames();

    gameState.player = this.physics.add.sprite(
      GAME_WIDTH * 0.5,
      GAME_HEIGHT - 60,
      "spritesheet_characters",
      "man.png"
    );

    this.anims.create({
      key: "run",
      frames: [
        { key: "spritesheet_characters", frame: "man_walk1.png" },
        { key: "spritesheet_characters", frame: "man_walk2.png" },
      ],
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "dead",
      frames: [
        { key: "spritesheet_characters", frame: "man_point.png" },
        { key: "spritesheet_characters", frame: "man_fall.png" },
        { key: "spritesheet_characters", frame: "man_down.png" },
      ],
      frameRate: 5,
      repeat: 0,
    });

    const platforms = this.physics.add.staticGroup();
    const floor = this.add.rectangle(
      GAME_WIDTH * 0.5,
      GAME_HEIGHT,
      GAME_WIDTH,
      50,
      0x0588ed
    );
    platforms.add(floor);

    gameState.scoreText = this.add.text(25, GAME_HEIGHT - 15, "Score: 0", {
      fontSize: "15px",
      color: "#000000",
    });

    gameState.hiScoreText = this.add.text(
      GAME_WIDTH - 100,
      GAME_HEIGHT - 15,
      `Hi: ${gameState.hiScore}`,
      {
        fontSize: "15px",
        color: "#000000",
      }
    );

    gameState.player.setCollideWorldBounds(true);

    this.physics.add.collider(gameState.player, platforms);

    gameState.cursors = this.input.keyboard.createCursorKeys();

    const vehicles = this.physics.add.group();
    vehicles.angle(90);

    function vehicleGen() {
      const xCoord = Math.random() * GAME_WIDTH;
      vehicles.create(
        xCoord,
        10,
        "spritesheet_cars",
        carNames[Phaser.Math.Between(0, carNames.length - 1)]
      ).flipX = Phaser.Math.Between(0, 1);

      if (gameState.score === 300) {
        gameState.vehicleGenLoop.reset({
          delay: 200,
          callback: vehicleGen,
          callbackScope: this,
          loop: true,
        });
      } else if (gameState.score === 1000) {
        gameState.vehicleGenLoop.reset({
          delay: 50,
          callback: vehicleGen,
          callbackScope: this,
          loop: true,
        });
      }
    }

    gameState.vehicleGenLoop = this.time.addEvent({
      delay: 500,
      callback: vehicleGen,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(vehicles, platforms, function (vehicle) {
      vehicle.destroy();
      gameState.score += 10;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
    });

    this.physics.add.collider(gameState.player, vehicles, () => {
      gameState.active = false;
      gameState.vehicleGenLoop.destroy();
      this.physics.pause();
      this.add.text(GAME_WIDTH * 0.5 - 50, GAME_HEIGHT * 0.5, "Game Over", {
        fontSize: "15px",
        color: "#000000",
      });
      this.add.text(
        GAME_WIDTH * 0.5 - 100,
        GAME_HEIGHT * 0.5 + 20,
        "Press Space to Restart",
        {
          fontSize: "15px",
          color: "#000000",
        }
      );

      if (gameState.score > gameState.hiScore) {
        gameState.hiScore = gameState.score;
        gameState.hiScoreText.setText(`Hi: ${gameState.hiScore}`);
      }

      this.input.keyboard.on("keydown-SPACE", () => {
        gameState.score = 0;
        this.scene.restart();
      });

      gameState.player.anims.play("dead");
    });
  }

  update() {
    if (gameState.active) {
      if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-160);
        gameState.player.anims.play("run", true);
        gameState.player.flipX = true;
      } else if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(160);
        gameState.player.anims.play("run", true);
        gameState.player.flipX = false;
      } else {
        gameState.player.setVelocityX(0);
      }

      if (gameState.cursors.up.isDown) {
        gameState.player.setVelocityY(-160);
      } else if (gameState.cursors.down.isDown) {
        gameState.player.setVelocityY(160);
      } else {
        gameState.player.setVelocityY(0);
      }
    }
  }
}
