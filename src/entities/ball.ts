import { ColorSource, Graphics } from "pixi.js";
import { config } from "../config";
import { rotate } from "../utils/math_funcs";
import { meterToPx } from "../utils/px";
import { Vector2D } from "../utils/vector2d";

export class Ball {
  private graphics: Graphics;
  public velocity: Vector2D;
  public id: number;
  public radius: number;

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

    this.render();
  }

  render() {
    this.graphics.x = meterToPx(this.position.x);
    this.graphics.y = meterToPx(this.position.y);
    if (config.SHOW_PHYSICS){
      this.renderVelocity();
    }
    else{
      this.clearVelocity();
    }
  }

  clearVelocity(){
    this.graphics.children.forEach(child => {
      child.destroy();
    });
  }

  renderVelocity(){
    this.clearVelocity();
    let velocityPreview = new Graphics()
    .moveTo(0, 0)
    .lineTo(meterToPx(this.velocity.x) * 3, meterToPx(this.velocity.y) * 3)
    .stroke({
      color: 0x000000,
      width: 1,
      alignment: 0,
    }); 
    this.graphics.addChild(velocityPreview);
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

    const t = myTmp.x;
    myTmp.x = otherTmp.x;
    otherTmp.x = t;

    this.velocity = rotate(myTmp, -alpha);
    other.velocity = rotate(otherTmp, -alpha);
  }
}
