import { Graphics } from "pixi.js";
import { Ball } from "../entities/ball";
import { meterToPx } from "../utils/px";

export class PhysicsRenderService {
    constructor(private balls: Ball[]) {
        
    }
    
    clearVelocity(ball: Ball){
        ball.getGraphics().children.forEach(child => {
          child.destroy();
        });
      }
    
    renderVelocity(ball: Ball){
    this.clearVelocity(ball);
    let velocityPreview = new Graphics()
    .moveTo(0, 0)
    .lineTo(meterToPx(ball.velocity.x) * 3, meterToPx(ball.velocity.y) * 3)
    .stroke({
        color: 0x000000,
        width: 1,
        alignment: 0,
    }); 
    ball.getGraphics().addChild(velocityPreview);
    }
    

    public update(ball: Ball, showPhysics: boolean) {
        if (showPhysics) {
            this.renderVelocity(ball);
        } else {
            this.clearVelocity(ball);
        }
    }
}