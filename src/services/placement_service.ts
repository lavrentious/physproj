import { ColorSource } from "pixi.js";
import { config } from "../config";
import { Ball } from "../entities/ball";
import { Board } from "../entities/board";
import { poolColors } from "../utils/colors";
import { meterToPx, pxToMeter } from "../utils/px";
import { Vector2D } from "../utils/vector2d";

export enum PlacementType {
  TRIANGLE,
  RANDOM,
}

export class PlacementService {
  constructor(private board: Board) {}

  public getPlacement(placetype: PlacementType, amount: number): Ball[] {
    let result;
    switch (placetype) {
      case PlacementType.TRIANGLE:
        result = this.getTrianglePlacement(amount);
        break;
      case PlacementType.RANDOM:
        result = this.getRandomPlacement(amount);
        break;
    }
    result.push(this.getStartBall());
    return result;
  }

  public getStartBall(){
    return this.createBall(
      pxToMeter(this.board.getLeftWallX()) + config.BOARD_WIDTH_M / 4, 
      pxToMeter(this.board.getTopWallY()) + config.BOARD_HEIGHT_M / 2, 
      poolColors.cueBallColor
    );
  }

  private getTrianglePlacement(amount: number): Ball[] {
    const OFFSET_M = pxToMeter(4);

    const startPositionPixels = new Vector2D(
        this.board.getLeftWallX() + 3/4 * meterToPx(this.board.getWidth()),
        this.board.getTopWallY() + 1/2 * meterToPx(this.board.getHeight())
    );
    const result = [];

    let curRow = 1;
    let curPos = 1;
    for (let i = 0; i < amount; ++i){
      // create new ball
      const currentBall = this.createBall(
        pxToMeter(startPositionPixels.x) + (curRow - 1) * (2 * config.BALL_RADIUS_M + OFFSET_M),
        pxToMeter(startPositionPixels.y) + (curPos - 1) * (2 * config.BALL_RADIUS_M + OFFSET_M),
        poolColors.balls[i % poolColors.balls.length],
      )
      result.push(currentBall);

      // change row & pos
      curPos++;
      if (curPos > curRow){
        curRow += 1;
        curPos = 1;
        startPositionPixels.y -= meterToPx(config.BALL_RADIUS_M);
      }
    }

    return result;
  }

  private getRandomPlacement(amount: number): Ball[] {
    const result = [];
    for (let i = 0; i < amount; i++) {
      let hasCollision = 0;
      let newX = 0;
      let newY = 0;
      do{
        newX = pxToMeter(this.board.getLeftWallX()) + Math.random() * (this.board.getWidth() - 2 * config.BALL_RADIUS_M) + config.BALL_RADIUS_M;
        newY = pxToMeter(this.board.getTopWallY()) + Math.random() * (this.board.getHeight() - 2 * config.BALL_RADIUS_M) + config.BALL_RADIUS_M;
        result.forEach(ball => {
          if (ball.position.subtract(new Vector2D(newX, newY)).magnitude() <= 2 * config.BALL_RADIUS_M){
            hasCollision = 1;
          }
        });
      }
      while (hasCollision);

      const currentBall = this.createBall(
        newX,
        newY,
        poolColors.balls[i % poolColors.balls.length],
      );

      result.push(currentBall);
    }

    return result;
  }

  private createBall(
    positionXMeters: number,
    positionYMeters: number,
    color: ColorSource,
  ): Ball {
    return new Ball(
      new Vector2D(positionXMeters, positionYMeters),
      color,
    );
  }
}
