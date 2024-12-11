import { Application, Assets, Sprite } from "pixi.js";
import { Board } from "./entities/board";
import { PlacementService, PlacementType } from "./services/placement_service";
import { CollisionResolver } from "./utils/collision_resolver";
import { config } from "./config";
import itmoLogo from "./assets/itmo.png";
import { meterToPx } from "./utils/px";
import dat from "dat.gui";
import { PhysicsRenderService } from "./services/physics_render_service";

export class App {
    private application!: Application;
    private board!: Board;
    private placementService!: PlacementService;
    private collisionResolver!: CollisionResolver;
    private physicsRenderService!: PhysicsRenderService;
    private isPause = false;
    private showPhysics = true;

    constructor() {}

    async init(pixiContainer: HTMLElement) {
        await this.initApplication(pixiContainer);
        await this.initBoard();

        this.placementService = new PlacementService(this.board);
        this.physicsRenderService = new PhysicsRenderService();
        this.collisionResolver = new CollisionResolver();

        const ballsList = this.createBalls();
        this.board.addBalls(ballsList);
        this.application.stage.addChild(this.board.getGraphics());
    }

    async initApplication(pixiContainer: HTMLElement) {
        this.application = new Application();
        await this.application.init({ background: "#65717e", resizeTo: pixiContainer });
        this.application.ticker.maxFPS = 60;
        pixiContainer.appendChild(this.application.canvas);
    }

    async initBoard() {
        // Create board
        const boardWidth = config.BOARD_WIDTH_M;
        const boardHeight = config.BOARD_HEIGHT_M;
        this.board = new Board(
            boardWidth,
            boardHeight,
            (this.application.canvas.width - meterToPx(boardWidth)) / 2,
            (this.application.canvas.height - meterToPx(boardHeight)) / 2,
        );
        
        // Add board background
        const itmoTexture = await Assets.load(itmoLogo);
        const background = new Sprite(itmoTexture);
        background.x = this.board.getLeftWallX();
        background.y = this.board.getTopWallY();
        
        const scalingFactor = 0.4;
        const originalBackgroundWidth = background.width;
        const originalBackgroundHeight = background.height;
        const newBackgroundWidth = meterToPx(this.board.getWidth()) * scalingFactor;
        const newBackgroundHeight =
            (newBackgroundWidth / originalBackgroundWidth) * originalBackgroundHeight;
        
        background.width = newBackgroundWidth;
        background.height = newBackgroundHeight;
        background.x =
        this.board.getLeftWallX() + (meterToPx(this.board.getWidth()) - background.width) / 2;
        background.y =
        this.board.getTopWallY() +
            (meterToPx(this.board.getHeight()) - background.height) / 2 -
            15;
            this.board.getGraphics().addChild(background);
    }

    createBalls() {
        return this.placementService.getPlacement(PlacementType.TRIANGLE, 10);
    }

    run() {
        this.application.ticker.add((time) => {
            // Updaing balls every frame
            this.board.getBallsList().forEach((ball) => {
                ball.update(time.deltaTime);
                this.physicsRenderService.update(ball, this.showPhysics);
            });
        
            // Resoling collisions
            this.collisionResolver.resolveBallBoardCollision(this.board, this.board.getBallsList());
            this.collisionResolver.resolveBallsCollision(this.board.getBallsList());
        });
    }

    restart(){
        this.board.removeBalls();
        const ballsList = this.createBalls();
        this.board.addBalls(ballsList);
        this.resume();
    }

    pause(){
        this.isPause = true;
        this.application.ticker.stop();
    }

    resume(){
        this.isPause = false;
        this.application.ticker.start();
    }

    togglePause(){
        if (this.isPause) this.resume();
        else this.pause();
    }

    disablePhysics(){
        this.showPhysics = false;
    }

    enablePhysics(){
        this.showPhysics = true;
    }

    togglePhysics(){
        if (this.showPhysics) this.disablePhysics();
        else this.enablePhysics();
    }

    getPhysics(){
        return this.showPhysics;
    }

    getBoard(){
        return this.board;
    }

    getApplication(){
        return this.application;
    }

    getPause(){
        return this.isPause;
    }
}