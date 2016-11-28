// 'use strict';

// "init" is initializing (one time thing)
// "make" is creating an instance

var Visualizer = {

  camera: null,
  scene: null,
  renderer: null,
  controls: null,
  urls: [],
  skyTextures: [],
  nextAnimation: null,
  perf: {},
  userInput: 1, // should make this variable better
  rainbow: null,
  hex: [],
  backgroundScenes: ['sky', 'colors', 'black'],
  gui: null,

  boxes: [],
  circles: [],
  spheres: [],
  gradientCubes: [],
  cubeMap: null,
  boxGeometry: null,
  boxMaterial: null,
  // fog: null,

  init: function(properties) {
    this.initCamera();
    this.initScene();
    this.initRenderer();
    this.initControls();
    this.initGUI(properties);
    this.initPerf();

    this.makeBackground(properties.background.name);
    this.makeSpotlight();
    this.makeAmbientLight();
    this.makeBox(properties);
    this.makeCircle(properties);
    this.makeSphere(properties);
    this.makeGradientCube(properties);

    window.addEventListener('resize', this.onWindowResize);

    // this.scene.fog = new THREE.Fog( 0x71757a, 10, 200 );
    // this.scene.fog = new THREE.FogExp2( 0x71757a, 0.0007 );
    // adds renderer to DOM
  },
  initCamera: function() {
    // FOV, aspect ratio, near render, far render
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 30000);
    this.camera.position.z = visualizer_properties.camera.z;
  },
  initScene: function() {
    this.scene = new THREE.Scene();
  },
  initControls: function() {
    this.controls = new THREE.TrackballControls(this.camera, document.getElementById('threeCanvas'));
    this.controls.addEventListener('change', this.sceneRender);
  },
  initRenderer: function() {
    this.renderer = new THREE.WebGLRenderer();
      // this.renderer = new THREE.WebGLRenderer({ alpha: true, // allow transparency. Doesn't seem to work
      // antialiasing: true }); // blend colors better, drops performance
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setClearColor( 0x00ff00, 0.5 ); // attempt at making a color show behind background
    document.body.appendChild(this.renderer.domElement);
  },
  initGUI: function(properties) {
    this.gui = new dat.GUI({autoPlace: false, load: properties.load});
    var gui = this.gui;
    var customContainer = document.getElementById('my-gui-container');
    customContainer.appendChild(gui.domElement);
    gui.remember(properties.background, Visualizer.camera.position, properties.box, properties.circle, properties.sphere);

    ////////// BACKGROUND //////////////
    // Display properties
    var backgroundFolder = gui.addFolder('BACKGROUND');
    var backgroundScene = backgroundFolder.add(properties.background, 'name', Visualizer.backgroundScenes ).name('SCENE');
    // Uncomment below line to have circles folder open by default
    backgroundFolder.close();
    // Changes in display properties
    backgroundScene.onChange(function(value) {
      console.log(value);
      Visualizer.makeBackground(value);
    });

    ////////// CAMERA CONTROLS //////////////
    // Camera properties
    var cameraFolder = gui.addFolder('CAMERA');
    var cameraX = cameraFolder.add(Visualizer.camera.position, 'x', -10000, 10000).name('X');
    var cameraY = cameraFolder.add(Visualizer.camera.position, 'y', -10000, 10000).name('Y');
    var cameraZ = cameraFolder.add(Visualizer.camera.position, 'z', -10000, 10000).name('Z');
    // Uncomment below line to have circles folder open by default
    cameraFolder.close();
    // Changes in display properties
    cameraX.onChange(function(value) {
      Visualizer.camera.position.x = value;
    });
    cameraY.onChange(function(value) {
      Visualizer.camera.position.y = value;
    });
    cameraZ.onChange(function(value) {
      Visualizer.camera.position.z = value;
    });
    cameraX.listen(function(value) {
      Visualizer.camera.position.x = value;
    });
    cameraY.listen(function(value) {
      Visualizer.camera.position.y = value;
    });
    cameraZ.listen(function(value) {
      Visualizer.camera.position.z = value;
    });

    ////////// BOXES /////////////////
    // Display properties
    var boxesFolder = gui.addFolder('BOXES');
    var boxQuantity = boxesFolder.add(properties.box, 'quantity', 0, 100).name('QUANTITY');
    var boxWireframe = boxesFolder.add(properties.box, 'wireframe').name('WIREFRAME');
    var boxOpacity = boxesFolder.add(properties.box, 'opacity' ).min(0).max(1).step(0.01).name('OPACITY');
    var boxColor = boxesFolder.addColor(properties.box, 'color').name('COLOR').listen();
    // Uncomment below line to have circles folder open by default
    boxesFolder.close();
    // Changes in display properties
    boxQuantity.onChange(function(value) {
      properties.box.quantity = value;
      Visualizer.makeBox(properties);
    });
    boxWireframe.onChange(function(value) {
      Visualizer.makeBox(properties);
    });
    boxOpacity.onChange(function(value) {
      Visualizer.box.material.opacity = value;
    });
    boxColor.onChange(function(value) {
      Visualizer.box.material.color.setHex( value.replace("#", "0x") );
    });

    ////////// CIRCLES /////////////////
    // Display properties
    var circlesFolder = gui.addFolder('CIRCLES');
    var circleQuantity = circlesFolder.add(properties.circle, 'quantity', 0, 100).name('QUANTITY').step(1);
    var circleWireframe = circlesFolder.add(properties.circle, 'wireframe').name('WIREFRAME');
    var circleOpacity = circlesFolder.add(properties.circle, 'opacity' ).min(0).max(1).step(0.01).name('OPACITY');
    var circleColor = circlesFolder.addColor(properties.circle, 'color1').name('COLOR').listen();
    var circleColor1 = circlesFolder.addColor(properties.circle, 'color2').name('COLOR').listen();
    // Uncomment below line to have circles folder open by default
    circlesFolder.close();
    // Changes in display properties
    circleQuantity.onChange(function(value) {
      properties.circle.quantity = value;
      Visualizer.makeCircle(properties);
    });
    circleWireframe.onChange(function(value) {
      Visualizer.makeCircle(properties);
    });
    circleOpacity.onChange(function(value) {
      Visualizer.circle.material.opacity = value;
      Visualizer.makeCircle(properties);
    });
    circleColor.onChange(function(value)  {
      properties.circle.color1 = value;
      Visualizer.makeCircle(properties);
    });
    circleColor1.onChange(function(value)  {
      properties.circle.color2 = value;
      Visualizer.makeCircle(properties);
    });
    ////////// SPHERES /////////////////
    // Display properties
    var spheresFolder = gui.addFolder('SPHERES');
    var sphereQuantity = spheresFolder.add(properties.sphere, 'quantity', 0, 100).name('Quantity').step(1);
    var sphereWireframe = spheresFolder.add(properties.sphere, 'wireframe').name('Wireframe');
    var sphereOpacity = spheresFolder.add(properties.sphere, 'opacity' ).min(0).max(1).step(0.01).name('Opacity');
    var sphereColor = spheresFolder.addColor(properties.sphere, 'color').name('Color').listen();
    // Comment below line to have circles folder open by default
    spheresFolder.close();
    // Changes in display properties
    sphereColor.onChange(function(value)  {
      sphere.material.color.setHex( value.replace("#", "0x") );
    });
    sphereQuantity.onChange(function(value) {
      properties.sphere.quantity = value;
      Visualizer.makeSphere(properties);
    });
    sphereWireframe.onChange(function(value) {
      Visualizer.makeSphere(properties);
    });
    sphereOpacity.onChange(function(value) {
      sphere.material.opacity = value;
    });

    gui.open();
  },
  initPerf: function() {
    this.perf = {
      active: true,
      frameCounter: 0,
      currSecond: Date.now() / 1000,
      mode: "console",
    };
  },
  perfLogFrame: function() {
    this.perf.frameCounter += 1;
    var currSecond = Date.now() / 1000;
    var numElapsedSeconds = currSecond - this.perf.currSecond;
    if (numElapsedSeconds > 2) {
      var fps = this.perf.frameCounter / numElapsedSeconds;
      if (this.perf.mode = "console") {
        console.log("fps:", Math.floor(fps));
      }
      this.perf.frameCounter = 0;
      this.perf.currSecond = currSecond;
    }
  },
  onWindowResize: function() {
    Visualizer.camera.aspect = window.innerWidth / window.innerHeight;
    Visualizer.camera.updateProjectionMatrix();
    Visualizer.renderer.setSize(window.innerWidth, window.innerHeight);
  },
  makeBackground: function(background) {
    var path = "./textures/" + background + "/";
    var format = ".jpg";
    var paths = [
      path + 'posz' + format, path + 'negz' + format,
      path + 'posy' + format, path + 'negy' + format,
      path + 'posx' + format, path + 'negx' + format
    ];
    var refractionCube = new THREE.CubeTextureLoader().load(paths);
    refractionCube.mapping = THREE.CubeRefractionMapping;
    refractionCube.format = THREE.RGBFormat;

    this.scene.background = refractionCube;
    // Visualizer.renderer.setClearColor( 0xeee, 0.4 );
  },
  makeSpotlight: function() {
    var light = new THREE.PointLight(0xffffff);
    light.position.set(60, 0, 20);
    this.scene.add(light);
  },
  makeAmbientLight: function() {
    var lightAmb = new THREE.AmbientLight(0xffffff);
    this.scene.add(lightAmb);
  },
  makeBox: function(properties) {
    Visualizer.removeObjects(Visualizer.boxes);
    Visualizer.boxes = [];
    var realXsize = properties.box.x_size,
      realYsize = properties.box.y_size,
      realZsize = properties.box.z_size;

    var boxGeometry = new THREE.BoxGeometry(realXsize, realYsize, realZsize);

    var boxMaterial = new THREE.MeshLambertMaterial({
        color: properties.box.color,
        wireframe: properties.box.wireframe,
        opacity: properties.box.opacity,
        transparent: properties.box.transparent
    });

    for (var i = 0; i < properties.box.quantity; i++) {
      Visualizer.box = new THREE.Mesh(boxGeometry, boxMaterial);
      var box = Visualizer.box;
      // box.position.x = (Math.random() - 0.5) * 3000;
      // box.position.y = (Math.random() - 0.5) * 1200;
      // box.position.z = (Math.random() - 0.5) * 500;
      if (i % 2) {
        box.position.x = i * 30;
        box.position.y = i * 30;
        box.position.z = i * 50;
      } else {
        box.position.x = (i + 1) * -30;
        box.position.y = (i + 1) * -30;
        box.position.z = (i + 1) * -50;
      }
      Visualizer.scene.add(box);
      Visualizer.boxes.push(box);
    }
  },
  makeCircle: function(properties) {
    // Removes circles first
    Visualizer.removeObjects(Visualizer.circles);
    Visualizer.circles = [];
    var realXsizeCircle = properties.circle.x_size;
    var realYsizeCircle = properties.circle.y_size;
    var realZsizeCircle = properties.circle.z_size;

    var circleGeometry = new THREE.CircleGeometry(realXsizeCircle, realYsizeCircle, realZsizeCircle);
    // makes default appearance

    // Set color range
    Visualizer.rainbow = new Rainbow();
    if (properties.circle.quantity > 1) {
      Visualizer.rainbow.setNumberRange(0, properties.circle.quantity - 1);
    }
    Visualizer.rainbow.setSpectrum(properties.circle.color1, properties.circle.color2);

    hex = Visualizer.hex;
    for (var i = 0; i < properties.circle.quantity; i++) {
      // create each circle
      var color = "#" + Visualizer.rainbow.colorAt(i);
      var circleMaterial = new THREE.MeshLambertMaterial({
        color,
        wireframe: properties.circle.wireframe,
        opacity: properties.circle.opacity,
        transparent: properties.circle.transparent
      });
      Visualizer.circle = new THREE.Mesh(circleGeometry, circleMaterial);
      var circle = Visualizer.circle;
      // Create the circles in the negative and positive direction
      if (i % 2) {
        circle.position.x = i * 30 + 10;
        circle.position.y = i * 30;
        circle.position.z = i * 50;
      } else {
        circle.position.x = (i + 1) * -30 + 10;
        circle.position.y = (i + 1) * -30;
        circle.position.z = (i + 1) * -50;
      }
      // Uncomment for random positions
      // circle.position.x = (Math.random() - 0.5) * 3000;
      // circle.position.y = (Math.random() - 0.5) * 1200;
      // circle.position.z = (Math.random() - 0.5) * 500;

      // hex[i] = "0x" + Visualizer.rainbow.colorAt(i);
      Visualizer.scene.add(circle);
      Visualizer.circles.push(circle);
    }
  },
  makeSphere: function(properties) {
    Visualizer.removeObjects(Visualizer.spheres);
    var realXsizeSphere = properties.sphere.x_size;
    var realYsizeSphere = properties.sphere.y_size;
    var realZsizeSphere = properties.sphere.z_size;
    sphereGeometry = new THREE.SphereGeometry(realXsizeSphere, realYsizeSphere, realZsizeSphere);

    sphereMaterial = new THREE.MeshLambertMaterial({
      color: properties.sphere.color,
      wireframe: properties.sphere.wireframe,
      opacity: properties.sphere.opacity,
      transparent: properties.sphere.transparent
    });
    for (var i = 0; i < properties.sphere.quantity; i++) {
      sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.x = (Math.random() - 0.5) * 10000;
      sphere.position.y = (Math.random() - 0.5) * 10000;
      sphere.position.z = (Math.random() - 0.5) * 10000;
      this.scene.add(sphere);
      this.spheres.push(sphere);
    }
  },
  makeGradientCube: function(properties) {
    Visualizer.removeObjects(Visualizer.gradientCubes);
    // geometry
    var geometry = new THREE.CubeGeometry(100, 100, 100, 4, 4, 4);

    // image
    // var texture = new THREE.Texture(this.generateTexture());
    // textureImage = texture.image

    // material texture
    var texture = new THREE.Texture(this.generateTexture());
    texture.needsUpdate = true; // important!

    // material
      var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

    // mesh
    var cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  },
  removeObjects(objects) {
    objects.forEach(function(obj) {
      Visualizer.scene.remove(obj);
    });
  },
  generateTexture: function() {
    var size = 512;
    // create canvas
    var canvas = document.createElement( 'canvas' );
    canvas.width = size;
    canvas.height = size;
    // get context
    var context = canvas.getContext( '2d' );
    // draw gradient
    context.rect( 0, 0, size, size );
    var gradient = context.createLinearGradient( 0, 0, size, size );
    gradient.addColorStop(0, '#99ddff'); // light blue
    gradient.addColorStop(Audio.frequencies[10]/256, 'transparent'); // dark blue
    context.fillStyle = gradient;
    context.fill();
    return canvas;
  },
  animate: function() {
    if (this.perf.active) {
      this.perfLogFrame();
    }
    // Dragging the mouse to move the scene
    this.controls.update();
    for (var i in Visualizer.gui.__controllers) {
      Visualizer.gui.__controllers[i].updateDisplay();
    }
    if (Audio.isPlaying) {
      Audio.drawFrequencies(Audio.analyser);
    } else {
      // stops animation when the song ends. Prevents memory leak?
      cancelAnimationFrame(Visualizer.nextAnimation);
    }
    Visualizer.sceneRender();
    // Run animate when browser says it's time for next frame
    Visualizer.nextAnimation = requestAnimationFrame(this.animate.bind(this));
  },
  sceneRender: function() {
    Visualizer.renderer.render(Visualizer.scene, Visualizer.camera);
  },
  // on music play, render scene
  musicImpact: function(frequencies) {
    // frequencies is an array of 1024 float numbers ranging from 0 to 256

    var increment = frequencies.length / visualizer_properties.circle.quantity;
    increment = Math.floor(increment);
    Visualizer.circles.forEach(function(mesh, index) {
      var newMeasure = frequencies[increment*index] + 1;
      mesh.scale.x = newMeasure;
      mesh.scale.y = newMeasure;
      mesh.scale.z = newMeasure;
    });

    increment = frequencies.length / visualizer_properties.box.quantity;
    increment = Math.floor(increment);
    Visualizer.boxes.forEach(function(mesh, index) {
      mesh.scale.x = frequencies[increment*index]*Visualizer.userInput + 1;
    });

    increment = frequencies.length / visualizer_properties.sphere.quantity;
    increment = Math.floor(increment);
    Visualizer.spheres.forEach(function(mesh, index) {
      var max = 0.8;
      var min = 0.2;
      var range = (frequencies[400] - 60)/100 * max; //increment*index
      if (range > max) {
        range = max;
      }
      var newOpacity = min + range;
      mesh.material.opacity = newOpacity;
    });
    // this.makeBox(visualizer_properties);
    // this.makeCircle(visualizer_properties);
    // this.makeGradientCube(visualizer_properties);
  }
}