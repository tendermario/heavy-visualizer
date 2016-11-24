// 'use strict';

// "init" is initializing (one time thing)
// "make" is creating an instance

var Visualizer = {

  camera: null,
  scene: null,
  renderer: null,
  boxes: [],
  circles: [],
  spheres: [],
  box: null,
  circle: null,
  sphere: null,
  urls: [],
  skyTextures: [],
  cubeMap: null,
  boxGeometry: null,
  boxMaterial: null,
  mesh: null,
  controls: null,
  fog: null,
  nextAnimation: null,
  perf: {},

  init: function(properties) {
    this.initCamera();
    this.initScene();
    this.initRenderer();
    this.initControls();
    this.initBackground();
    this.initGUI(properties);
    this.initPerf();

    this.makeSpotlight();
    this.makeAmbientLight();
    this.makeBox(properties);
    this.makeCircle(properties);
    this.makeSphere(properties);

    // this.scene.fog = new THREE.Fog( 0x71757a, 10, 200 );
    // this.scene.fog = new THREE.FogExp2( 0x71757a, 0.0007 );
    // adds rendered to DOM
    document.body.appendChild(this.renderer.domElement);
  },
  initCamera: function() {
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 3000;
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
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },
  initGUI: function(properties) {
    var gui = new dat.GUI({ autoPlace: false, preset: properties });

    var customContainer = document.getElementById('my-gui-container');
    customContainer.appendChild(gui.domElement);
    gui.remember(properties);

    var boxesFolder = gui.addFolder('Boxes');
    var boxColor = boxesFolder.addColor(properties.box, 'color').name('Color').listen();
    var boxQuantity = boxesFolder.add(properties.box, 'quantity', 0, 15).name('Quantity');
    var boxWireframe = boxesFolder.add(properties.box, 'wireframe').name('Wireframe');
    var boxOpacity = boxesFolder.add(properties.box, 'opacity' ).min(0).max(1).step(0.01).name('Opacity');
    // Uncomment below line to have circles folder open by default
    // boxesFolder.open();

    var circlesFolder = gui.addFolder('Circles');
    var circleColor = circlesFolder.addColor(properties.circle, 'color').name('Color').listen();
    var circleQuantity = circlesFolder.add(properties.circle, 'quantity', 0, 15).name('Quantity').step(1);
    var circleWireframe = circlesFolder.add(properties.circle, 'wireframe').name('Wireframe');
    var circleOpacity = circlesFolder.add(properties.circle, 'opacity' ).min(0).max(1).step(0.01).name('Opacity');
    // Uncomment below line to have circles folder open by default
    // circlesFolder.open();

    var spheresFolder = gui.addFolder('Spheres');
    var sphereColor = spheresFolder.addColor(properties.sphere, 'color').name('Color').listen();
    var sphereQuantity = spheresFolder.add(properties.sphere, 'quantity', 0, 3).name('Quantity').step(1);
    var sphereWireframe = spheresFolder.add(properties.sphere, 'wireframe').name('Wireframe');
    var sphereOpacity = spheresFolder.add(properties.sphere, 'opacity' ).min(0).max(1).step(0.01).name('Opacity');
    ////////// BOXES /////////////////
    boxColor.onChange(function(value) {
      box.material.color.setHex( value.replace("#", "0x") );
    });

    boxQuantity.onChange(function(value) {
      visualizer_properties.box.quantity = value;
      Visualizer.makeBox(properties);
    });

    boxWireframe.onChange(function(value) {
      Visualizer.makeBox(properties);
    });

    boxOpacity.onChange(function(value) {
      box.material.opacity = value;
    });
    ////////// CIRCLES /////////////////
    circleColor.onChange(function(value)  {
      circle.material.color.setHex( value.replace("#", "0x") );
    });

    circleQuantity.onChange(function(value) {
      visualizer_properties.circle.quantity = value;
      Visualizer.makeCircle(visualizer_properties);
    });

    circleWireframe.onChange(function(value) {
      Visualizer.makeCircle(properties);
    });

    circleOpacity.onChange(function(value) {
      circle.material.opacity = value;
    });
    ////////// SPHERES /////////////////
    sphereColor.onChange(function(value)  {
      sphere.material.color.setHex( value.replace("#", "0x") );
    });

    sphereQuantity.onChange(function(value) {
      Visualizer.spheres.forEach(function(sphere) {
        Visualizer.scene.remove(sphere);
      });
      visualizer_properties.sphere.quantity = value;
      Visualizer.makeSphere(visualizer_properties);
    });

    sphereWireframe.onChange(function(value) {
      Visualizer.spheres.forEach(function(sphere) {
        Visualizer.scene.remove(sphere);
      });
      Visualizer.makeSphere(properties);
    });

    sphereOpacity.onChange(function(value) {
      sphere.material.opacity = value;
    });

    gui.open();
  },
  initBackground: function() {
    var path = "./textures/";
    var format = ".jpg";
    var paths = [
      path + 'posz' + format, path + 'negz' + format,
      path + 'posy' + format, path + 'negy' + format,
      path + 'posx' + format, path + 'negx' + format
    ];

    var refractionCube = new THREE.CubeTextureLoader().load( paths );
    refractionCube.mapping = THREE.CubeRefractionMapping;
    refractionCube.format = THREE.RGBFormat;

    this.scene.background = refractionCube;
  },
  initPerf: function() {
    this.perf = {
      active: true,
      frameCounter: 0,
      currSecond: Date.now() / 1000,
      mode: "console",
    };
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
    Visualizer.boxes.forEach(function(box) {
      Visualizer.scene.remove(box);
    });
    Visualizer.boxes = [];
    var realXsize = properties.box.x_size * 10,
      realYsize = properties.box.y_size * 10,
      realZsize = properties.box.z_size * 10;

    boxGeometry = new THREE.BoxGeometry(realXsize, realYsize, realZsize);

    boxMaterial = new THREE.MeshLambertMaterial({
        color: properties.box.color,
        wireframe: properties.box.wireframe,
        opacity: properties.box.opacity,
        transparent: properties.box.transparent
    });

    for (var i = 0; i < properties.box.quantity; i++) {
      box = new THREE.Mesh(boxGeometry, boxMaterial);
      // box.position.x = (Math.random() - 0.5) * 3000;
      // box.position.y = (Math.random() - 0.5) * 1200;
      // box.position.z = (Math.random() - 0.5) * 500;
      if (i % 2) {
        box.position.x = i * 300;
        box.position.y = i * 300;
        box.position.z = i * 500;
      } else {
        box.position.x = (i + 1) * -300;
        box.position.y = (i + 1) * -300;
        box.position.z = (i + 1) * -500;
      }
      Visualizer.scene.add(box);
      Visualizer.boxes.push(box);
    }
  },
  makeCircle: function(properties) {
    // Removes circles first
    Visualizer.circles.forEach(function(circle) {
      Visualizer.scene.remove(circle);
    });
    Visualizer.circles = [];
    var realXsizeCircle = properties.circle.x_size * 10;
    var realYsizeCircle = properties.circle.y_size * 10;
    var realZsizeCircle = properties.circle.z_size * 10;

    circleGeometry = new THREE.CircleGeometry(realXsizeCircle, realYsizeCircle, realZsizeCircle);

    circleMaterial = new THREE.MeshLambertMaterial({
      color: properties.circle.color,
      wireframe: properties.circle.wireframe,
      opacity: properties.circle.opacity,
      transparent: properties.circle.transparent
    });
    for (var i = 0; i < properties.circle.quantity; i++) {
      circle = new THREE.Mesh(circleGeometry, circleMaterial);
      if (i % 2) {
        circle.position.x = i * 300 + 100;
        circle.position.y = i * 300;
        circle.position.z = i * 500;
      } else {
        circle.position.x = (i + 1) * -300 + 100;
        circle.position.y = (i + 1) * -300;
        circle.position.z = (i + 1) * -500;
      }
      // circle.position.x = (Math.random() - 0.5) * 3000;
      // circle.position.y = (Math.random() - 0.5) * 1200;
      // circle.position.z = (Math.random() - 0.5) * 500;
      Visualizer.scene.add(circle);
      Visualizer.circles.push(circle);
    }
  },
  perfLogFrame: function() {
    this.perf.frameCounter += 1;
    var currSecond = Date.now() / 1000;
    var numElapsedSeconds = currSecond - this.perf.currSecond;
    if (numElapsedSeconds > 5) {
      var fps = this.perf.frameCounter / numElapsedSeconds;
      if (this.perf.mode = "console") {
        console.log("fps:", Math.floor(fps));
      }
      this.perf.frameCounter = 0;
      this.perf.currSecond = currSecond;
    }
  },
  makeSphere: function(properties) {
    console.log(properties);
    var realXsizeSphere = properties.sphere.x_size * 100;
    var realYsizeSphere = properties.sphere.y_size * 100;
    var realZsizeSphere = properties.sphere.z_size * 100;


    sphereGeometry = new THREE.SphereGeometry(realXsizeSphere, realYsizeSphere, realZsizeSphere);

    sphereMaterial = new THREE.MeshLambertMaterial({
      color: properties.sphere.color,
      wireframe: properties.sphere.wireframe,
      opacity: properties.sphere.opacity,
      transparent: properties.sphere.transparent
    });
    for (var i = 0; i < properties.sphere.quantity; i++) {
      sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.x = (Math.random() - 0.5) * 3000;
      sphere.position.y = (Math.random() - 0.5) * 1200;
      sphere.position.z = (Math.random() - 0.5) * 500;
      this.scene.add(sphere);
      this.spheres.push(sphere);
    }
  },
  animate: function() {
    if (this.perf.active) {
      this.perfLogFrame();
    }

    // Dragging the mouse to move the scene
    this.controls.update();
    if (Audio.isPlaying) {
      Audio._drawSpectrum();
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
  musicImpact: function(audioDataArray) {
    var frequencies = []
    // 51 things in frequencies array
    for (var i = 0; i < 40; i++) {
      frequencies[i] = audioDataArray[i*20];
    }
    // var new_properties = visualizer_properties;
    // new_properties.box.x_size = 100 + x;
    // new_properties.box.y_size = 100 + x;
    // new_properties.box.z_size = 100 + x;
    // Visualizer.makeBox(new_properties);

    visualizer_properties.box.x_size = frequencies[10];
    visualizer_properties.box.y_size = frequencies[10];
    visualizer_properties.box.z_size = frequencies[10];

    visualizer_properties.circle.x_size = frequencies[20];
    visualizer_properties.circle.y_size = frequencies[20];
    visualizer_properties.circle.z_size = frequencies[20];
    this.makeBox(visualizer_properties);
    this.makeCircle(visualizer_properties);
  }
}