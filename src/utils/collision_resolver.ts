import { Ball } from "../entities/ball";
import { Board } from "../entities/board";
import { Vector2D } from "./vector2d";

export class CollisionResolver {
  public collisionsLookup: Map<number, Set<Ball>>;

  constructor() {
    this.collisionsLookup = new Map();
  }

  public resolveBallsCollision(data: Ball[]): void {
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        if (data[i].isCollided(data[j])) {
          if (
            this.collisionsLookup.get(data[i].id)?.has(data[j]) ||
            this.collisionsLookup.get(data[j].id)?.has(data[i])
          ) {
            continue;
          }

          data[i].collide(data[j]);

          if (!this.collisionsLookup.has(data[i].id)) {
            this.collisionsLookup.set(data[i].id, new Set());
          }
          if (!this.collisionsLookup.has(data[j].id)) {
            this.collisionsLookup.set(data[j].id, new Set());
          }
          this.collisionsLookup.get(data[i].id)?.add(data[j]);
          this.collisionsLookup.get(data[j].id)?.add(data[i]);
        } else {
          if (this.collisionsLookup.has(data[i].id)) {
            this.collisionsLookup.get(data[i].id)?.delete(data[j]);
          }
          if (this.collisionsLookup.has(data[j].id)) {
            this.collisionsLookup.get(data[j].id)?.delete(data[i]);
          }
        }
      }
    }
  }

  public resolveBallBoardCollision(board: Board, data: Array<Ball>): void {
    for (let i = 0; i < data.length; i++) {
      const redirectionVector = board.processCollision(data[i]);
      if (!(redirectionVector.x === 1 && redirectionVector.y === 1)) {
        data[i].velocity = new Vector2D(
          redirectionVector.x * data[i].velocity.x,
          redirectionVector.y * data[i].velocity.y,
        );
      }
    }
  }

  public resolveBallHoleCollision(board: Board, data: Array<Ball>): void {
    for (let i = 0; i < data.length; i++) {
      board.processHoleCollision(data[i]);
    }
  }

  public clearCollisionsLookup(): void {
    this.collisionsLookup.clear();
  }
}
