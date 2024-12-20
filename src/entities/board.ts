import { FederatedPointerEvent, Graphics } from "pixi.js";
import { config } from "../config";
import { poolColors, strikeColor } from "../utils/colors";
import { meterToPx, pxToMeter } from "../utils/px";
import { Vector2D } from "../utils/vector2d";
import { Ball } from "./ball";
import { Hole } from "./hole";

export class Board {
  private width: number;
  private height: number;
  private graphics: Graphics;

  private leftTopXPx: number;
  private leftTopYPx: number;

  balls: Set<Ball>;
  holes: Hole[];

  // drag
  private dragStart: Vector2D | null = null; // in pixels
  private dragEnd: Vector2D | null = null; // in pixels
  private dragPreview: Graphics | null = null;
  private draggedBall: Ball | null = null;

  constructor(
    width: number,
    height: number,
    leftTopXPx: number,
    leftTopYPx: number,
  ) {
    this.leftTopXPx = leftTopXPx;
    this.leftTopYPx = leftTopYPx;

    this.width = width;
    this.height = height;

    this.balls = new Set<Ball>();
    this.holes = [
      new Hole(
        new Vector2D(pxToMeter(this.leftTopXPx), pxToMeter(this.leftTopYPx)),
        config.HOLE_RADIUS_M,
      ),
      new Hole(
        new Vector2D(
          pxToMeter(this.leftTopXPx) + this.width,
          pxToMeter(this.leftTopYPx) + this.height,
        ),
        config.HOLE_RADIUS_M,
      ),
      new Hole(
        new Vector2D(
          pxToMeter(this.leftTopXPx),
          pxToMeter(this.leftTopYPx) + this.height,
        ),
        config.HOLE_RADIUS_M,
      ),
      new Hole(
        new Vector2D(
          pxToMeter(this.leftTopXPx) + this.width,
          pxToMeter(this.leftTopYPx),
        ),
        config.HOLE_RADIUS_M,
      ),
      new Hole(
        new Vector2D(
          pxToMeter(this.leftTopXPx) + this.width / 2,
          pxToMeter(this.leftTopYPx + 8) + this.height,
        ),
        config.HOLE_RADIUS_M,
      ),
      new Hole(
        new Vector2D(
          pxToMeter(this.leftTopXPx) + this.width / 2,
          pxToMeter(this.leftTopYPx - 8),
        ),
        config.HOLE_RADIUS_M,
      ),
    ];

    this.graphics = new Graphics()
      .roundRect(
        leftTopXPx,
        leftTopYPx,
        meterToPx(this.width),
        meterToPx(this.height),
        10,
      )
      .stroke({
        color: poolColors.tableBorder,
        width: 36,
        alignment: 0,
      })
      .fill(poolColors.table);

    // draw holes
    for (const hole of this.holes) {
      this.graphics = this.graphics
        .circle(
          meterToPx(hole.coords.x),
          meterToPx(hole.coords.y),
          meterToPx(hole.radius),
        )
        .fill(poolColors.tableBorder);

      this.graphics = this.graphics
        .circle(
          meterToPx(hole.coords.x),
          meterToPx(hole.coords.y),
          meterToPx(hole.radius * 0.85),
        )
        .fill("#2F1915");

      this.graphics = this.graphics
        .circle(
          meterToPx(hole.coords.x),
          meterToPx(hole.coords.y),
          meterToPx(hole.radius * 0.7),
        )
        .fill("#290B05");
    }

    this.graphics.interactive = true;
    this.graphics.on("pointermove", (event) => this.onDragMove(event));
    this.graphics.on("pointerup", (event) => this.onDragEnd(event));
    this.graphics.on("pointerleave", () => this.dragReset());
  }

  processHoleCollision(ball: Ball) {
    for (const hole of this.holes) {
      // console.log(Math.hypot(hole.coords.x - ball.position.x, hole.coords.y - ball.position.y));
      if (
        Math.hypot(
          hole.coords.x - ball.position.x,
          hole.coords.y - ball.position.y,
        ) < hole.radius
      ) {
        this.removeBall(ball);
      }
    }
  }

  getLeftWallX() {
    return this.leftTopXPx;
  }

