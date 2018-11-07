const getFirstFile = files => files[0]

var Audio = {
  file: null, //the current file
  fileName: null, //the current file name
  audioContext: null,
  source: null, //the audio source
  info: null,
  infoUpdateId: null, //to store the setTimeout ID and clear the interval
  animationId: null,
  isPlaying: false, //flag for sound is playing 1 or stopped 0
  forceStop: false,
  audioDataArray: [],
  analyser: null,
  frequencies: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 40 positions
  audioBufferSourceNode: null,
  startedAt: null,
  pausedAt: null,
  buffer: null,

  init: function() {
    this.prepareAPI();
    this.addEventListeners();
    this.info = $('#info').innerHTML; //this used to upgrade the UI information
  },
  prepareAPI: function() {
    //fix browser vendor for AudioContext and requestAnimationFrame
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
    try {
      this.audioContext = new AudioContext();
    } catch (e) {
      this.updateInfo('!Your browser does not support AudioContext', false);
      console.log(e);
    }
  },
  addEventListeners: function() {
    var that = this,
      audioInput = document.getElementById('uploadedFile'),
      dropContainer = document.getElementsByTagName("body")[0]
    // when the file is uploaded by button
    audioInput.onchange = function() {
      if (!that.audioContext) {
        return
      }

      //the if statement fixes the file selection cancel, because the onchange will trigger even if the file selection been cancelled
      if (audioInput.files.length !== 0) {
        that.file = getFirstFile(audioInput.files)
        that.fileName = that.file.name;
        if (that.isPlaying) {
          //the sound is still playing but we upload another file, so set the forceStop flag to true
          that.forceStop = true;
        };
        document.getElementById('upload-music').style.opacity = 1;
        that.updateInfo('Uploading', true);
        //once the file is ready, start running the audio
        that.start();
      };
    };
    // drag & drop
    dropContainer.addEventListener("dragenter", function() {
      document.getElementById('upload-music').style.opacity = 1;
      that.updateInfo('Drop it on the page', true);
    }, false);
    // drag over effect
    dropContainer.addEventListener("dragover", function(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }, false);
    // drag leave effect
    dropContainer.addEventListener("dragleave", function() {
      document.getElementById('upload-music').style.opacity = 0.2;
      that.updateInfo(that.info, false);
    }, false);
    // dropped
    dropContainer.addEventListener("drop", function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (that.audioContext===null) {return;};
      document.getElementById('upload-music').style.opacity = 1;
      that.updateInfo('Uploading', true);
      that.file = e.dataTransfer.files[0];
      if (that.isPlaying) {
        that.forceStop = true;
      };
      that.fileName = that.file.name;
      //once the file is ready, start running the audio
      that.start();
    }, false);
  },
  start: function(startTime) {
    console.log("we are in start");

    //read and decode the file into audio array buffer
    var that = this,
      file = this.file,
      fr = new FileReader();
    // After file is loaded, event
    fr.onload = function(e) {
      var fileResult = e.target.result;
      var audioContext = that.audioContext;
      if (audioContext === null) {
        return;
      };
      that.updateInfo('Decoding the audio', true);
      audioContext.decodeAudioData(fileResult, function(buffer) {
        that.updateInfo('Decode succussfully,start the visualizer', true);
        Audio.buffer = buffer;
        that.visualize(audioContext, buffer);
      }, function(e) {
        that.updateInfo('!Fail to decode the file', false);
        console.log(e);
      });
    };
    fr.onerror = function(e) {
      that.updateInfo('!Fail to read the file', false);
      console.log(e);
    };
    //assign the file to the reader
    this.updateInfo('Starting read the file', true);
    fr.readAsArrayBuffer(file);
  },
  visualize: function(audioContext, buffer, startedAt, audioBufferSourceNode) {
    console.log("we are in visualize");
    Audio.audioBufferSourceNode = audioContext.createBufferSource(),
      that = this;
    this.analyser = audioContext.createAnalyser();
    // connect the source to the analyser
    Audio.audioBufferSourceNode.connect(this.analyser);
    // connect the analyser to the destination(the speaker), or we won't hear the sound
    this.analyser.connect(audioContext.destination);
    // then assign the buffer to the buffer source node
    Audio.audioBufferSourceNode.buffer = buffer;
    // conditional for old browsers
    if (!Audio.audioBufferSourceNode.start) {
      Audio.audioBufferSourceNode.start = Audio.audioBufferSourceNode.noteOn //in old browsers use noteOn method
      Audio.audioBufferSourceNode.stop = Audio.audioBufferSourceNode.noteOff //in old browsers use noteOff method
    };
    // stop the previous animation frame and sound if they are still happening
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.source !== null) {
      this.source.stop(0);
    }
    if (this.pausedAt) {
      // resume playing song if paused
      this.startedAt = Date.now() - this.pausedAt;
      Audio.audioBufferSourceNode.start(0, this.pausedAt / 1000);
    } else {
      // play the source, start of audio for the first time
      this.startedAt = Date.now();
      Audio.audioBufferSourceNode.start(startedAt || 0);
    }
    this.isPlaying = true;
    this.source = Audio.audioBufferSourceNode;
    Audio.audioBufferSourceNode.onended = function() {
      that.audioEnd(that);
    };
    this.updateInfo('Playing ' + this.fileName, false);
    this.info = 'Playing ' + this.fileName;
    document.getElementById('upload-music').style.opacity = 0.2;
    // make sure last animate loop is cancelled before starting it again
    console.log("cancelling last animation");
    cancelAnimationFrame(Visualizer.nextAnimation);
    console.log("starting new animation");
    Visualizer.animate();
  },
  drawFrequencies: function(analyser) {
    // sends array of 1024 ffts to music impact
    Audio.audioDataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(Audio.audioDataArray);
    Visualizer.musicImpact(Audio.audioDataArray);
  },
  pause: function() {
    // pauses current song
    this.audioBufferSourceNode.stop(0);
    this.isPlaying = false;
    this.pausedAt = Date.now() - this.startedAt;
  },
  audioEnd: function(instance) {
    if (this.forceStop) {

      this.forceStop = false;
      this.isPlaying = true;
    } else {
      this.isPlaying = false;
      document.getElementById('upload-music').style.opacity = 1;
      instance.info = "Audio Ended";
      document.getElementById('uploadedFile').value = '';
    }
  },
  updateInfo: function(text, processing) {
    var infoBar = document.getElementById('info'),
      dots = '...',
      i = 0,
      that = this;
    infoBar.innerHTML = text + dots.substring(0, i++);
    if (this.infoUpdateId !== null) {
      clearTimeout(this.infoUpdateId);
    };
    if (processing) {
      //animate dots at the end of the info text
      var animateDot = function() {
        if (i > 3) {
          i = 0
        };
        infoBar.innerHTML = text + dots.substring(0, i++);
        that.infoUpdateId = setTimeout(animateDot, 250);
      }
      this.infoUpdateId = setTimeout(animateDot, 250);
    };
  }
}