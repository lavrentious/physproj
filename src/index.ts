import { Application, Assets, Sprite } from "pixi.js";
import * as dat from 'dat.gui'
import itmoLogo from "./assets/itmo.png";
import { config } from "./config";
import { Board } from "./entities/board";
import { PlacementService, PlacementType } from "./services/placement_service";
import { CollisionResolver } from "./utils/collision_resolver";
import { meterToPx } from "./utils/px";
import { App } from "./App";
import { RuntimeConfig } from "./runtime_config";

async function main() {
  // init html
  const pixiContainer = document.getElementById("pixi");
  if (!pixiContainer) {
    throw new Error("Parent block not found");
  }

  // Physics-Button logic
  document
    .getElementById("switcher-button")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      app.togglePhysics();
      this.classList.toggle("btn-success", app.getPhysics());
      this.classList.toggle("btn-danger", !app.getPhysics());
    });
  
  // Pause-Button logic
  document
    .getElementById("pause-button")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      app.togglePause();
      this.children[0].classList.toggle("bi-play-fill", app.getPause());
      this.children[0].classList.toggle("bi-pause", !app.getPause());
    });
  
  // Restart-Button logic
  document
    .getElementById("restart-button")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      app.restart();
      console.log(runtimeConfig);
    });

  // Apply-Button logic
  document
    .getElementById("apply-button")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      app.setRuntimeConfig(runtimeConfig);
      console.log(runtimeConfig);
      document.getElementById('close-offcanvas')?.click();
      document.getElementById("pause-button")?.children[0].classList.toggle("bi-play-fill", app.getPause());
      document.getElementById("pause-button")?.children[0].classList.toggle("bi-pause", !app.getPause());
    });
  
    // Honey-Button logic
    document
      .getElementById("honey-button")
      ?.addEventListener("click", function (event) {
        event.preventDefault();
        runtimeConfig.frictionCoef = 0.3;
        app.setRuntimeConfig(runtimeConfig);
        document.getElementById('close-offcanvas')?.click();
        document.getElementById("pause-button")?.children[0].classList.toggle("bi-play-fill", app.getPause());
        document.getElementById("pause-button")?.children[0].classList.toggle("bi-pause", !app.getPause());
      });

      // Ice-Button logic
    document
    .getElementById("ice-button")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      runtimeConfig.frictionCoef = 0.002;
      app.setRuntimeConfig(runtimeConfig);

      

      document.getElementById('close-offcanvas')?.click();
      document.getElementById("pause-button")?.children[0].classList.toggle("bi-play-fill", app.getPause());
      document.getElementById("pause-button")?.children[0].classList.toggle("bi-pause", !app.getPause());
    });

    // Table-Button logic
    document
      .getElementById("table-button")
      ?.addEventListener("click", function (event) {
        event.preventDefault();
        runtimeConfig.frictionCoef = 0.02;
        app.setRuntimeConfig(runtimeConfig);
        document.getElementById('close-offcanvas')?.click();
        document.getElementById("pause-button")?.children[0].classList.toggle("bi-play-fill", app.getPause());
        document.getElementById("pause-button")?.children[0].classList.toggle("bi-pause", !app.getPause());
      });

    const runtimeConfig = new RuntimeConfig();
            
    let gui = new dat.GUI({ autoPlace: false });
    let customContainer = document.getElementById('dat-gui-container');
    if (customContainer) customContainer.appendChild(gui.domElement);
    // Define control elements here
    const guiPhysicsFolder = gui.addFolder('Физика');
    guiPhysicsFolder.add(runtimeConfig, 'G').min(0.1).max(20).step(0.1).name('Постоянная G');
    guiPhysicsFolder.add(runtimeConfig, 'frictionCoef').min(0.001).max(1).step(0.01).name('Коэф. трения');
    guiPhysicsFolder.open();

    const guiSimulationFolder = gui.addFolder('Симуляция');
    guiSimulationFolder.add(runtimeConfig, 'ballsNumber').min(1).max(15).step(1).name('Кол-во шаров');
    guiSimulationFolder.add(runtimeConfig, 'placementType', PlacementType).name('Тип расстановки');
    guiSimulationFolder.open();

    const app = new App();
    await app.init(pixiContainer);
    app.run();
}

main();
