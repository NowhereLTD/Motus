
class DrawManager {
  constructor(parent = document.body) {
    this.layerManager = new LayerManager(parent);
    this.backgroundLayer = this.layerManager.addLayer("Background");
    this.backgroundLayer.usable = false;
    this.backgroundCTX = this.backgroundLayer.canvas.element.getContext("2d");
    let background = new Image();
    background.src = "./assets/transparency.png";
    background.onload = function(){
      let repeatImage = this.backgroundCTX.createPattern(background, "repeat");
      this.backgroundCTX.drawImage(background, 0, 0);
      this.backgroundCTX.fillStyle = repeatImage;
      this.backgroundCTX.fillRect(0, 0, this.backgroundLayer.canvas.width, this.backgroundLayer.canvas.height);
    }.bind(this);

    this.cacheLayer = this.layerManager.addLayer("Cache");
    this.cacheLayer.usable = false;

    let layer = this.layerManager.addLayer();
    this.layerManager.activeLayer = layer;
    this.addListener();
    this.resetData();
    this.tool = new DrawTool();

    // Base Event Listener
    addEventListener("mousedown", function(){
      this.pressmouse = true;
    }.bind(this));

    addEventListener("mouseup", function(){
      this.pressmouse = false;
    }.bind(this));

    addEventListener("touchstart", function(e){
      this.pressmouse = true;
    }.bind(this));

    addEventListener("touchend", function(e){
      this.pressmouse = false;
    }.bind(this));
  }



  addListener() {
    if(this.layerManager.activeLayer.listener) {
      return;
    }
    let element = this.layerManager.activeLayer.canvas.element;

    let context = element.getContext("2d");
    this.layerManager.activeLayer.listener = true;

    element.addEventListener("mousemove", function(e){



      e.coords = this.calculateCoords(e.pageX, e.pageY, element);

      if(this.pressmouse){
        if(e.buttons == 1){
          this.drawLine(e);
        }
      }

      this.clearCanvas(this.cacheLayer);
      let cacheTool = new DrawTool();
      cacheTool.size = this.tool.size;
      cacheTool.color = this.tool.color;
      cacheTool.alpha = 0.3;
      this.drawLine(e, {"layer": this.cacheLayer, "tool": cacheTool});

    }.bind(this));


    element.onmousemove = (function() {
      let thread;

      let onmousestop = function() {
        if(!this.lastCoords){
          return;
        }

        let e = {};
        e.coords = this.lastCoords;
        this.clearCanvas(this.cacheLayer);
        let cacheTool = new DrawTool();
        cacheTool.size = this.tool.size;
        cacheTool.color = this.tool.color;
        cacheTool.alpha = 0.3;
        this.drawLine(e, {"layer": this.cacheLayer, "tool": cacheTool});
      }.bind(this);

      return function() {
        clearTimeout(thread);
        thread = setTimeout(onmousestop, 100);
      };
    }.bind(this))();


    element.ontouchmove = (function() {
      let thread;

      let onmousestop = function() {
        if(!this.lastCoords){
          return;
        }

        let e = {};
        e.coords = this.lastCoords;
        this.clearCanvas(this.cacheLayer);
        let cacheTool = new DrawTool();
        cacheTool.size = this.tool.size;
        cacheTool.color = this.tool.color;
        cacheTool.alpha = 0.3;
        this.drawLine(e, {"layer": this.cacheLayer, "tool": cacheTool});
      }.bind(this);

      return function() {
        clearTimeout(thread);
        thread = setTimeout(onmousestop, 100);
      };
    }.bind(this))();


    element.addEventListener("mousedown", function(e){
      e.coords = this.calculateCoords(e.pageX, e.pageY, element);
      this.lastCoords = e.coords;

      if(this.pressmouse){
        this.drawLine(e);
      }

      this.clearCanvas(this.cacheLayer);
      let cacheTool = new DrawTool();
      cacheTool.size = this.tool.size;
      cacheTool.color = this.tool.color;
      cacheTool.alpha = 0.3;
      this.drawLine(e, {"layer": this.cacheLayer, "tool": cacheTool});

    }.bind(this));


    element.addEventListener("mouseup", function(e){
      this.layerManager.activeLayer.worksteps.setRollbackPoint();
      if(!e.coords) {
        e.coords = this.lastCoords;
        this.drawLine(e);
      }
      this.resetData();
    }.bind(this));


    element.addEventListener("mouseout", function(e){
      this.clearCanvas(this.cacheLayer);
    }.bind(this));

    element.addEventListener("mouseover", function(e){
      e.coords = this.calculateCoords(e.pageX, e.pageY, element);
      this.lastCoords = e.coords;
      this.clearCanvas(this.cacheLayer);
    }.bind(this));



    // Touchscreen
    element.addEventListener("touchmove", function(e){
      if(this.pressmouse){
        for(let i=0; i<e.touches.length; i++){
          e.coords = this.calculateCoords(e.touches[i].clientX, e.touches[i].clientY, element);
          this.drawLine(e, {"force": e.touches[i].force});
        }
      }
      e.preventDefault();
    }.bind(this));

    element.addEventListener("touchstart", function(e){
      if(this.pressmouse){
        for(let i=0; i<e.touches.length; i++){
          e.coords = this.calculateCoords(e.touches[i].clientX, e.touches[i].clientY, element);
          this.drawLine(e, {"force": e.touches[i].force});

          this.clearCanvas(this.cacheLayer);
          let cacheTool = new DrawTool();
          cacheTool.size = this.tool.size;
          cacheTool.color = this.tool.color;
          cacheTool.alpha = 0.3;
          this.drawLine(e, {"layer": this.cacheLayer, "tool": cacheTool});
        }
      }
    }.bind(this));



    element.addEventListener("touchend", function(e){
      this.layerManager.activeLayer.worksteps.setRollbackPoint();
      this.resetData();
    }.bind(this));


    element.addEventListener("touchcancel", function(e){
      this.resetData();
    }.bind(this));
  }



