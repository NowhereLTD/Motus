

class LayerBar {
  constructor(drawmanager, parent = document.body) {

    this.drawmanager = drawmanager;

    this.element = document.createElement("article");
    this.element.className = "layerbar";
    this.element.classList.add("f--s-10");
    this.element.classList.add("f--e-2");
    parent.appendChild(this.element);

    this.render();
  }

  render() {
    this.element.innerHTML = "";

    let order = 0;

    for(let layerName in this.drawmanager.layerManager.layers) {

      order++;

      let layer = this.drawmanager.layerManager.layers[layerName];

      let layerElement = document.createElement("section");
      layerElement.innerText = layerName;
      layerElement.style.order = order;
      layer.canvas.element.style.zIndex = order;
      if(layer == this.drawmanager.layerManager.activeLayer){
        this.selectLayer(layerElement, layer);
      }

      if(layer.usable) {
        layerElement.addEventListener("click", function(){
          this.selectLayer(layerElement, layer);
        }.bind(this));
        layerElement.addEventListener("dblclick", function(){
          //layerElement.contentEditable = "true";
        });
        layerElement.addEventListener("keyup", function(){
          // Change Name from layer
        });
      }



      // Hidden Layer Feature
      // Change Layer ZInDEX Feature

      let menuIcons = document.createElement("section");
      menuIcons.className = "menuIcons";

      let hideLayerElement = document.createElement("section");
      hideLayerElement.innerHTML = "&#128065;";
      hideLayerElement.style.width = "2.4em";
      hideLayerElement.style.float = "left";
      hideLayerElement.addEventListener("click", function(){
        if(layer.canvas.element.style.display == "none"){
          hideLayerElement.innerHTML = "&#128065;";
          layer.canvas.element.style.display = "";
        }else {
          hideLayerElement.innerHTML = "&#11198;&#128065;";
          layer.canvas.element.style.display = "none";
        }
      });
      menuIcons.appendChild(hideLayerElement);



      let upElement = document.createElement("section");
      upElement.innerHTML = "&#11205;";
      upElement.style.width = "1.2em";
      upElement.style.float = "left";
      upElement.addEventListener("click", function(){
        for(let i=0; i<layerElement.parentNode.childNodes.length; i++) {
          let cacheLayer = layerElement.parentNode.childNodes[i];
          if(cacheLayer.style.order == parseInt(layerElement.style.order) - 1) {
            layerElement.style.order = cacheLayer.style.order;
            cacheLayer.style.order = parseInt(layerElement.style.order) + 1;

            let cacheLayerCanvas = this.drawmanager.layerManager.layers[cacheLayer.firstChild.textContent];
            layer.canvas.element.style.zIndex = layerElement.style.order;
            cacheLayerCanvas.canvas.element.style.zIndex = cacheLayer.style.order;

            break;
          }
        }
      }.bind(this));
      menuIcons.appendChild(upElement);


      let downElement = document.createElement("section");
      downElement.innerHTML = "&#11206;";
      downElement.style.width = "1.2em";
      downElement.style.float = "left";
      downElement.addEventListener("click", function(){
        for(let i=0; i<layerElement.parentNode.childNodes.length; i++) {
          let cacheLayer = layerElement.parentNode.childNodes[i];
          if(cacheLayer.style.order == parseInt(layerElement.style.order) + 1) {
            layerElement.style.order = cacheLayer.style.order;
            cacheLayer.style.order = parseInt(layerElement.style.order) - 1;

            let cacheLayerCanvas = this.drawmanager.layerManager.layers[cacheLayer.firstChild.textContent];
            layer.canvas.element.style.zIndex = layerElement.style.order;
            cacheLayerCanvas.canvas.element.style.zIndex = cacheLayer.style.order;

            break;
          }
        }
      }.bind(this));
      menuIcons.appendChild(downElement);



      let wasteElement = document.createElement("section");
      wasteElement.innerHTML = "&#128465;";
      wasteElement.style.width = "1.2em";
      wasteElement.style.float = "left";
      wasteElement.addEventListener("click", function(){
        this.drawmanager.layerManager.deleteLayer(layerName);
        this.render();
      }.bind(this));
      menuIcons.appendChild(wasteElement);


      layerElement.appendChild(menuIcons);
      this.element.appendChild(layerElement);
    }


    let addLayerElement = document.createElement("section");
    addLayerElement.innerText = "+";
    addLayerElement.addEventListener("click", function(){
      this.drawmanager.layerManager.activeLayer = this.drawmanager.layerManager.addLayer();
      this.render();
    }.bind(this));
    this.element.appendChild(addLayerElement);
  }

  selectLayer(layerElement, layer){
    for(let i=0; i<this.element.childNodes.length; i++){
      if(this.element.childNodes[i].className == "selected") {
        this.element.childNodes[i].className = "";
      }
    }
    layerElement.className = "selected";
    this.drawmanager.layerManager.activeLayer = layer;
    this.drawmanager.addListener();
  }

  hide() {
    this.element.style.display = "none";
  }

  show() {
    this.element.style.display = "";
  }
}
