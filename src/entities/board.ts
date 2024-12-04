import { Graphics } from "pixi.js";
import { poolColors } from "../utils/colors";
import { meterToPx } from "../utils/px";
import { Vector2D } from "../utils/vector2d";
import { Ball } from "./ball";
export class Board {
  private width: number;
  private height: number;
  private graphics: Graphics;

  private leftTopXPx: number;
  private leftTopYPx: number;

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
    this.graphics = new Graphics()
      .rect(
        leftTopXPx,
        leftTopYPx,
        meterToPx(this.width),
        meterToPx(this.height),
      )
      .stroke({
        color: poolColors.tableBorder,
        width: 15,
        alignment: 0,
      })
      .fill(poolColors.table);
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

  isCollided(ball: Ball): Vector2D {
    const resultingRedirectionVector = new Vector2D(1, 1);
    if (meterToPx(ball.position.x + ball.radius) >= this.getRightWallX()) {
      resultingRedirectionVector.x = -1;
    }
    if (meterToPx(ball.position.x - ball.radius) <= this.getLeftWallX()) {
      resultingRedirectionVector.x = -1;
    }
    if (meterToPx(ball.position.y + ball.radius) >= this.getBottomWallY()) {
      resultingRedirectionVector.y = -1;
    }
    if (meterToPx(ball.position.y - ball.radius) <= this.getTopWallY()) {
      resultingRedirectionVector.y = -1;
    }

    return resultingRedirectionVector;
  }
}
