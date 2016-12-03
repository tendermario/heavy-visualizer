// 'use strict';

// "init" is initializing (one time thing)
// "make" is creating an instance

var Visualizer = {

  camera: null,
  scene: null,
  renderer: null,
  controls: null,
  nextAnimation: null,
  gui: null,
  perf: {},

  // background
  cubeMap: null,
  backgroundScenes: ['sky', 'colors', 'black'],
  urls: [],

  // colors
  rainbow: null,
  hex: [],

  // objects
  boxes: [],
  circles: [],
  spheres: [],
  // gradientCubes: [],
  // fog: null,

  // rotation for spheres
  sphereCenter: null,
  spherePivot: new THREE.Object3D(),
  cameraPivot: new THREE.Object3D(),
  gravity: null,


  init: function(properties) {
    this.initCamera();
    this.initScene();
    this.initRenderer();
    this.initControls();
    this.initGUI(properties);
    // this.initPerf();

    this.makeBackground(properties.background.name);
    this.makeSpotlight();
    this.makeAmbientLight();
    this.initGravity();
    this.makeBox(properties);
    this.makeCircle(properties);
    // this.makeGradientCube(properties);
    this.makeSphere(properties);

    window.addEventListener('resize', this.onWindowResize);

    this.animate();
    // this.scene.fog = new THREE.Fog( 0x71757a, 10, 200 );
    // this.scene.fog = new THREE.FogExp2( 0x71757a, 0.0007 );
    // adds renderer to DOM
  },
  initCamera: function() {
    // FOV, aspect ratio, near render, far render
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 63000);
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
      Visualizer.makeBackground(value);
    });

    ////////// CAMERA CONTROLS //////////////
    // Camera properties
    var cameraFolder = gui.addFolder('CAMERA');
    var cameraX = cameraFolder.add(Visualizer.camera.position, 'x', -10000, 10000).name('X');
    var cameraY = cameraFolder.add(Visualizer.camera.position, 'y', -10000, 10000).name('Y');
    var cameraZ = cameraFolder.add(Visualizer.camera.position, 'z', -10000, 10000).name('Z');
    var cameraRotation = cameraFolder.add(properties.camera, 'rotation', 0, 8).name('ROTATION').step(0.1);
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
    cameraRotation.onChange(function(value) {
      properties.camera.rotation = value;
    })

    ////////// BOXES /////////////////
    // Display properties
    var boxesFolder = gui.addFolder('BOXES');
    var boxSizeX = boxesFolder.add(properties.box, 'x_size', 10, 100).name('SIZE').step(1);
    var boxWireframe = boxesFolder.add(properties.box, 'wireframe').name('WIREFRAME');
    var boxLineweight = boxesFolder.add(properties.box, 'lineweight', 1, 10).name('LINEWEIGHT').step(0.1);
    var boxOpacity = boxesFolder.add(properties.box, 'opacity' ).min(0).max(1).step(0.01).name('OPACITY');
    var boxColor = boxesFolder.addColor(properties.box, 'color').name('COLOR').listen();
    // Uncomment below line to have circles folder open by default
    boxesFolder.close();
    // Changes in display properties
    boxSizeX.onChange(function(value) {
      properties.box.x_size = value;
      Visualizer.makeBox(properties);
    });
    boxWireframe.onChange(function(value) {
      Visualizer.makeBox(properties);
    });
    boxLineweight.onChange(function(value) {
      Visualizer.makeBox(properties);
    });
    boxOpacity.onChange(function(value) {
      Visualizer.updateOpacity(Visualizer.boxes, value);
    });
    boxColor.onChange(function(value) {
      properties.box.color = value;
      Visualizer.makeBox(properties);
    });

    ////////// CIRCLES /////////////////
    // Display properties
    var circlesFolder = gui.addFolder('CIRCLES');
    var circleSizeX = circlesFolder.add(properties.circle, 'x_size', 10, 50).name('SIZE').step(1);
    var circleSizeY = circlesFolder.add(properties.circle, 'y_size', 10, 50).name('RADIUSES').step(1);
    var circleWireframe = circlesFolder.add(properties.circle, 'wireframe').name('WIREFRAME');
    var circleLineweight = circlesFolder.add(properties.circle, 'lineweight', 1, 5).name('LINEWEIGHT').step(0.1);
    var circleOpacity = circlesFolder.add(properties.circle, 'opacity' ).min(0).max(1).step(0.01).name('OPACITY');
    var circleColor = circlesFolder.addColor(properties.circle, 'color1').name('COLOR 1').listen();
    var circleColor1 = circlesFolder.addColor(properties.circle, 'color2').name('COLOR 2').listen();
    // Uncomment below line to have circles folder open by default
    circlesFolder.close();
    // Changes in display properties
    circleSizeX.onChange(function(value) {
      properties.circle.x_size = value;
      Visualizer.makeCircle(properties);
    });
    circleSizeY.onChange(function(value) {
      properties.circle.y_size = value;
      Visualizer.makeCircle(properties);
    });
    circleWireframe.onChange(function(value) {
      Visualizer.makeCircle(properties);
    });
    circleLineweight.onChange(function(value) {
      Visualizer.makeCircle(properties);
    });
    circleOpacity.onChange(function(value) {
      Visualizer.updateOpacity(Visualizer.circles, value);
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
    var sphereQuantity = spheresFolder.add(properties.sphere, 'quantity', 0, 100).name('QUANTITY').step(1);
    var sphereWireframe = spheresFolder.add(properties.sphere, 'wireframe').name('WIREFRAME');
    var sphereOpacity = spheresFolder.add(properties.sphere, 'opacity' ).min(0).max(1).step(0.01).name('OPACITY');
    var sphereColor = spheresFolder.addColor(properties.sphere, 'color').name('COLOR').listen();
    var sphereRotation = spheresFolder.add(properties.sphere, 'rotation', 0, 12).name('ROTATION').step(0.1);
    // Comment below line to have circles folder open by default
    spheresFolder.close();
    // Changes in display properties
    sphereQuantity.onChange(function(value) {
      properties.sphere.quantity = value;
      Visualizer.makeSphere(properties);
    });
    sphereWireframe.onChange(function(value) {
      Visualizer.makeSphere(properties);
    });
    sphereOpacity.onChange(function(value) {
      Visualizer.updateOpacity(Visualizer.spheres, value);
    });
    sphereColor.onChange(function(value)  {
      Visualizer.sphere.material.color.setHex( value.replace("#", "0x") );
    });
    sphereRotation.onChange(function(value)  {
      properties.sphere.rotation = value;
    });

    gui.open();
  },
  updateOpacity: function(objects, value) {
    objects.forEach(function(mesh) {
      mesh.material.opacity = value;
    });
  },
  initPerf: function() {
    this.perf = {
      active: true,
      frameCounter: 0,
      currSecond: Date.now() / 1000,
      mode: "console",
    };
  },
  initGravity: function() {
    // center position that the spheres rotate around
    var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    var cubeMaterial = new THREE.MeshLambertMaterial({
        opacity: 0,
        transparent: true
      });
    Visualizer.gravity = new THREE.Mesh(cubeGeometry, cubeMaterial);
    Visualizer.scene.add(Visualizer.gravity);
    Visualizer.gravity.add(Visualizer.spherePivot);
    Visualizer.gravity.add(Visualizer.cameraPivot);
    Visualizer.cameraPivot.add(Visualizer.camera);
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
    var path = "./public/textures/" + background + "/";
    var format = ".jpg";
    var paths = [
      path + 'posz' + format, path + 'negz' + format,
      path + 'posy' + format, path + 'negy' + format,
      path + 'posx' + format, path + 'negx' + format
    ];
    var refractionCube = new THREE.CubeTextureLoader().load(paths);
    refractionCube.mapping = THREE.CubeRefractionMapping;
    refractionCube.format = THREE.RGBFormat;

    Visualizer.scene.background = refractionCube;
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
    Visualizer.removeObjects(Visualizer.boxes, Visualizer.scene);
    Visualizer.boxes = [];
    var realXsize = properties.box.x_size,
      realYsize = properties.box.y_size,
      realZsize = properties.box.z_size;

    var boxGeometry = new THREE.BoxGeometry(realXsize, realYsize, realZsize);

    var boxMaterial = new THREE.MeshLambertMaterial({
        color: properties.box.color,
        wireframe: properties.box.wireframe,
        opacity: properties.box.opacity,
        transparent: properties.box.transparent,
        wireframeLinewidth: properties.box.lineweight,
    });

    for (var i = 0; i < properties.box.quantity; i++) {
      var box = new THREE.Mesh(boxGeometry, boxMaterial);
      // Uncomment for random positions
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
    Visualizer.removeObjects(Visualizer.circles, Visualizer.scene);
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
        transparent: properties.circle.transparent,
        wireframeLinewidth: properties.circle.lineweight
      });
      var circle = new THREE.Mesh(circleGeometry, circleMaterial);
      // Create the circles in the negative and positive direction
      if (i % 2) {
        circle.position.x = i * 30;
        circle.position.y = i * 30;
        circle.position.z = i * 50;
      } else {
        circle.position.x = (i + 1) * -30;
        circle.position.y = (i + 1) * -30;
        circle.position.z = (i + 1) * -50;
      }
      // Uncomment for random positions
      // circle.position.x = (Math.random() - 0.5) * 3000;
      // circle.position.y = (Math.random() - 0.5) * 1200;
      // circle.position.z = (Math.random() - 0.5) * 500;

      Visualizer.scene.add(circle);
      Visualizer.circles.push(circle);
    }
  },
  makeSphere: function(properties) {
    Visualizer.removeObjects(Visualizer.spheres, Visualizer.scene);
    Visualizer.removeObjects(Visualizer.spheres, Visualizer.spherePivot);
    Visualizer.spheres = [];
    var realXsizeSphere = properties.sphere.x_size;
    var realYsizeSphere = properties.sphere.y_size;
    var realZsizeSphere = properties.sphere.z_size;
    var sphereGeometry = new THREE.SphereGeometry(realXsizeSphere, realYsizeSphere, realZsizeSphere);

    var sphereMaterial = new THREE.MeshLambertMaterial({
      color: properties.sphere.color,
      wireframe: properties.sphere.wireframe,
      opacity: properties.sphere.opacity,
      transparent: properties.sphere.transparent
    });
    for (var i = 0; i < properties.sphere.quantity; i++) {
      Visualizer.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      var sphere = Visualizer.sphere;
      sphere.position.x = (Math.random() - 0.5) * 15000;
      sphere.position.y = (Math.random() - 0.5) * 15000;
      sphere.position.z = (Math.random() - 0.5) * 15000;
      Visualizer.scene.add(sphere);
      Visualizer.spheres.push(sphere);

      // creates pivot for each sphere
      Visualizer.spherePivot.add(sphere);
    }
  },
  makeGradientCube: function(properties) {
    Visualizer.removeObjects(Visualizer.gradientCubes, Visualizer.scene);
    Visualizer.gradientCubes = [];
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
    this.gradientCubes.push(cube);
  },
  removeObjects(objects, container) {
    objects.forEach(function(obj) {
      container.remove(obj);
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
    }
    // else {
    //   // stops animation when the song ends. Prevents memory leak?
    //   cancelAnimationFrame(Visualizer.nextAnimation);
    // }
    Visualizer.sceneRender();
    Visualizer.cameraPivot.rotation.y += visualizer_properties.camera.rotation / 1000;
    Visualizer.spherePivot.rotation.y += visualizer_properties.sphere.rotation / 1000;

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
      mesh.scale.x = frequencies[increment*index] + 1;
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