  getRightWallX() {
    return this.leftTopXPx + meterToPx(this.width);
  }
  getTopWallY() {
    return this.leftTopYPx;
  }
  getBottomWallY() {
    return this.leftTopYPx + meterToPx(this.height);
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getGraphics() {
    return this.graphics;
  }

  addBall(ball: Ball) {
    this.balls.add(ball);

    const ballGraphics = ball.getGraphics();
    ballGraphics.interactive = true;
    ballGraphics.on("pointerdown", (event) => this.onDragStart(ball, event));
    ballGraphics.on("pointermove", (event) => this.onDragMove(event, ball));
    ballGraphics.on("pointerup", (event) => this.onDragEnd(event));

    this.graphics.addChild(ballGraphics);
    ballGraphics.addChild(ball.getInfoGraphics());
    this.graphics.addChild(ball.getInfoGraphics());
  }

  addBalls(balls: Ball[]) {
    for (const ball of balls) {
      this.addBall(ball);
    }
  }

  removeBall(ball: Ball) {
    this.balls.delete(ball);
    this.graphics.removeChild(ball.getGraphics());
    this.graphics.removeChild(ball.getInfoGraphics());
  }

  removeBalls() {
    this.balls.forEach((ball) => {
      this.removeBall(ball);
    });
  }

  getBalls() {
    return this.balls;
  }

  getBallsList() {
    return Array.from(this.balls);
  }

  processCollision(ball: Ball): Vector2D {
    const redirectionVector = new Vector2D(1, 1);
    if (meterToPx(ball.position.x + ball.radius) >= this.getRightWallX()) {
      ball.position.x = pxToMeter(this.getRightWallX()) - ball.radius;
      redirectionVector.x = -1;
    }
    if (meterToPx(ball.position.x - ball.radius) <= this.getLeftWallX()) {
      ball.position.x = pxToMeter(this.getLeftWallX()) + ball.radius;
      redirectionVector.x = -1;
    }
    if (meterToPx(ball.position.y + ball.radius) >= this.getBottomWallY()) {
      ball.position.y = pxToMeter(this.getBottomWallY()) - ball.radius;
      redirectionVector.y = -1;
    }
    if (meterToPx(ball.position.y - ball.radius) <= this.getTopWallY()) {
      ball.position.y = pxToMeter(this.getTopWallY()) + ball.radius;
      redirectionVector.y = -1;
    }

    return redirectionVector;
  }

  // drag
  private onDragStart(ball: Ball, event: FederatedPointerEvent) {
    if (ball.velocity.magnitude() !== 0) {
      return;
    }
    this.draggedBall = ball;
    this.dragStart = new Vector2D(
      meterToPx(ball.position.x),
      meterToPx(ball.position.y),
    );
    this.dragPreview = new Graphics()
      .moveTo(this.dragStart.x, this.dragStart.y)
      .lineTo(this.dragStart.x, this.dragStart.y)
      .stroke({
        color: 0xeeeeee,
        width: 5,
        alignment: 0,
      });
    this.graphics.addChild(this.dragPreview);
  }

  private onDragMove(event: FederatedPointerEvent, ball?: Ball) {
    if (!this.draggedBall || !this.dragStart) {
      return;
    }
    if (this.draggedBall.velocity.magnitude() !== 0) {
      this.dragReset();
      return;
    }
    const { x, y } = event.global;
    const maxPixels = meterToPx(config.MAX_DISTANCE_METRES);
    this.dragEnd = new Vector2D(x, y);
    if (this.dragEnd.subtract(this.dragStart).magnitude() > maxPixels) {
      this.dragEnd = this.dragStart.add(
        this.dragStart
          .subtract(this.dragEnd)
          .scale(
            -maxPixels / this.dragStart.subtract(this.dragEnd).magnitude(),
          ),
      );
    }
    this.renderDragPreview();
  }

  private onDragEnd(event: FederatedPointerEvent) {
    if (!this.draggedBall || this.draggedBall.velocity.magnitude() !== 0)
      return;

    if (this.dragStart && this.dragEnd) {
      const dragVectorPx = this.dragStart.subtract(this.dragEnd);
      const dragVector = new Vector2D(
        pxToMeter(dragVectorPx.x),
        pxToMeter(dragVectorPx.y),
      );
      const multiplier = -0.5 * Math.log(1 + dragVector.magnitude());

      this.draggedBall.velocity = dragVector.scale(multiplier);
    }

    this.dragReset();
  }

  dragReset() {
    this.draggedBall = null;
    this.dragStart = null;
    this.dragEnd = null;
    if (this.dragPreview) {
      this.graphics.removeChild(this.dragPreview);
      this.dragPreview.clear();
      this.dragPreview = null;
    }
  }

  renderDragPreview() {
    if (!this.dragStart || !this.dragEnd || !this.dragPreview) return;
    this.dragPreview.clear();
    this.dragPreview.moveTo(this.dragStart.x, this.dragStart.y);
    this.dragPreview.lineTo(this.dragEnd.x, this.dragEnd.y);
    this.dragPreview.stroke({
      color: strikeColor(
        this.dragEnd.subtract(this.dragStart).magnitude(),
        meterToPx(config.MAX_DISTANCE_METRES),
      ),
      width: 3,
      alignment: 0,
    });
  }
}
