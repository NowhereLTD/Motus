
class ToolBar {
  constructor(drawmanager, animationmanager, parent = document.body) {
    this.animationmanager = animationmanager;
    this.drawmanager = drawmanager;


    this.element = document.createElement("article");
    this.element.style.position = "fixed";
    this.element.style.bottom = "0";
    this.element.className = "toolbar";
    this.element.classList.add("f--s-0");
    this.element.classList.add("f--e-2");
    parent.appendChild(this.element);

    // Color Picker
    this.colorPicker = document.createElement("input");
    this.colorPicker.type = "color";
    this.colorPicker.value = this.drawmanager.tool.color;
    this.colorPicker.addEventListener("change", function(e){
      this.drawmanager.tool.color = this.colorPicker.value;
    }.bind(this));
    this.element.appendChild(this.colorPicker);


    // Size


    this.sizeSelector = document.createElement("input");
    this.sizeSelector.type = "range";
    this.sizeSelector.name = "points";
    this.sizeSelector.min = "0.1";
    this.sizeSelector.max = "100";
    this.sizeSelector.step = "0.1";
    this.sizeSelector.value = this.drawmanager.tool.size;
    this.sizeSelector.addEventListener("input", function(e){
      this.drawmanager.tool.size = this.sizeSelector.value;
      this.sizeLabel.innerText = this.sizeSelector.value;
    }.bind(this));
    this.element.appendChild(this.sizeSelector);

    this.sizeLabel = document.createElement("label");
    this.sizeLabel.innerText = this.drawmanager.tool.size;
    this.element.appendChild(this.sizeLabel);


    this.opacitySelector = document.createElement("input");
    this.opacitySelector.type = "range";
    this.opacitySelector.name = "points";
    this.opacitySelector.min = "0";
    this.opacitySelector.max = "1";
    this.opacitySelector.step = "0.01";
    this.opacitySelector.value = this.drawmanager.tool.alpha;
    this.opacitySelector.addEventListener("input", function(e){
      this.drawmanager.tool.alpha = this.opacitySelector.value;
      this.opacityLabel.innerText = this.opacitySelector.value;
    }.bind(this));
    this.element.appendChild(this.opacitySelector);

    this.opacityLabel = document.createElement("label");
    this.opacityLabel.innerText = this.drawmanager.tool.alpha;
    this.element.appendChild(this.opacityLabel);

    this.pen = document.createElement("div");
    this.pen.innerHTML = "&#128394;";
    this.pen.style.color = "red";
    this.pen.addEventListener("click", function(){
      this.drawmanager.tool.operation = "source-over";
      this.pen.style.color = "red";
      this.erease.style.color = "black";
    }.bind(this));
    this.element.appendChild(this.pen);

    this.erease = document.createElement("div");
    this.erease.innerHTML = "&#92399;";
    this.erease.addEventListener("click", function(){
      this.drawmanager.tool.operation = "destination-out";
      this.erease.style.color = "red";
      this.pen.style.color = "black";
    }.bind(this));
    this.element.appendChild(this.erease);

    this.importLast = document.createElement("div");
    this.importLast.innerHTML = "&#8688;";

    this.importLast.addEventListener("click", function(){

      let changeEvent = new Event("change");
      let inputEvent = new Event("input");

      let lastToolBar = this.animationmanager.getLastFrame().animationmanagerdata.toolbar;
      this.colorPicker.value = lastToolBar.colorPicker.value;
      this.colorPicker.dispatchEvent(changeEvent);
      this.sizeSelector.value = lastToolBar.sizeSelector.value;
      this.sizeSelector.dispatchEvent(inputEvent);
      this.opacitySelector.value = lastToolBar.opacitySelector.value;
      this.opacitySelector.dispatchEvent(inputEvent);

    }.bind(this));
    this.element.appendChild(this.importLast);




  }

  hide() {
    this.element.style.display = "none";
  }

  show() {
    this.element.style.display = "";
  }
}
