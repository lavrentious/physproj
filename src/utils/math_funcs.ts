import { Vector2D } from "./vector2d";

// export function rotate(v: Vector2D, alpha: number){
//     return new Vector2D(
//         v.x * Math.cos(alpha) - v.y * Math.sin(alpha),
//         v.x * Math.sin(alpha) + v.y * Math.cos(alpha)
//     )
// }

export function rotate(v: Vector2D, alpha: number){
    if (v.magnitude() == 0) return new Vector2D(0, 0);
    let beta = Math.asin(v.y / v.magnitude());
    if (v.x < 0){
        beta = Math.PI - beta;
    }
    return new Vector2D(
        v.magnitude() * Math.cos(alpha + beta),
        v.magnitude() * Math.sin(alpha + beta)
    )
}