  drawLine(e, options = {"force": 1, "layer": this.layerManager.activeLayer, "tool": this.tool}) {
    if(!options.force) {
      options.force = 1;
    }
    if(!options.layer) {
      options.layer = this.layerManager.activeLayer;
    }
    if(!options.tool) {
      options.tool = this.tool;
    }

    if(!this.lastCoords) {
      this.lastCoords = e.coords;
      return;
    }

    if(options.layer.usable) {
      let data = {"coords": e.coords, "lastCoords": this.lastCoords, "options": {"force": 1, "tool": this.tool.getJSON()}};
      options.layer.worksteps.push(data, "line");
    }


    let element = options.layer.canvas.element;
    let context = element.getContext("2d");

    context.filter = options.tool.filter;


    context.lineJoin = "round";
    context.lineWidth = options.tool.size * options.force;
    context.strokeStyle = options.tool.color;
    context.lineCap = options.tool.cap;
    context.globalAlpha = options.tool.alpha;

    context.globalCompositeOperation = options.tool.operation;
    context.beginPath();

    context.moveTo(this.lastCoords.x, this.lastCoords.y);
    context.lineTo(e.coords.x, e.coords.y);
    context.closePath();
    context.stroke();
    this.lastCoords = e.coords;
  }

  clearCanvas(layer = this.layerManager.activeLayer){
    if(layer.usable) {
      layer.worksteps.push({}, "clear");
    }

    let element = layer.canvas.element;
    let context = element.getContext("2d");
    context.clearRect(0, 0, element.width, element.height);
  }


  redrawFromWorkSteps(layer = this.layerManager.activeLayer) {
    layer.usable = false;
    this.clearCanvas(layer);

    for(let i=0; i<layer.worksteps.steps.length; i++){
      let workstep = layer.worksteps.steps[i];
      switch (workstep.type) {
        case "line":
          let e = {};
          e.coords = workstep.data.coords;
          this.lastCoords = workstep.data.lastCoords;
          let options = workstep.data.options;
          options.layer = layer;
          this.drawLine(e, options);
          break;
        case "clear":
          this.clearCanvas(layer);
          break;
      }
    }

    layer.usable = true;
  }

  renderImage(layer = this.layerManager.activeLayer, type = "image/png") {
    let imageData = layer.canvas.element.toDataURL(type);
    return imageData;
  }

  renderCompleteImage() {

    let renderCanvas = new Canvas(null);
    let renderCanvasCTX = renderCanvas.element.getContext("2d");
    let allcachelayer = [];
    for(let layername in this.layerManager.layers) {
      let layercache = this.layerManager.layers[layername];
      allcachelayer[layercache.canvas.element.style.zIndex-1] = layercache;
    }

    let waiter = [];

    for(let i=0; i<allcachelayer.length; i++) {
      if(allcachelayer[i].usable) {
        let background = new Image();
        background.src = this.renderImage(allcachelayer[i]);

        waiter.push(new Promise(resolve => {
          background.addEventListener("load", () => {
            renderCanvasCTX.drawImage(background, 0, 0);
            resolve(renderCanvas);
          });
        }));
      }
    }

    return Promise.all(waiter);
  }

  resetData() {
    this.pressmouse = false;
    this.lastCoords = null;
    this.clearCanvas(this.cacheLayer);
  }

  calculateCoords(x, y, element) {

    let canvasRect = element.getBoundingClientRect();

    x =  x / this.layerManager.canvasZoom;
    y =  y / this.layerManager.canvasZoom;

    x = x - canvasRect.left;
    y = y - canvasRect.top;
    x =  x / canvasRect.width;
    y =  y / canvasRect.height;
    x =  x * element.width;
    y =  y * element.height;

    return {"x": x, "y": y}
  }



  hide() {
    this.layerManager.parentElement.style.display = "none";
  }

  show() {
    this.layerManager.parentElement.style.display = "";
  }

}

class DrawTool {
  constructor() {
    this.size = 10;
    this.color = "#000";
    this.cap = "round"; // butt, round, square
    this.alpha = 1;
    this.operation = "source-over";
    this.filter = "none";
  }

  getJSON() {
    return {
      "size": this.size,
      "color": this.color,
      "cap": this.cap,
      "alpha": this.alpha,
      "operation": this.operation,
      "filter": this.filter
    }
  }
}
