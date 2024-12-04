import { ColorSource, Graphics } from "pixi.js";
import { config } from "../config";
import { rotate, rotate2 } from "../utils/math_funcs";
import { meterToPx } from "../utils/px";
import { Vector2D } from "../utils/vector2d";

export class Ball {
  private graphics: Graphics;
  public velocity: Vector2D;

  constructor(
    public id: number,
    // physics
    public position: Vector2D,
    public mass: number, //  TODO: move to config
    // ball
    public color: ColorSource,
    public radius: number,
  ) {
    this.graphics = new Graphics();
    this.velocity = new Vector2D(0.05, 0.05);
    this.graphics = new Graphics()
      .circle(0, 0, meterToPx(this.radius))
      .fill(this.color);

    this.render();
  }

  render() {
    // console.log(
    //   "render ball at ",
    //   meterToPx(this.position.x),
    //   meterToPx(this.position.y),
    // );

    this.graphics.x = meterToPx(this.position.x);
    this.graphics.y = meterToPx(this.position.y);
  }

  update(deltaTime: number) {
    if (this.velocity.magnitude() < config.BALL_VELOCITY_THRESHOLD) {
      this.velocity = new Vector2D(0, 0);
      return;
    }
    // console.log("updating, velocity = ", this.velocity.toString());

    const deltaVelocity = this.velocity
      .normalize()
      .scale((config.BALL_FRICTION_COEF * config.G * deltaTime) / 1000);
    this.velocity = this.velocity.subtract(deltaVelocity);

    this.position = this.position.add(this.velocity);

    this.render();
  }

  getGraphics() {
    return this.graphics;
  }

  isCollided(other: Ball) {
    const distance = Math.hypot(
      this.position.x - other.position.x,
      this.position.y - other.position.y,
    );

    return distance <= this.radius + other.radius;
  }

  collide(other: Ball) {
    const dx = this.position.x - other.position.x;
    const dy = this.position.y - other.position.y;
    const alpha = Math.atan(-dy / dx);

    const myTmp = rotate(this.velocity, alpha);
    const otherTmp = rotate(other.velocity, alpha);

    console.log("-----------------");
    console.log(rotate(this.velocity, alpha));
    console.log(rotate2(this.velocity, alpha));
    console.log("-----------------");

    const t = myTmp.x;
    myTmp.x = otherTmp.x;
    otherTmp.x = t;

    this.velocity = rotate(myTmp, -alpha);
    other.velocity = rotate(otherTmp, -alpha);
  }
}
