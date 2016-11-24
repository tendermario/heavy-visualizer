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

  init: function(properties) {
    this.initCamera();
    this.initScene();
    this.initRenderer();
    this.initControls();
    this.initBackground();
    this.initGUI(properties);

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
      Visualizer.boxes.forEach(function(box) {
        Visualizer.scene.remove(box);
      });
      visualizer_properties.box.quantity = value;
      Visualizer.makeBox(properties);
    });

    boxWireframe.onChange(function(value) {
      Visualizer.boxes.forEach(function(box) {
        Visualizer.scene.remove(box);
      });
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
      Visualizer.circles.forEach(function(circle) {
        Visualizer.scene.remove(circle);
      });
      visualizer_properties.circle.quantity = value;
      Visualizer.makeCircle(visualizer_properties);
    });

    circleWireframe.onChange(function(value) {
      Visualizer.circles.forEach(function(circle) {
        Visualizer.scene.remove(circle);
      });
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
    var realXsize = properties.box.x_size * 100,
      realYsize = properties.box.y_size * 100,
      realZsize = properties.box.z_size * 100;

    boxGeometry = new THREE.BoxGeometry(realXsize, realYsize, realZsize);

    boxMaterial = new THREE.MeshLambertMaterial({
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
      this.scene.add(box);
      this.boxes.push(box);
    }
  },
  makeCircle: function(properties) {
    var realXsizeCircle = properties.circle.x_size * 100;
    var realYsizeCircle = properties.circle.y_size * 100;
    var realZsizeCircle = properties.circle.z_size * 100;


    circleGeometry = new THREE.CircleGeometry(realXsizeCircle, realYsizeCircle, realZsizeCircle);

    circleMaterial = new THREE.MeshLambertMaterial({
      color: properties.circle.color,
      wireframe: properties.circle.wireframe,
      opacity: properties.circle.opacity,
      transparent: properties.circle.transparent
    });
    for (var i = 0; i < properties.circle.quantity; i++) {
      circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.position.x = (Math.random() - 0.5) * 3000;
      circle.position.y = (Math.random() - 0.5) * 1200;
      circle.position.z = (Math.random() - 0.5) * 500;
      this.scene.add(circle);
      this.circles.push(circle);
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

    // Dragging the mouse to move the scene
    this.controls.update();
    Visualizer.sceneRender();

    // Run animate when browser says it's time for next frame
    requestAnimationFrame(this.animate.bind(this));
  },
  sceneRender: function() {
    Visualizer.renderer.render(this.scene, this.camera);
  },
  // on music play, render scene
  musicImpact: function(x) {
    this.boxes.forEach(function(box){
      box.scale.set(x, x, x)
    });
  }
}