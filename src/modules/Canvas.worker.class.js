
var webWorkerCanvas = null;

class WebWorkerCanvas {

  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.bounding;
    this.tools = [];
    this.tools["pen"] = {"lineJoin": "round", "lineWidth": 10, "strokeStyle": "#000000"};
    this.selectedTool = "pen";
    this.addListener();
  }


  addListener() {

    this.canvas.addEventListener("mousemove", function(e){
      e.coords = this.calculateCoords(e.detail.x, e.detail.y);

      if(!this.lastCoords) {
        this.lastCoords = e.coords;
      }

      if(e.detail.pressmouse){
        this.runTool(e);
      }
    }.bind(this));


    this.canvas.addEventListener("mousedown", function(e){
      e.coords = this.calculateCoords(e.detail.x, e.detail.y);
      this.lastCoords = {"x": e.coords.x - 1, "y": e.coords.y - 1};
      this.runTool(e);
    }.bind(this));


    this.canvas.addEventListener("mouseout", function(e){
      e.coords = this.calculateCoords(e.detail.x, e.detail.y);
      if(!this.lastCoords) {
        this.lastCoords = e.coords;
      }

      if(e.detail.buttons == 1){
        this.drawLine(e);
      }
    }.bind(this));


    this.canvas.addEventListener("mouseenter", function(e){
      e.coords = this.calculateCoords(e.detail.x, e.detail.y);
      this.lastCoords = e.coords;
    }.bind(this));


    this.canvas.addEventListener("mouseup", function(e){
      this.lastCoords = null;
    }.bind(this));





    // Touchscreen Support
    this.canvas.addEventListener("touchmove", function(e){
      e.coords = this.calculateCoords(e.detail.x, e.detail.y);
      if(!this.lastCoords) {
        this.lastCoords = e.coords;
      }
      this.runTool(e, {"force": e.detail.force});
      e.preventDefault();
    }.bind(this));


    this.canvas.addEventListener("touchend", function(e){
      this.lastCoords = null;
    }.bind(this));


    this.canvas.addEventListener("touchcancel", function(e){
      this.lastCoords = null;
    }.bind(this));
  }

  runTool(e, options = {}) {
    switch (this.selectedTool) {
      case "pen":
        this.drawLine(e, options);
        break;
      default:

    }
  }

  drawLine(e) {
    for(let attribute in this.tools[this.selectedTool]) {
      this.context[attribute] = this.tools[this.selectedTool][attribute];
    }

    this.context.beginPath();
    this.context.moveTo(this.lastCoords.x, this.lastCoords.y);
    this.context.lineTo(e.coords.x, e.coords.y);
    this.context.closePath();
    this.context.stroke();
    this.lastCoords = e.coords;
  }

  calculateCoords(x, y) {

    x =  x / 1; //Zoom
    y =  y / 1;

    x = x - this.bounding.left;
    y = y - this.bounding.top;
    x =  x / this.bounding.width;
    y =  y / this.bounding.height;
    x =  x * this.canvas.width;
    y =  y * this.canvas.height;

    return {"x": x, "y": y};
  }

}

onmessage = function(e) {
  switch (e.data.msg) {
    case "setCanvas":
      webWorkerCanvas = new WebWorkerCanvas(e.data.canvas);
      break;
    case "setBounding":
      webWorkerCanvas.bounding = e.data.bounding[0];
      break;
    case "setTool":
      webWorkerCanvas.tools[e.data.name] = e.data.tool;
    case "event":
      let event = new CustomEvent(e.data.event[1], {detail: e.data.event[0]});
      webWorkerCanvas.canvas.dispatchEvent(event);
      break;
    default:
  }
};
