

addEventListener("load", function(){
  let animationmanager = new AnimationManager();
  let player = new Player(animationmanager);

  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    return false;
  });
/*
  let canvas = document.createElement("canvas");
  canvas.style.background = "#FFF";
  canvas.width = 500;
  canvas.height = 500;
  document.body.appendChild(canvas);
  canvasBounding = canvas.getBoundingClientRect();
  let offscreen = canvas.transferControlToOffscreen();

  let worker = new Worker("./src/modules/Canvas.worker.class.js");
  worker.postMessage({msg: "setCanvas", canvas: offscreen}, [offscreen]);
  worker.postMessage({msg: "setBounding", bounding: [canvasBounding]});

  let eventTypes = ["mousedown", "mouseup", "mousemove", "mouseout", "mouseenter", "touchmove", "touchstart", "touchend", "touchcancel"];
  for(let i=0; i<eventTypes.length; i++){
    canvas.addEventListener(eventTypes[i], function(e){
      switch (e.type) {
        case "touchmove":
          for(let i1=0; i1<e.touches.length; i1++) {
            worker.postMessage({msg: "event", event: [{"x": e.touches[i1].clientX, "y": e.touches[i1].clientY, "force": e.touches[i1].force}, e.type]});
          }
          break;
        case "mousemove":
          let pressmouse = false;
          if(e.buttons == 1){
            pressmouse = true;
          }
          worker.postMessage({msg: "event", event: [{"x": e.pageX, "y": e.pageY, "pressmouse": pressmouse}, e.type]});
        default:
          worker.postMessage({msg: "event", event: [{"x": e.pageX, "y": e.pageY}, e.type]});
      }
    });
  }
*/
});
