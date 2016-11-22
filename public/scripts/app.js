$(function(){

var audio_analysis = {
"segments":[{"start":0.00000, "duration":0.49469, "confidence":1.000, "loudness_start":-60.000, "loudness_max_time":0.03133, "loudness_max":-15.084, "pitches":[0.006, 0.041, 0.007, 0.010, 0.016, 0.054, 1.000, 0.030, 0.008, 0.006, 0.013, 0.005], "timbre":[33.189, -17.584, -48.494, 46.152, 75.309, 153.949, -7.804, 26.707, -11.141, 74.598, 102.016, -22.742]}, {"start":0.49469, "duration":0.47546, "confidence":1.000, "loudness_start":-36.204, "loudness_max_time":0.01161, "loudness_max":-12.368, "pitches":[0.021, 0.046, 0.017, 0.019, 0.029, 0.082, 1.000, 0.050, 0.019, 0.016, 0.022, 0.016], "timbre":[40.282, 13.119, 36.305, 114.235, 97.965, -67.018, -28.116, 0.576, 9.920, -27.102, -20.557, 9.529]}, {"start":0.97016, "duration":0.31791, "confidence":1.000, "loudness_start":-33.517, "loudness_max_time":0.01646, "loudness_max":-14.604, "pitches":[0.003, 0.008, 0.003, 0.004, 0.041, 0.013, 0.051, 0.011, 0.019, 1.000, 0.025, 0.005], "timbre":[40.128, -25.045, -30.182, 53.893, 62.955, -39.410, -65.590, 0.233, 17.763, -19.026, -11.399, -5.479]}, {"start":1.28807, "duration":0.15764, "confidence":0.239, "loudness_start":-29.909, "loudness_max_time":0.01800, "loudness_max":-25.608, "pitches":[0.009, 0.016, 0.007, 0.005, 0.037, 0.015, 0.149, 0.019, 0.032, 1.000, 0.066, 0.008], "timbre":[30.541, -28.840, 19.838, 18.389, 35.749, -55.093, -70.727, -1.894, 7.775, -11.003, 8.896, -9.186]}, {"start":1.44571, "duration":0.31918, "confidence":1.000, "loudness_start":-34.498, "loudness_max_time":0.01445, "loudness_max":-12.839, "pitches":[0.033, 1.000, 0.025, 0.008, 0.007, 0.023, 0.045, 0.009, 0.025, 0.049, 0.009, 0.011], "timbre":[40.895, 3.496, -1.927, 80.859, 83.876, -46.716, -58.338, 11.325, 30.689, -16.050, -16.833, -2.829]}, {"start":1.76490, "duration":0.13914, "confidence":0.378, "loudness_start":-31.370, "loudness_max_time":0.00827, "loudness_max":-25.282, "pitches":[0.056, 1.000, 0.056, 0.008, 0.018, 0.018, 0.038, 0.008, 0.048, 0.472, 0.049, 0.012], "timbre":[31.197, -30.020, 30.446, 19.951, 72.013, -60.645, -36.863, -9.358, 7.107, -5.808, -3.157, 3.565]}, {"start":1.90404, "duration":0.49451, "confidence":1.000, "loudness_start":-32.181, "loudness_max_time":0.03019, "loudness_max":-14.234, "pitches":[0.011, 0.062, 0.013, 0.011, 0.019, 0.047, 1.000, 0.029, 0.011, 0.052, 0.015, 0.004], "timbre":[36.928, -39.004, -33.461, 70.323, 56.640, 35.903, -36.715, 21.571, 0.611, 3.973, 23.886, -17.491]}, {"start":2.39855, "duration":0.47510, "confidence":1.000, "loudness_start":-34.743, "loudness_max_time":0.01327, "loudness_max":-12.812, "pitches":[0.016, 0.094, 0.013, 0.013, 0.021, 0.057, 1.000, 0.039, 0.018, 0.050, 0.017, 0.009], "timbre":[40.546, 4.742, 39.111, 111.738, 99.930, -52.924, -23.020, 3.107, 0.151, -31.670, -16.368, 4.018]}, {"start":2.87365, "duration":0.47519, "confidence":1.000, "loudness_start":-32.373, "loudness_max_time":0.01433, "loudness_max":-14.191, "pitches":[0.010, 0.033, 0.010, 0.011, 0.060, 0.028, 0.123, 0.026, 0.059, 1.000, 0.037, 0.014], "timbre":[38.736, -28.873, -32.499, 80.610, 61.332, -45.566, -65.318, 5.973, 14.839, -25.156, -11.755, -7.100]}, {"start":3.34884, "duration":0.32050, "confidence":1.000, "loudness_start":-35.373, "loudness_max_time":0.01583, "loudness_max":-12.776, "pitches":[0.031, 1.000, 0.028, 0.008, 0.007, 0.019, 0.038, 0.010, 0.027, 0.053, 0.006, 0.009], "timbre":[40.612, 4.694, 3.495, 76.177, 80.326, -54.299, -56.483, 13.305, 25.905, -13.933, -13.071, -1.888]}, {"start":3.66934, "duration":0.15574, "confidence":0.201, "loudness_start":-30.554, "loudness_max_time":0.01243, "loudness_max":-25.299, "pitches":[0.046, 1.000, 0.044, 0.008, 0.013, 0.018, 0.025, 0.007, 0.048, 0.613, 0.049, 0.010], "timbre":[31.028, -28.534, 32.266, 21.129, 57.408, -63.534, -32.995, 3.984, 5.000, -11.734, 5.315, 9.270]}, {"start":3.82508, "duration":0.47737, "confidence":1.000, "loudness_start":-32.612, "loudness_max_time":0.01384, "loudness_max":-14.791, "pitches":[0.011, 0.055, 0.011, 0.010, 0.018, 0.046, 1.000, 0.027, 0.011, 0.044, 0.018, 0.005], "timbre":[38.334, -38.601, -42.380, 70.869, 42.265, -45.988, -55.328, 2.822, 2.120, -20.452, -18.068, -9.067]}, {"start":4.30245, "duration":0.32422, "confidence":1.000, "loudness_start":-35.923, "loudness_max_time":0.01596, "loudness_max":-11.212, "pitches":[0.014, 0.064, 0.008, 0.007, 0.010, 0.028, 1.000, 0.021, 0.014, 0.035, 0.013, 0.008], "timbre":[42.227, 19.454, 48.475, 103.860, 101.302, -61.519, -28.677, -3.530, 5.673, -21.381, -8.441, 8.706]}, {"start":4.62667, "duration":0.15111, "confidence":0.034, "loudness_start":-26.945, "loudness_max_time":0.00851, "loudness_max":-23.657, "pitches":[0.009, 0.057, 0.007, 0.006, 0.015, 0.059, 1.000, 0.040, 0.014, 0.041, 0.014, 0.005], "timbre":[31.796, 5.437, 67.746, 51.783, 86.078, -79.653, 1.970, 10.939, -1.535, -2.383, -9.784, -12.956]}, {"start":4.77778, "duration":0.32014, "confidence":1.000, "loudness_start":-32.039, "loudness_max_time":0.01656, "loudness_max":-13.363, "pitches":[0.004, 0.017, 0.010, 0.010, 0.044, 0.013, 0.053, 0.012, 0.031, 1.000, 0.024, 0.007], "timbre":[40.262, -26.929, -39.268, 65.175, 58.222, -42.156, -67.737, 8.113, 14.612, -24.940, -12.992, -8.213]}]}

var camera, scene, renderer, boxes = [],
    box,
    circle,
    urls = [],
    skyTextures = [],
    cubeMap,
    circles = [],
    boxGeometry,
    boxMaterial,
    mesh, controls, fog;

var properties = {
    box: {
        color: '#35a7af',
        quantity: 10,
        x_size: 5,
        y_size: 3,
        z_size: 4,
        wireframe: false,
        opacity: 0.5,
        transparent: true
    },
    circle: {
        color: '#eee',
        quantity: 3,
        x_size: 6,
        y_size: 2,
        z_size: 4,
        wireframe: true,
        opacity: 0.6,
        transparent: true
    }
}

/////////////// MUSIC ///////////////

var position_in_segments = 1,
    loudness,
    duration = 0;

// DEFUNCT SPOTIFY, NEED TO REMOVE

function loadFirstBeat () {
  loudness = audio_analysis.segments[0].loudness_start;
}

function playBeat() {
  if (position_in_segments >= audio_analysis.segments.length - 1) {
    return;
  }
  // change value
  let x = loudness/(-60);
  musicImpact(x);
  // load next beat
  loudness = audio_analysis.segments[position_in_segments].loudness_start;
  duration = audio_analysis.segments[position_in_segments].duration;
  duration *= 1000;
  position_in_segments++;
  // console.log(duration);
  setTimeout(playBeat, duration);
}

// PREPARE AUDIO CONTEXT



// VisualizerContext.shapes = AudioContext.newshape;


var AudioContext = function() {

var file = null, //the current file
  fileName = null, //the current file name
  audioContext = null,
  source = null, //the audio source
  info = document.getElementById('info').innerHTML, //this used to upgrade the UI information  infoUpdateId = null, //to store the setTimeout ID and clear the interval
  animationId = null,
  status = 0, //flag for sound is playing 1 or stopped 0
  forceStop = false,
  allCapsReachBottom = false;

var _prepareAPI = function() {
  //fix browser vendor for AudioContext and requestAnimationFrame
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
  window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
  try {
    audioContext = new AudioContext();
  } catch (e) {
    _updateInfo('!Your browser does not support AudioContext', false);
    console.log(e);
  }
}
var _addEventListener = function() {

  // file upload button
  var $audioInput = $('#uploadedFile');
  var audioInput = $audioInput[0];

  $audioInput.on('change', function() {
    if (audioContext === null) {return;};
    //the if statement fixes the file selection cancel, because the onchange will trigger even if the file selection been cancelled
    if (audioInput.files.length !== 0) {
      //only process the first file
      that.file = audioInput.files[0];
      that.fileName = that.file.name;
      console.log();
      if (that.status === 1) {
        //the sound is still playing but we upload another file, so set the forceStop flag to true
        that.forceStop = true;
      };
      document.getElementById('upload-music').style.opacity = 1;
      that._updateInfo('Uploading', true);
      //once the file is ready,start the visualizer
      that._start();
    };
  });

  //listen the drag & drop
  dropContainer = document.getElementById("threeCanvas");
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
}
_start = function() {
  //read and decode the file into audio array buffer
  var that = this,
    file = this.file,
    fr = new FileReader();
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
}
_visualize = function(audioContext, buffer) {
  var audioBufferSouceNode = audioContext.createBufferSource(),
    analyser = audioContext.createAnalyser(),
    that = this;
  //connect the source to the analyser
  audioBufferSouceNode.connect(analyser);
  //connect the analyser to the destination(the speaker), or we won't hear the sound
  analyser.connect(audioContext.destination);
  //then assign the buffer to the buffer source node
  audioBufferSouceNode.buffer = buffer;
  //play the source
  if (!audioBufferSouceNode.start) {
    audioBufferSouceNode.start = audioBufferSouceNode.noteOn //in old browsers use noteOn method
    audioBufferSouceNode.stop = audioBufferSouceNode.noteOff //in old browsers use noteOff method
  };
  //stop the previous sound if any
  if (this.animationId !== null) {
    cancelAnimationFrame(this.animationId);
  }
  if (this.source !== null) {
    this.source.stop(0);
  }
  audioBufferSouceNode.start(0);
  this.status = 1;
  this.source = audioBufferSouceNode;
  audioBufferSouceNode.onended = function() {
    that._audioEnd(that);
  };
  this._updateInfo('Playing ' + this.fileName, false);
  this.info = 'Playing ' + this.fileName;
  document.getElementById('upload-music').style.opacity = 0.2;
  this._drawSpectrum(analyser);
}
_drawSpectrum = function(analyser) {
  var that = this,
    canvas = document.getElementById('canvas'),
    cwidth = canvas.width,
    cheight = canvas.height - 2,
    meterWidth = 10, //width of the meters in the spectrum
    gap = 2, //gap between meters
    capHeight = 2,
    capStyle = '#fff',
    meterNum = 800 / (10 + 2), //count of the meters
    capYPositionArray = []; //store the vertical position of the caps for the previous frame
  ctx = canvas.getContext('2d'),
  gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(1, '#0f0');
  gradient.addColorStop(0.5, '#ff0');
  gradient.addColorStop(0, '#f00');
  var drawMeter = function() {
    var array = new Uint8Array(analyser.frequencyBinCount);
    console.log(analyser);
    analyser.getByteFrequencyData(array);
    if (that.status === 0) {
      //fix when some sounds end the value still not back to zero
      for (var i = array.length - 1; i >= 0; i--) {
        array[i] = 0;
      };
      allCapsReachBottom = true;
      for (var i = capYPositionArray.length - 1; i >= 0; i--) {
        allCapsReachBottom = allCapsReachBottom && (capYPositionArray[i] === 0);
      };
      if (allCapsReachBottom) {
        cancelAnimationFrame(that.animationId); //since the sound is stopped and animation finished, stop the requestAnimation to prevent potential memory leak, THIS IS VERY IMPORTANT!
        return;
      };
    };
    var step = Math.round(array.length / meterNum); //sample limited data from the total array
    ctx.clearRect(0, 0, cwidth, cheight);
    for (var i = 0; i < meterNum; i++) {
      var value = array[i * step];
      if (capYPositionArray.length < Math.round(meterNum)) {
        capYPositionArray.push(value);
      };
      ctx.fillStyle = capStyle;
      //draw the cap, with transition effect
      if (value < capYPositionArray[i]) {
        ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
      } else {
        ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
        capYPositionArray[i] = value;
      };
      ctx.fillStyle = gradient; //set the fillStyle to gradient for a better look
      ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
    }
    that.animationId = requestAnimationFrame(drawMeter);
  }
  this.animationId = requestAnimationFrame(drawMeter);
}
_audioEnd = function(instance) {
  if (this.forceStop) {
    this.forceStop = false;
    this.status = 1;
    return;
  };
  this.status = 0;
  var text = 'HTML5 Audio API showcase | An Audio Visualizer';
  document.getElementById('upload-music').style.opacity = 1;
  document.getElementById('info').innerHTML = text;
  instance.info = text;
  document.getElementById('uploadedFile').value = '';
}
_updateInfo = function(text, processing) {
  var infoBar = document.getElementById('uploadedFile'),
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


////////////END TEST AREA, HARD HATS OFF ///
////////////////////////////////////////////
////////////////////////////////////////////

function init(properties) {

  camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 9000);
  camera.position.z = 1400;

  controls = new THREE.TrackballControls(camera, document.getElementById('threeCanvas'));
  controls.addEventListener('change', sceneRender);

  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog( 0x71757a, 10, 200 );
  // scene.fog = new THREE.FogExp2( 0x71757a, 0.0007 );



///// THIS IS SHIT TO IMPLEMENT A BACKGROUND ///////////////

  // var names = ["posz","negz","posy","negy","posx","negx"];

  // var i;
  // for (i = 0; i < 6; i++) {
  //   urls[i] = "textures/" + names[i] + ".jpg";
  //   skyTextures[i] = THREE.TextureLoader(urls[i]);
  // }

  // var skyMaterials = [];
  // skyMaterials.push(new THREE.MeshBasicMaterial({ map: skyTextures[0] }));
  // skyMaterials.push(new THREE.MeshBasicMaterial({ map: skyTextures[1] }));
  // skyMaterials.push(new THREE.MeshBasicMaterial({ map: skyTextures[2] }));
  // skyMaterials.push(new THREE.MeshBasicMaterial({ map: skyTextures[3] }));
  // skyMaterials.push(new THREE.MeshBasicMaterial({ map: skyTextures[4] }));
  // skyMaterials.push(new THREE.MeshBasicMaterial({ map: skyTextures[5] }));

  // console.log(urls);
  // dome = new THREE.Mesh( new THREE.BoxGeometry( 9000, 9000, 9000, 1, 1,1, skyMaterials,true), new THREE.MeshBasicMaterial() );
  // scene.add(dome);

  // cubeMap = new THREE.CubeTextureLoader(urls);


/////// THIS IS SHIT TO DO A LIGHT //////////////

  // var light = new THREE.PointLight(0xffffff);
  // light.position.set(60, 0, 20);
  // scene.add(light);
  // var lightAmb = new THREE.AmbientLight(0xffffff);
  // scene.add(lightAmb);




    makeBox();

    makeCircle();

  /////// GUI //////////////
  var gui = new dat.GUI({ autoPlace: false, preset: properties });

  var customContainer = document.getElementById('my-gui-container');
  customContainer.appendChild(gui.domElement);
  gui.remember(properties);

  var folder1 = gui.addFolder('Boxes');
  var boxColor = folder1.addColor(properties.box, 'color').name('Color').listen();
  var boxQuantity = folder1.add(properties.box, 'quantity', 0, 15).name('Quantity');
  var boxWireframe = folder1.add(properties.box, 'wireframe').name('Wireframe');
  var boxOpacity = folder1.add(properties.box, 'opacity' ).min(0).max(1).step(0.01).name('Opacity');
  // folder1.open();

  var folder2 = gui.addFolder('Circles');
  var circleColor = folder2.addColor(properties.circle, 'color').name('Color').listen();
  var circleQuantity = folder2.add(properties.circle, 'quantity', 0, 15).name('Quantity').step(1);
  var circleWireframe = folder2.add(properties.circle, 'wireframe').name('Wireframe');
  var circleOpacity = folder2.add(properties.circle, 'opacity' ).min(0).max(1).step(0.01).name('Opacity');
  // folder2.open();

  boxColor.onChange(function(value) {
    box.material.color.setHex( value.replace("#", "0x") );
  });

  boxQuantity.onChange(function(value) {
    boxes.forEach(function(box) {
      scene.remove(box);
    });
    makeBox(value);
  });

  boxWireframe.onChange(function(value) {
    boxes.forEach(function(box) {
      scene.remove(box);
    });
    makeBox(box.quantity);
  });

  boxOpacity.onChange(function(value) {
    box.material.opacity = value;
  });

  circleColor.onChange(function(value)  {
    circle.material.color.setHex( value.replace("#", "0x") );
  });

  circleQuantity.onChange(function(value) {
    circles.forEach(function(circle) {
      scene.remove(circle);
    });
    makeCircle(value);
  });

  circleWireframe.onChange(function(value) {
    circles.forEach(function(circle) {
      scene.remove(circle);
    });
    makeCircle(circle.quantity);
  });

  circleOpacity.onChange(function(value) {
    circle.material.opacity = value;
  });

  gui.open();



  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // universe begins, loads loudness for first instance.
  loadFirstBeat();
  playBeat();
  // music started


}


function makeBox() {
      // BOX /////////////////////
    var realXsize = properties.box.x_size * 100;
    var realYsize = properties.box.y_size * 100;
    var realZsize = properties.box.z_size * 100;

    boxGeometry = new THREE.BoxGeometry(realXsize, realYsize, realZsize);

    boxMaterial = new THREE.MeshBasicMaterial({
        color: properties.box.color,
        wireframe: properties.box.wireframe,
        opacity: properties.box.opacity,
        transparent: properties.box.transparent
    });

    for (var i = 0; i < properties.box.quantity; i++) {
        box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.x = (Math.random() - 0.5) * 3000;
        box.position.y = (Math.random() - 0.5) * 1200;
        box.position.z = (Math.random() - 0.5) * 500;
        scene.add(box);
        // console.log(box);
        boxes.push(box);
    }
}

function makeCircle() {
      // CIRCLE /////////////////
    properties.circle.realXsizeCircle = properties.circle.x_size * 100;
    properties.circle.realYsizeCircle = properties.circle.y_size * 100;
    properties.circle.realZsizeCircle = properties.circle.z_size * 100;


    circleGeometry = new THREE.CircleGeometry(properties.circle.realXsizeCircle, properties.circle.realYsizeCircle, properties.circle.realZsizeCircle);

    circleMaterial = new THREE.MeshBasicMaterial({
        color: properties.circle.color,
        wireframe: properties.circle.wireframe,
        opacity: properties.box.opacity,
        transparent: properties.box.transparent
    });
    for (var i = 0; i < properties.circle.quantity; i++) {
        circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.x = (Math.random() - 0.5) * 3000;
        circle.position.y = (Math.random() - 0.5) * 1200;
        circle.position.z = (Math.random() - 0.5) * 500;
        scene.add(circle);
        circles.push(circle);

    }
}


function animate(properties) {
    requestAnimationFrame(animate);
    controls.update();
    sceneRender();
}

function sceneRender() {
    // console.log(renderer);
    renderer.render(scene, camera);
}

// on music play, render scene

function musicImpact(x) {
// properties.circle.realXsizeCircle += x * 500;
  // console.log("X is:" + x);
  // console.log("Properties circles size:" + properties.circle.x_size);

  boxes.forEach(function(box){

    box.scale.set(x, x, x)
    // circles.scale.set(x, x, x)
  })
}

  $('#my-gui-container').on('click', function(e) {
    sceneRender();
  });

  // Music Preparation
  _prepareAPI();
  _addEventListener();

  // Visuals
  init(properties);
  animate(properties);
  sceneRender();

});




