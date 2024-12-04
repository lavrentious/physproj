import { Application, Assets, Sprite } from "pixi.js";
import itmoLogo from "./assets/itmo.png";
import { config } from "./config";
import { Board } from "./entities/board";
import { PlacementService, PlacementType } from "./services/placement_service";
import { CollisionResolver } from "./utils/collision_resolver";
import { meterToPx } from "./utils/px";

async function main() {
  // init html
  const pixiContainer = document.getElementById("pixi");
  if (!pixiContainer) {
    throw new Error("Parent block not found");
  }

  // Button logic
  document
    .getElementById("switcher-button")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      config.SHOW_PHYSICS = !config.SHOW_PHYSICS;
      this.classList.toggle("btn-success", config.SHOW_PHYSICS);
      this.classList.toggle("btn-danger", !config.SHOW_PHYSICS);
    });

  // App init
  const app = new Application();
  await app.init({ background: "#999999", resizeTo: pixiContainer });
  app.ticker.maxFPS = 60;
  pixiContainer.appendChild(app.canvas);

  // Board init
  const boardWidth = config.BOARD_WIDTH_M;
  const boardHeight = config.BOARD_HEIGHT_M;
  const board = new Board(
    boardWidth,
    boardHeight,
    (app.canvas.width - meterToPx(boardWidth)) / 2,
    (app.canvas.height - meterToPx(boardHeight)) / 2,
  );
  app.stage.addChild(board.getGraphics());

  // Add board background
  const itmoTexture = await Assets.load(itmoLogo);
  const background = new Sprite(itmoTexture);
  background.x = board.getLeftWallX();
  background.y = board.getTopWallY();

  const scalingFactor = 0.4;
  const originalBackgroundWidth = background.width;
  const originalBackgroundHeight = background.height;
  const newBackgroundWidth = meterToPx(board.getWidth()) * scalingFactor;
  const newBackgroundHeight =
    (newBackgroundWidth / originalBackgroundWidth) * originalBackgroundHeight;

  background.width = newBackgroundWidth;
  background.height = newBackgroundHeight;
  background.x =
    board.getLeftWallX() + (meterToPx(board.getWidth()) - background.width) / 2;
  background.y =
    board.getTopWallY() +
    (meterToPx(board.getHeight()) - background.height) / 2 -
    15;
  board.getGraphics().addChild(background);

  // Placing balls on board
  const placementService = new PlacementService(board);
  const ballsList = placementService.getPlacement(PlacementType.TRIANGLE, 36);
  board.addBalls(ballsList);

  // Main loop
  const collisionResolver = new CollisionResolver();
  app.ticker.add((time) => {
    // Updaing balls every frame
    ballsList.forEach((ball) => {
      ball.update(time.deltaTime);
    });

    // Resoling collisions
    collisionResolver.resolveBallBoardCollision(board, ballsList);
    collisionResolver.resolveBallsCollision(ballsList);
  });
}

main();
