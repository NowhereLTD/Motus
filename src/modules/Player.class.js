
class Player {
  constructor(animationmanager, parent = document.body) {
    this.animationmanager = animationmanager;
    this.images = [];
    this.playerElement = document.createElement("article");
    this.playerElement.classList.add("player");
    this.playerElement.style.display = "none";
    parent.appendChild(this.playerElement);
    this.player = new Canvas(this.playerElement);
    this.playerCTX = this.player.element.getContext("2d");
    this.recording = new Recording(this);

    this.playButton = document.createElement("button");
    this.playButton.innerText = "Play";
    this.playerElement.appendChild(this.playButton);
    this.playButton.addEventListener("click", function(){
      this.play();
    }.bind(this));


    this.renderButton = document.createElement("button");
    this.renderButton.innerText = "Render";
    this.playerElement.appendChild(this.renderButton);
    this.renderButton.addEventListener("click", function(){
      this.render();
    }.bind(this));


    this.closeButton = document.createElement("button");
    this.closeButton.innerText = "Close";
    this.playerElement.appendChild(this.closeButton);
    this.closeButton.addEventListener("click", function(){
      this.hide();
    }.bind(this));

    this.showButton = document.createElement("button");
    this.showButton.innerText = "Video";
    this.showButton.classList.add("videobutton");
    parent.appendChild(this.showButton);
    this.showButton.addEventListener("click", function(){
      this.show();
    }.bind(this));

    this.downloadLink = document.createElement("a");
    this.downloadLink.innerText = "Download";
    this.playerElement.appendChild(this.downloadLink);

    this.logdataElement = document.createElement("article");
    this.playerElement.appendChild(this.logdataElement);
    this.clearLog();

  }

  render() {
    this.images = [];

    let frames = this.animationmanager.framemanager.frames;

    this.log("start rendering...");

    for(let i=0; i<frames.length; i++) {
      let drawmanager = frames[i].animationmanagerdata.drawmanager;
      drawmanager.renderCompleteImage().then(response => {
        let imagedata = response[0].element.toDataURL("image/png");

        let image = new Image();
        image.src = imagedata;
        image.onload = function(){
          this.images[i] = image;
          this.log("complete render image " + i);
        }.bind(this);
      });
    }
  }

  play(image = 0) {
    if(image == 0) {
      this.recording.start();
    }
    let frames = this.animationmanager.framemanager.frames;

    if(this.images[image]) {
      this.playerCTX.clearRect(0, 0, this.player.element.width, this.player.element.height);
      this.playerCTX.drawImage(this.images[image], 0, 0);
      setTimeout(function(){image++; this.play(image)}.bind(this), frames[image].duration);
    }else{
      if(this.recording.record) {
        this.recording.stop();
      }
      return true;
    }
  }

  log(text) {
    this.logdataElement.innerHTML = this.logdataElement.innerHTML + text + "<br />";
    this.logdataElement.scrollTop = this.logdataElement.scrollHeight;
  }

  clearLog() {
    this.logdataElement.innerHTML = "<h3>Log</h3>";
  }

  show() {
    this.playerElement.style.display = "";
    this.render();
  }

  hide() {
    this.playerElement.style.display = "none";
  }
}


class Recording {
  constructor(player) {

    this.player = player;
    this.canvas = this.player.player;
    this.record = false;
  }

  start() {

    this.player.log("start recording...");

    this.record = true;

    this.chunks = [];
    this.stream = this.canvas.element.captureStream();
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.addEventListener("dataavailable", function(e) {
      this.chunks.push(e.data);
    }.bind(this));

    this.recorder.addEventListener("stop", function(e) {
      this.export(new Blob(this.chunks, {type: 'video/webm'}));
    }.bind(this));

    this.recorder.start();
  }

  export(blob) {
    this.player.downloadLink.download = "video.webm";
    this.player.downloadLink.href = URL.createObjectURL(blob);
    this.player.log("complete recording...");
  }

  stop() {
    this.recorder.stop();
    this.record = false;
  }
}
