

class AnimationManager {
  constructor(parent = document.body) {
    this.framemanager = new FrameManager(this);
    let frame = this.framemanager.addFrame();
    frame.animationmanagerdata.show();

    this.frameSettingWindow = new FrameSettingWindow(this, parent);
    this.selectedFrame = frame;

    for(let i=0; i<5; i++) {
      let frame = this.framemanager.addFrame();
    }

    this.element = document.createElement("article");
    this.element.classList.add("animationmanager");
    this.element.classList.add("f--s-2");
    this.element.classList.add("f--e-8");
    parent.appendChild(this.element);

    this.generateFrames();

  }

  generateFrames() {
    this.element.innerHTML = "";

    for(let i=0; i<this.framemanager.frames.length; i++){
      let frameElement = document.createElement("section");
      frameElement.classList.add("animationframe");
      frameElement.style.width = this.framemanager.frames[i].duration / 30 + 20 + "px";
      frameElement.style.flex = "0 0 " + (this.framemanager.frames[i].duration / 30 + 20) + "px"
      this.element.appendChild(frameElement);

      if(this.selectedFrame == this.framemanager.frames[i]) {
        frameElement.classList.add("selectedanimationframe");
      }

      this.framemanager.frames[i].element = frameElement;

      frameElement.addEventListener("click", function(){
        this.selectFrame(this.framemanager.frames[i]);
        if(this.framemanager.frames[i-1]) {

          let lastframe = this.framemanager.frames[i-1].animationmanagerdata.drawmanager;
          lastframe.renderCompleteImage().then(response => {
            let lastframeimage = response[0].element.toDataURL("image/png");

            this.framemanager.frames[i].animationmanagerdata.drawmanager.clearCanvas(this.framemanager.frames[i].animationmanagerdata.drawmanager.backgroundLayer);

            let background = new Image();
            background.src = lastframeimage;
            this.framemanager.frames[i].animationmanagerdata.drawmanager.backgroundCTX.filter = "opacity(30%)";
            background.onload = function(){
              this.framemanager.frames[i].animationmanagerdata.drawmanager.backgroundCTX.drawImage(background, 0, 0);
            }.bind(this);

          });


        }
      }.bind(this));

      frameElement.addEventListener("contextmenu", function(e) {
        this.frameSettingWindow.show(this.framemanager.frames[i]);
        e.preventDefault();
        return false;
      }.bind(this));
    }

    this.addNewFrameElement = document.createElement("section");
    this.addNewFrameElement.classList.add("addframe");
    this.addNewFrameElement.innerText = "+";
    this.element.appendChild(this.addNewFrameElement);
    this.addNewFrameElement.addEventListener("click", function() {
      this.addFrame();
      this.element.scrollTo(this.framemanager.frames.length * 100 + 10, 0);
    }.bind(this));
  }

  addFrame() {
    let frame = this.framemanager.addFrame();
    this.generateFrames();
  }

  selectFrame(frame) {
    this.selectedFrame.animationmanagerdata.hide();
    this.selectedFrame.element.classList.remove("selectedanimationframe");

    frame.animationmanagerdata.show();
    this.selectedFrame = frame;
    frame.element.classList.add("selectedanimationframe");
  }

  getLastFrame() {
    for(let i=0; i<this.framemanager.frames.length; i++){
      if(this.framemanager.frames[i] == this.selectedFrame){
        if(i != 0){
          return this.framemanager.frames[i-1];
        }else{
          return this.selectedFrame;
        }
      }
    }
  }
}



class FrameManager {
  constructor(animationmanager) {
    this.animationmanager = animationmanager;
    this.frames = [];
    this.framesElement = document.createElement("article");
    document.body.appendChild(this.framesElement);
  }

  addFrame() {
    let frame = new Frame(this.animationmanager, this.framesElement);
    this.frames.push(frame);
    return this.frames[this.frames.length-1];
  }

  removeFrame(id) {
    delete this.frames[id];
  }
}



class Frame {
  constructor(animationmanager, parent = document.body) {
    this.animationmanager = animationmanager;
    this.animationmanagerdata = new AnimationManagerData(this.animationmanager, parent);
    this.animationmanagerdata.hide();
    this.duration = 1000;
    this.element;
  }
}

class AnimationManagerData {
  constructor(animationmanager, parent = document.body) {
    this.animationmanager = animationmanager;
    this.drawmanager = new DrawManager(parent);
    this.toolbar = new ToolBar(this.drawmanager, this.animationmanager, parent);
    this.layerbar = new LayerBar(this.drawmanager, parent);
    this.shortcuts = new ShortCuts(this.drawmanager, parent);
  }

  hide() {
    this.drawmanager.hide();
    this.toolbar.hide();
    this.layerbar.hide();
    this.shortcuts.active = false;
  }

  show() {
    this.drawmanager.show();
    this.toolbar.show();
    this.layerbar.show();
    this.shortcuts.active = true;
  }
}


class FrameSettingWindow {
  constructor(animationmanager, parent = document.body) {
    this.animationmanager = animationmanager;
    this.frame;
    this.element = document.createElement("article");
    this.element.classList.add("framesettingwindow");
    this.defaultDuration = 1000;

    this.durationSettingElementLabel = document.createElement("section");
    this.durationSettingElementLabel.innerText = "Frame Duration: ";
    this.element.appendChild(this.durationSettingElementLabel);

    this.durationSettingElement = document.createElement("input");
    this.durationSettingElement.type = "number";
    this.durationSettingElementLabel.appendChild(this.durationSettingElement);

    this.allDurationSettingElementLabel = document.createElement("section");
    this.allDurationSettingElementLabel.innerText = "Global Duration: ";
    this.element.appendChild(this.allDurationSettingElementLabel);

    this.allDurationSettingElement = document.createElement("input");
    this.allDurationSettingElement.type = "number";
    this.allDurationSettingElement.value = this.defaultDuration;
    this.allDurationSettingElementLabel.appendChild(this.allDurationSettingElement);


    this.closeButton = document.createElement("button");
    this.closeButton.innerText = "Save and Close";
    this.closeButton.addEventListener("click", function(){
      this.hide();
    }.bind(this));
    this.element.appendChild(this.closeButton);

    parent.appendChild(this.element);

    this.hide();
  }

  show(frame) {
    this.frame = frame;
    this.element.style.display = "";
    this.durationSettingElement.value = this.frame.duration;
  }

  hide() {
    this.element.style.display = "none";

    if(this.frame) {
      this.frame.duration = this.durationSettingElement.value;
      this.animationmanager.generateFrames();
    }

    if(this.allDurationSettingElement.value != this.defaultDuration) {
      for(let i=0; i<this.animationmanager.framemanager.frames.length; i++) {
        let frame = this.animationmanager.framemanager.frames[i];
        frame.duration = this.allDurationSettingElement.value;
      }
      this.animationmanager.generateFrames();
    }
  }
}
