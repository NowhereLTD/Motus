//Implement Zoom


class LayerManager {
  constructor(parent = document.body) {
    this.layers = [];
    this.activeLayer = null;
    this.canvasZoom = 1;

    this.parentElement = document.createElement("article");
    this.parentElement.classList.add("f--s-2");
    this.parentElement.classList.add("f--e-8");
    this.parentElement.classList.add("layermanager");
    parent.appendChild(this.parentElement);

    this.element = document.createElement("section");
    this.parentElement.appendChild(this.element);

    this.zoom(1);
  }

  addLayer(name = this.getName()) {
    let layer = new Layer(name, this.element);
    this.layers[layer.name] = layer;
    return layer;
  }

  getName(count = Object.keys(this.layers).length) {
    let name = "id" + count;
    if(this.layers[name]) {
      count = count + 1;
      name = this.getName(count);
    }
    return name;
  }

  deleteLayer(name) {
    this.layers[name].delete();
    delete this.layers[name];
  }

  zoom(zoom) {
    this.canvasZoom = zoom;
    this.element.style.zoom = this.canvasZoom;
    //this.element.style.transform = "scale(" + this.canvasZoom + ")";
  }
}
