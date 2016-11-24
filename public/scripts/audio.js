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
  allCapsReachBottom: false,
  audioDataArray: [],
  analyser: null,

  init: function() {
    this._prepareAPI();
    this._addEventListener();
    this.info = $('#info').innerHTML; //this used to upgrade the UI information
  },
  _prepareAPI: function() {
    //fix browser vendor for AudioContext and requestAnimationFrame
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
    try {
      this.audioContext = new AudioContext();
    } catch (e) {
      this._updateInfo('!Your browser does not support AudioContext', false);
      console.log(e);
    }
  },
  _addEventListener: function() {
    console.log("we are in addeventlistener");
    var that = this,
      audioInput = document.getElementById('uploadedFile'),
      dropContainer = document.getElementsByTagName("body")[0];
    //listen the file upload
    audioInput.onchange = function() {
      if (that.audioContext===null) {return;};

      //the if statement fixes the file selection cancel, because the onchange will trigger even if the file selection been cancelled
      if (audioInput.files.length !== 0) {
        //only process the first file
        that.file = audioInput.files[0];
        that.fileName = that.file.name;
        if (that.status === 1) {
          //the sound is still playing but we upload another file, so set the forceStop flag to true
          that.forceStop = true;
        };
        document.getElementById('upload-music').style.opacity = 1;
        that._updateInfo('Uploading', true);
        //once the file is ready,start the visualizer
        that._start();
      };
    },
    //listen the drag & drop
    dropContainer.addEventListener("dragenter", function() {
      document.getElementById('upload-music').style.opacity = 1;
      that._updateInfo('Drop it on the page', true);
    }, false);
    dropContainer.addEventListener("dragover", function(e) {
      e.stopPropagation();
      e.preventDefault();
      //set the drop mode
      e.dataTransfer.dropEffect = 'copy';
    }, false);
    dropContainer.addEventListener("dragleave", function() {
      document.getElementById('upload-music').style.opacity = 0.2;
      that._updateInfo(that.info, false);
    }, false);
    dropContainer.addEventListener("drop", function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (that.audioContext===null) {return;};
      document.getElementById('upload-music').style.opacity = 1;
      that._updateInfo('Uploading', true);
      //get the dropped file
      that.file = e.dataTransfer.files[0];
      if (that.status === 1) {
        document.getElementById('upload-music').style.opacity = 1;
        that.forceStop = true;
      };
      that.fileName = that.file.name;
      //once the file is ready,start the visualizer
      that._start();
    }, false);
  },
  _start: function() {
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
      that._updateInfo('Decoding the audio', true);
      audioContext.decodeAudioData(fileResult, function(buffer) {
        that._updateInfo('Decode succussfully,start the visualizer', true);
        that._visualize(audioContext, buffer);
      }, function(e) {
        that._updateInfo('!Fail to decode the file', false);
        console.log(e);
      });
    };
    fr.onerror = function(e) {
      that._updateInfo('!Fail to read the file', false);
      console.log(e);
    };
    //assign the file to the reader
    this._updateInfo('Starting read the file', true);
    fr.readAsArrayBuffer(file);
  },
  _visualize: function(audioContext, buffer) {
    console.log("we are in visualize");
    var audioBufferSouceNode = audioContext.createBufferSource(),
      that = this;
    this.analyser = audioContext.createAnalyser();
    // connect the source to the analyser
    audioBufferSouceNode.connect(this.analyser);
    // connect the analyser to the destination(the speaker), or we won't hear the sound
    this.analyser.connect(audioContext.destination);
    // then assign the buffer to the buffer source node
    audioBufferSouceNode.buffer = buffer;
    // conditional for old browsers
    if (!audioBufferSouceNode.start) {
      audioBufferSouceNode.start = audioBufferSouceNode.noteOn //in old browsers use noteOn method
      audioBufferSouceNode.stop = audioBufferSouceNode.noteOff //in old browsers use noteOff method
    };
    // stop the previous animation frame and sound if they are still happening
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.source !== null) {
      this.source.stop(0);
    }
    // play the source, start of audio for the first time
    audioBufferSouceNode.start(0);
    this.isPlaying = true;
    this.source = audioBufferSouceNode;
    audioBufferSouceNode.onended = function() {
      that._audioEnd(that);
    };
    this._updateInfo('Playing ' + this.fileName, false);
    this.info = 'Playing ' + this.fileName;
    document.getElementById('upload-music').style.opacity = 0.2;
    this._drawSpectrum();
  },
  _drawSpectrum: function() {
    // audioDataArray = new Uint8Array(analyser.frequencyBinCount);
    // analyser.getByteFrequencyData(audioDataArray);

    //alter a field, so that rerender makes things different
    // console.log(this.analyser);
    audioDataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(audioDataArray);
    Visualizer.musicImpact(audioDataArray)
    // Visualizer.audioAlterVisualizer(this.analyser); // TEST CODE
    // var that = this,
    //   canvas = document.getElementById('threeCanvas'),
    //   cwidth = canvas.width,
    //   cheight = (canvas.height - 2),
    //   meterWidth = 10, //width of the meters in the spectrum
    //   gap = 2, //gap between meters
    //   capHeight = 2,
    //   capStyle = '#fff',
    //   meterNum = canvas.width / (meterWidth + gap), //count of the meters
    //   capYPositionArray = []; //store the vertical position of the caps for the previous frame
    // ctx = canvas.getContext('2d'),
    // gradient = ctx.createLinearGradient(0, 0, 0, 300);
    // gradient.addColorStop(1, '#0f0');
    // gradient.addColorStop(0.5, '#ff0');
    // gradient.addColorStop(0, '#f00');
    // var audioAlterVisualizer = function() {

      // if (that.isPlaying === false) {
      //   // fix when some sounds end the value still not back to zero
      //   for (var i = audioDataArray.length - 1; i >= 0; i--) {
      //     audioDataArray[i] = 0;
      //   };
      //   allCapsReachBottom = true;
      //   for (var i = capYPositionArray.length - 1; i >= 0; i--) {
      //     allCapsReachBottom = allCapsReachBottom && (capYPositionArray[i] === 0);
      //   };
      //   if (allCapsReachBottom) {
      //     cancelAnimationFrame(that.animationId); //since the sound is stopped and animation finished, stop the requestAnimation to prevent potential memory leak, THIS IS VERY IMPORTANT!
      //     return;
      //   };
      // };
      // var step = Math.round(audioDataArray.length / meterNum); //sample limited data from the total array
      // ctx.clearRect(0, 0, cwidth, cheight);
      // for (var i = 0; i < meterNum; i++) {
      //   var value = audioDataArray[i * step];
      //   if (capYPositionArray.length < Math.round(meterNum)) {
      //     capYPositionArray.push(value);
      //   };
      //   ctx.fillStyle = capStyle;
      //   //draw the cap, with transition effect
      //   if (value < capYPositionArray[i]) {
      //     ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
      //   } else {
      //     ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
      //     capYPositionArray[i] = value;
      //   };
      //   ctx.fillStyle = gradient; //set the fillStyle to gradient for a better look
      //   ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
      // }
      // that.animationId = requestAnimationFrame(audioAlterVisualizer);
    // }
    // audioAlterVisualizer();
    // this.animationId = requestAnimationFrame(audioAlterVisualizer);
  },
  _audioEnd: function(instance) {
    if (this.forceStop) {
      this.forceStop = false;
      this.isPlaying = true;
      return;
    };
    this.isPlaying = false;
    document.getElementById('upload-music').style.opacity = 1;
    instance.info = text;
    document.getElementById('uploadedFile').value = '';
  },
  _updateInfo: function(text, processing) {
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