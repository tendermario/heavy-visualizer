var audio_analysis = "we have no audio inputted";

var camera, scene, renderer;
var boxGeometry, boxMaterial, mesh, controls, fog;

var properties = {
    box: {
        color: '#35a7af',
        quantity: 10,
        x_size: 5,
        y_size: 3,
        z_size: 4,
        wireframe: false,
    },
    circle: {
        color: '#eee',
        quantity: 7,
        x_size: 6,
        y_size: 2,
        z_size: 4,
        wireframe: true,
    }
}

var position_in_segments = 1,
    loudness,
    duration = 0,
    boxes = [],
    box,
    circle,
    urls = [],
    skyTextures = [],
    cubeMap,
    circles = [];

function init(properties) {

  camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 9000);
  camera.position.z = 1400;

  controls = new THREE.TrackballControls(camera, document.getElementById('threeCanvas'));
  controls.addEventListener('change', sceneRender);

  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog( 0x71757a, 10, 200 );
  // scene.fog = new THREE.FogExp2( 0x71757a, 0.0007 );

  /////// GUI //////////////
  var gui = new dat.GUI({ autoPlace: false, preset: properties });

  var customContainer = document.getElementById('my-gui-container');
  customContainer.appendChild(gui.domElement);
  gui.remember(properties);

  var boxColor = gui.addColor(properties.box, 'color').name('Color').listen();
  gui.add(properties.box, 'quantity', 0, 15);
  gui.add(properties.box, 'wireframe');

  var circleColor = gui.addColor(properties.circle, 'color').name('Color').listen();
  gui.add(properties.circle, 'quantity', 0, 15);
  gui.add(properties.circle, 'wireframe');


  boxColor.onChange(function(value) {
    properties.box.color.setHex( value );
  });

  circleColor.onChange(function(value)  {
    properties.circle.color.setHex( value );
  });

  // properties.box.color.setHex( properties.box.color );


  gui.open();






  // gui.add(obj, 'displayOutline');
  // gui.add(obj, 'explode');
  // gui.add(obj, 'maxSize').min(-10).max(10).step(0.25);
  // gui.add(obj, 'height').step(5); // Increment amount
  // // Choose from accepted values
  // gui.add(obj, 'type', [ 'one', 'two', 'three' ] );
  // // Choose from named values
  // gui.add(obj, 'speed', { Stopped: 0, Slow: 0.1, Fast: 5 } );

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


  // var light = new THREE.PointLight(0xffffff);
  // light.position.set(60, 0, 20);
  // scene.add(light);
  // var lightAmb = new THREE.AmbientLight(0xffffff);
  // scene.add(lightAmb);


    // BOX /////////////////////
    var realXsize = properties.box.x_size * 100;
    var realYsize = properties.box.y_size * 100;
    var realZsize = properties.box.z_size * 100;

    boxGeometry = new THREE.BoxGeometry(realXsize, realYsize, realZsize);

    boxMaterial = new THREE.MeshBasicMaterial({
        color: properties.box.color,
        wireframe: properties.box.wireframe,
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
    // console.log(boxes);

    // CIRCLE /////////////////
    properties.circle.realXsizeCircle = properties.circle.x_size * 100;
    properties.circle.realYsizeCircle = properties.circle.y_size * 100;
    properties.circle.realZsizeCircle = properties.circle.z_size * 100;


    circleGeometry = new THREE.CircleGeometry(properties.circle.realXsizeCircle, properties.circle.realYsizeCircle, properties.circle.realZsizeCircle);

    circleMaterial = new THREE.MeshBasicMaterial({
        color: properties.circle.color,
        wireframe: properties.circle.wireframe,
    });
    for (var i = 0; i < properties.circle.quantity; i++) {
        circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.x = (Math.random() - 0.5) * 3000;
        circle.position.y = (Math.random() - 0.5) * 1200;
        circle.position.z = (Math.random() - 0.5) * 500;
        scene.add(circle);
        circles.push(circle);

    }
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

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

// $(function() {

    function musicImpact(x) {
  // properties.circle.realXsizeCircle += x * 500;
    // console.log("X is:" + x);
    // console.log("Properties circles size:" + properties.circle.x_size);


    boxes.forEach(function(box){

      box.scale.set(x, x, x)
      // circles.scale.set(x, x, x)
    })
}


$(function(){

  $('#my-gui-container').on('click', function(e) {


    sceneRender();

  });

});
// });



    // properties.circle.realXsizeCircle = properties.circle.x_size + x * 900;

    // Object3D.scale(x, 1, 1);
    // mesh.rotation.x += + x;
    // mesh.rotation.y += 0.02;
    // animate(properties);
}

// on load render scene
document.addEventListener('DOMContentLoaded', function() {
    init(properties);
    animate(properties);
    sceneRender();
});
