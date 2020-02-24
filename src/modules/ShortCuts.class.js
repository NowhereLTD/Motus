
class ShortCuts {
  constructor(drawmanager) {
    this.drawmanager = drawmanager;
    this.addListener();
    this.active = true;
  }

  addListener() {
    addEventListener("keydown", function(e){
      if(!this.active) {
        return;
      }
      if(e.ctrlKey) {
        if(e.key == "+") {
          let newZoom = this.drawmanager.layerManager.canvasZoom;
          newZoom = newZoom + 0.1;
          this.drawmanager.layerManager.zoom(newZoom);
          e.preventDefault();
        }else if(e.key == "-") {
          let newZoom = this.drawmanager.layerManager.canvasZoom;
          newZoom = newZoom - 0.1;
          this.drawmanager.layerManager.zoom(newZoom);
          e.preventDefault();
        }else if(e.key == "z") {
          this.drawmanager.layerManager.activeLayer.worksteps.rollbackToLastPoint();
          this.drawmanager.redrawFromWorkSteps();
        }else if(e.key == "Z") {
          this.drawmanager.layerManager.activeLayer.worksteps.rolloutToNextPoint();
          this.drawmanager.redrawFromWorkSteps();
        }
      }
    }.bind(this));
  }
}
