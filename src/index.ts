import * as dat from "dat.gui";
import { App } from "./App";
import { RuntimeConfig } from "./runtime_config";
import { PlacementType } from "./services/placement_service";

class Index {
  app: App;
  pixiContainer: HTMLElement;
  datGui: dat.GUI;

  physicsSwitchButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  restartButton: HTMLButtonElement;
  applyButton: HTMLButtonElement;
  honeyButton: HTMLButtonElement;
  iceButton: HTMLButtonElement;
  tableButton: HTMLButtonElement;
  runtimeConfig: RuntimeConfig = new RuntimeConfig();

  private getElementByIdOrThrow<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id) as T;
    if (!element) {
      throw new Error(`Element with id ${id} not found`);
    }
    return element;
  }

  constructor() {
    this.app = new App();
    this.datGui = new dat.GUI({ autoPlace: false });
    this.pixiContainer = this.getElementByIdOrThrow("pixi");

    // navbar buttons
    this.physicsSwitchButton = this.getElementByIdOrThrow("switcher-button");
    this.pauseButton = this.getElementByIdOrThrow("pause-button");
    this.restartButton = this.getElementByIdOrThrow("restart-button");

    // config menu buttons
    this.tableButton = this.getElementByIdOrThrow("table-button");
    this.honeyButton = this.getElementByIdOrThrow("honey-button");
    this.iceButton = this.getElementByIdOrThrow("ice-button");
    this.applyButton = this.getElementByIdOrThrow("apply-button");
  }

  // listeners
  // - navbar buttons
  private physicsSwitchButtonClickListener(event: MouseEvent) {
    event.preventDefault();
    this.app.togglePhysics();
    this.physicsSwitchButton.classList.toggle(
      "btn-success",
      this.app.getPhysics(),
    );
    this.physicsSwitchButton.classList.toggle(
      "btn-danger",
      !this.app.getPhysics(),
    );
  }

  private pauseButtonClickListener(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    this.app.togglePause();
    this.pauseButton.children[0].classList.toggle(
      "bi-play-fill",
      this.app.getPause(),
    );
    this.pauseButton.children[0].classList.toggle(
      "bi-pause",
      !this.app.getPause(),
    );
  }

  private restartButtonClickListener(event: MouseEvent) {
    event.preventDefault();
    this.app.restart();
  }

  private updateTableFriction(frictionCoef?: number) {
    if (frictionCoef) {
      this.runtimeConfig.frictionCoef = frictionCoef;
    }
    console.log("new friction", this.runtimeConfig.frictionCoef);

    this.datGui.updateDisplay();
    this.app.setRuntimeConfig(this.runtimeConfig);
    document.getElementById("close-offcanvas")?.click();
    this.pauseButton.children[0].classList.toggle(
      "bi-play-fill",
      this.app.getPause(),
    );
    this.pauseButton.children[0].classList.toggle(
      "bi-pause",
      !this.app.getPause(),
    );
  }

  // - table types
  private iceButtonClickListener(event: MouseEvent) {
    event.preventDefault();
    this.updateTableFriction(0.002);
  }

  private tableButtonClickListener(event: MouseEvent) {
    event.preventDefault();
    this.updateTableFriction(0.02);
  }

  private honeyButtonClickListener(event: MouseEvent) {
    event.preventDefault();
    this.updateTableFriction(0.3);
  }

  // - config menu apply button
  private applyButtonClickListener(event: MouseEvent) {
    event.preventDefault();
    this.updateTableFriction(); // apply current config
  }

  private initListeners() {
    this.physicsSwitchButton.addEventListener(
      "click",
      this.physicsSwitchButtonClickListener.bind(this),
    );
    this.pauseButton.addEventListener(
      "click",
      this.pauseButtonClickListener.bind(this),
    );
    this.restartButton.addEventListener(
      "click",
      this.restartButtonClickListener.bind(this),
    );
    this.tableButton.addEventListener(
      "click",
      this.tableButtonClickListener.bind(this),
    );
    this.honeyButton.addEventListener(
      "click",
      this.honeyButtonClickListener.bind(this),
    );
    this.iceButton.addEventListener(
      "click",
      this.iceButtonClickListener.bind(this),
    );
    this.applyButton.addEventListener(
      "click",
      this.applyButtonClickListener.bind(this),
    );
  }

  private initDatGui() {
    const customContainer = document.getElementById("dat-gui-container");
    if (customContainer) customContainer.appendChild(this.datGui.domElement);
    // Define control elements here
    const guiPhysicsFolder = this.datGui.addFolder("Физика");
    guiPhysicsFolder
      .add(this.runtimeConfig, "G")
      .min(0.1)
      .max(20)
      .step(0.1)
      .name("Постоянная G");
    guiPhysicsFolder
      .add(this.runtimeConfig, "frictionCoef")
      .min(0.001)
      .max(1)
      .step(0.01)
      .name("Коэф. трения");
    guiPhysicsFolder.open();

    const guiSimulationFolder = this.datGui.addFolder("Симуляция");
    guiSimulationFolder
      .add(this.runtimeConfig, "ballsNumber")
      .min(1)
      .max(15)
      .step(1)
      .name("Кол-во шаров");
    guiSimulationFolder
      .add(this.runtimeConfig, "placementType", PlacementType)
      .name("Тип расстановки");
    guiSimulationFolder.open();
  }

  private initHotkeys() {
    // pause with space
    window.addEventListener("keypress", (event) => {
      if (event.code === "Space") {
        this.pauseButton.blur();
        this.pauseButtonClickListener();
      }
    });
  }

  public async init() {
    this.initListeners();
    this.initDatGui();

    await this.app.init(this.pixiContainer);
    this.app.run();

    this.initHotkeys();
  }
}

async function main() {
  const index = new Index();
  await index.init();
}

main();
