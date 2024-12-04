export class Vector2D {
    constructor(public x: number, public y: number) {}

    // Add another vector to this vector
    add(other: Vector2D): Vector2D {
        return new Vector2D(this.x + other.x, this.y + other.y);
    }

    // Subtract another vector from this vector
    subtract(other: Vector2D): Vector2D {
        return new Vector2D(this.x - other.x, this.y - other.y);
    }

    // Scale the vector by a scalar value
    scale(scalar: number): Vector2D {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    // Calculate the magnitude (length) of the vector
    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    // Normalize the vector (make it unit length)
    normalize(): Vector2D {
        const mag = this.magnitude();
        if (mag === 0) {
            throw new Error("Cannot normalize a zero vector");
        }
        return this.scale(1 / mag);
    }

    // Dot product with another vector
    dot(other: Vector2D): number {
        return this.x * other.x + this.y * other.y;
    }

    // String representation of the vector
    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

// Example usage:
// const v1 = new Vector2D(3, 4);
// const v2 = new Vector2D(1, 2);

// const v3 = v1.add(v2);
// console.log(`v1 + v2 = ${v3.toString()}`); // Output: v1 + v2 = (4, 6)

// const v4 = v1.subtract(v2);
// console.log(`v1 - v2 = ${v4.toString()}`); // Output: v1 - v2 = (2, 2)

// const v5 = v1.scale(2);
// console.log(`v1 scaled by 2 = ${v5.toString()}`); // Output: v1 scaled by 2 = (6, 8)

// console.log(`Magnitude of v1 = ${v1.magnitude()}`); // Output: Magnitude of v1 = 5

// const v6 = v1.normalize();
// console.log(`Normalized v1 = ${v6.toString()}`); // Output: Normalized v1 = (0.6, 0.8)

// const dotProduct = v1.dot(v2);
// console.log(`Dot product of v1 and v2 = ${dotProduct}`); // Output: Dot product of v1 and v2 = 11