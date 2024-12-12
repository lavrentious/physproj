import { ColorSource, Graphics, Text } from "pixi.js";
import { config } from "../config";
import { rotate } from "../utils/math_funcs";
import { meterToPx } from "../utils/px";
import { Vector2D } from "../utils/vector2d";

export class Ball {
  private graphics: Graphics;
  public velocity: Vector2D;
  public id: number;
  public radius: number;

  private infoGraphics: Text;

  constructor(
    public position: Vector2D,
    public color: ColorSource,
  ) {
    this.id = Math.round(Math.random() * 10e6);
    this.radius = config.BALL_RADIUS_M;
    this.velocity = new Vector2D(0.0, 0.0);
    this.graphics = new Graphics()
      .circle(0, 0, meterToPx(this.radius))
      .fill(this.color);

    this.infoGraphics = new Text({
      text: `${this.velocity.magnitude().toFixed(3)} м/с`,
      x: meterToPx(this.position.x),
      y: meterToPx(this.position.y),
      alpha: 1,

      style: {
        fontFamily: "monospace",
        fontSize: 12,
      },
    });

    this.render();
  }

  public getInfoGraphics() {
    return this.infoGraphics;
  }

  render() {
    this.graphics.x = meterToPx(this.position.x);
    this.graphics.y = meterToPx(this.position.y);

    this.infoGraphics.x = meterToPx(this.position.x);
    this.infoGraphics.y = meterToPx(this.position.y);
    if (this.velocity.magnitude() < config.BALL_VELOCITY_THRESHOLD) {
      this.infoGraphics.alpha = 0;
    } else {
      this.infoGraphics.alpha = 1;
      this.infoGraphics.text = `${this.velocity.magnitude().toFixed(3)} м/с`;
    }
  }

  update(deltaTime: number, friction: number, g: number) {
    if (this.velocity.magnitude() < config.BALL_VELOCITY_THRESHOLD) {
      this.velocity = new Vector2D(0, 0);
      return;
    }

    const deltaVelocity = this.velocity
      .normalize()
      .scale((friction * g * deltaTime) / 1000);
    if (deltaVelocity.magnitude() > this.velocity.magnitude()) {
      this.velocity = new Vector2D(0, 0);
    } else {
      this.velocity = this.velocity.subtract(deltaVelocity);
    }

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

    const t = myTmp.x;
    myTmp.x = otherTmp.x;
    otherTmp.x = t;

    this.velocity = rotate(myTmp, -alpha);
    other.velocity = rotate(otherTmp, -alpha);
  }
}
