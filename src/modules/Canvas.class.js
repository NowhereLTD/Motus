
class Canvas {
  constructor(parent = document.body, width = 2160, height = 2160) {
    this.width = width;
    this.height = height;
    this.element = document.createElement("canvas");
    this.element.width = this.width;
    this.element.height = this.height;
    this.element.style.border = "1px solid black";

    if(parent) {
      parent.appendChild(this.element);
    }
  }

  delete() {
    this.element.parentElement.removeChild(this.element);
  }
}
