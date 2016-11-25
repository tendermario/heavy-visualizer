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
  userInput: 1,
  rainbow: null,
  hex: [],

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
    this.makeGradientCube(properties);

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
    var circleColor = circlesFolder.addColor(properties.circle, 'color1').name('Color').listen();
    var circleColor1 = circlesFolder.addColor(properties.circle, 'color2').name('Color').listen();
    var circleQuantity = circlesFolder.add(properties.circle, 'quantity', 0, 100).name('Quantity').step(1);
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
      visualizer_properties.circle.color1 = value;
      Visualizer.makeCircle(visualizer_properties);
    });
    circleColor1.onChange(function(value)  {
      visualizer_properties.circle.color2 = value;
      Visualizer.makeCircle(visualizer_properties);
    });

    circleQuantity.onChange(function(value) {
      visualizer_properties.circle.quantity = value;
      Visualizer.makeCircle(visualizer_properties);
    });

    circleWireframe.onChange(function(value) {
      Visualizer.makeCircle(properties);
    });

    circleOpacity.onChange(function(value) {
      Visualizer.circles.forEach(function(mesh) {
        mesh.material.opacity = value;
      });
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
    var realXsize = properties.box.x_size,
      realYsize = properties.box.y_size,
      realZsize = properties.box.z_size;

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
    Visualizer.circles.forEach(function(circle) {
      Visualizer.scene.remove(circle);
    });
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
      var circle = new THREE.Mesh(circleGeometry, circleMaterial);
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
      sphere.position.x = (Math.random() - 0.5) * 3000;
      sphere.position.y = (Math.random() - 0.5) * 1200;
      sphere.position.z = (Math.random() - 0.5) * 500;
      this.scene.add(sphere);
      this.spheres.push(sphere);
    }
  },
  makeGradientCube: function(properties) {
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
    mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
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

    Visualizer.circles.forEach(function(mesh, index) {
      var newMeasure = frequencies[20] + 1;
      mesh.scale.x = newMeasure;
      mesh.scale.y = newMeasure;
      mesh.scale.z = newMeasure;
    })
    Visualizer.boxes.forEach(function(mesh, index) {
      mesh.scale.x = frequencies[index]*Visualizer.userInput + 1;
    })
    // this.makeBox(visualizer_properties);
    // this.makeCircle(visualizer_properties);
    // this.makeGradientCube(visualizer_properties);
  }
}