import { PlacementType } from "./services/placement_service";

export class RuntimeConfig {
    public G: number;
    public frictionCoef: number;
    public ballsNumber: number;
    public placementType: PlacementType;

    constructor() {
        this.G = 9.8;
        this.frictionCoef = 0.02;
        this.ballsNumber = 10;
        this.placementType = PlacementType.TRIANGLE;
    }
}