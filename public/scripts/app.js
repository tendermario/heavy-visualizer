var audio_analysis = "we have no audio inputted";

var camera, scene, renderer;
var boxGeometry, boxMaterial, mesh, controls, fog;

var properties = {
    box: {
        color: 'red',
        quantity: 10,
        x_size: 5,
        y_size: 3,
        z_size: 4,
        wireframe: false,
    },
    circle: {
        color: '#eee',
        quantity: 4,
        x_size: 6,
        y_size: 10,
        z_size: 4,
        wireframe: true,
    }
}

var position_in_segments = 1,
    loudness,
    duration = 0,
    boxes = [],
    circles = [];

function init(properties) {

    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 9000);
    camera.position.z = 1400;

    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', sceneRender);

    scene = new THREE.Scene();
    // scene.fog= new THREE.Fog(0xffffff, 0.095, 10);
    scene.fog= new THREE.FogExp2( 0x71757a, 0.0007 );

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
        mesh = new THREE.Mesh(boxGeometry, boxMaterial);
        mesh.position.x = (Math.random() - 0.5) * 3000;
        mesh.position.y = (Math.random() - 0.5) * 1200;
        mesh.position.z = (Math.random() - 0.5) * 500;
        scene.add(mesh);
        console.log(mesh);
        boxes.push(mesh);
    }
    console.log(boxes);

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
        mesh = new THREE.Mesh(circleGeometry, circleMaterial);
        mesh.position.x = (Math.random() - 0.5) * 3000;
        mesh.position.y = (Math.random() - 0.5) * 1200;
        mesh.position.z = (Math.random() - 0.5) * 500;
        scene.add(mesh);
        circles.push(mesh);

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

// on load render scene
document.addEventListener('DOMContentLoaded', function() {
    init(properties);
    animate(properties);
    sceneRender();
});

// on music play, render scene
function musicImpact(x) {
  // properties.circle.realXsizeCircle += x * 500;
    // console.log("X is:" + x);
    // console.log("Properties circles size:" + properties.circle.x_size);


    boxes.forEach(function(box){

      box.scale.set(x, x, x)
      // circles.scale.set(x, x, x)
    });

    // properties.circle.realXsizeCircle = properties.circle.x_size + x * 900;

    // Object3D.scale(x, 1, 1);
    // mesh.rotation.x += + x;
    // mesh.rotation.y += 0.02;
    // animate(properties);
}
