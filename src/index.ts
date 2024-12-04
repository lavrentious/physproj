import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { config } from "./config";
import { Ball } from "./entities/ball";
import { Board } from "./entities/board";
import { CollisionResolver } from "./utils/collision_resolver";
import { poolColors } from "./utils/colors";
import { meterToPx, pxToMeter } from "./utils/px";
import { Vector2D } from "./utils/vector2d";

async function main() {
  // init app
  const app = new Application();
  function addLabels() {
    // add labels on canvas that show meters
    const labelStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#ffffff",
      stroke: "#000000",
    });
    const labelLeft = new PIXI.Text("0m", labelStyle);
    labelLeft.anchor.set(0, 0.5);
    labelLeft.x = 10;
    labelLeft.y = app.canvas.height / 2;
    app.stage.addChild(labelLeft);

    const labelRight = new PIXI.Text(
      `${pxToMeter(app.canvas.width).toFixed(1)}m`,
      labelStyle,
    );
    labelRight.anchor.set(1, 0.5);
    labelRight.x = app.canvas.width - 10;
    labelRight.y = app.canvas.height / 2;
    app.stage.addChild(labelRight);
  }
  await app.init({ background: "#999999", resizeTo: window });
  app.ticker.maxFPS = 120;
  document.body.appendChild(app.canvas);

  const ball = new Ball(
    1,
    new Vector2D(
      pxToMeter(app.canvas.width / 2) - 0.3,
      pxToMeter(app.canvas.height / 2) - 0.025,
    ),
    config.BALL_MASS_KG,
    poolColors.balls[0],
    config.BALL_RADIUS_M,
  );

  const ball2 = new Ball(
    2,
    new Vector2D(
      pxToMeter(app.canvas.width / 2) + 0.2,
      pxToMeter(app.canvas.height / 2),
    ),
    config.BALL_MASS_KG,
    poolColors.balls[0],
    config.BALL_RADIUS_M,
  );

  ball.velocity = new Vector2D(-0.01, 0.0);
  ball2.velocity = new Vector2D(-0.025, -0.001);

  const boardWidth = 2.84; // meters
  const boardHeight = 1.42; // meters
  const board = new Board(
    boardWidth,
    boardHeight,
    (app.canvas.width - meterToPx(boardWidth)) / 2,
    (app.canvas.height - meterToPx(boardHeight)) / 2,
  );

  app.stage.addChild(board.getGraphics());
  app.stage.addChild(ball.getGraphics());
  app.stage.addChild(ball2.getGraphics());

  const collisionResolver = new CollisionResolver();

  app.ticker.add((time) => {
    ball.update(time.deltaTime);
    ball2.update(time.deltaTime);

    collisionResolver.resolveBallBoardCollision(
      board,
      [ball, ball2],
      (ball, redirectionVector) => {
        ball.velocity = new Vector2D(
          redirectionVector.x * ball.velocity.x,
          redirectionVector.y * ball.velocity.y,
        );
      },
    );

    collisionResolver.resolveBallsCollision([ball, ball2], (ball1, ball2) => {
      console.log("collided");
      ball1.collide(ball2);
    });
  });

  addLabels();
}

main();
