import { Application, Assets, Sprite } from "pixi.js";
import * as dat from 'dat.gui'
import itmoLogo from "./assets/itmo.png";
import { config } from "./config";
import { Board } from "./entities/board";
import { PlacementService, PlacementType } from "./services/placement_service";
import { CollisionResolver } from "./utils/collision_resolver";
import { meterToPx } from "./utils/px";
import { App } from "./App";

function createBalls(board: Board) {
  const placementService = new PlacementService(board);
  return placementService.getPlacement(PlacementType.TRIANGLE, 10);
}

async function createBoard(app: Application) {
  // Init board
  const boardWidth = config.BOARD_WIDTH_M;
  const boardHeight = config.BOARD_HEIGHT_M;
  const board = new Board(
    boardWidth,
    boardHeight,
    (app.canvas.width - meterToPx(boardWidth)) / 2,
    (app.canvas.height - meterToPx(boardHeight)) / 2,
  );

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

  return board;  
}

async function main() {
  // init html
  const pixiContainer = document.getElementById("pixi");
  if (!pixiContainer) {
    throw new Error("Parent block not found");
  }

  // Physics-Button logic
  document
    .getElementById("switcher-button")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      app.togglePhysics();
      this.classList.toggle("btn-success", app.getPhysics());
      this.classList.toggle("btn-danger", !app.getPhysics());
    });
  
  // Pause-Button logic
  document
    .getElementById("pause-button")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      app.tooglePause();
    });
  
  // Restart-Button logic
  document
    .getElementById("restart-button")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      app.restart();
    });

    const app = new App();
    await app.init(pixiContainer);
    app.run();
    console.log(app.getBoard());
}

main();
