
class Layer {
  constructor(name, parent = document.body) {
    this.canvas = new Canvas(parent);
    this.name = name;
    this.listener = false;
    this.usable = true;
    this.worksteps = new WorkSteps();
  }

  delete() {
    this.canvas.delete();
  }
}
