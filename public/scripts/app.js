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
        x_size: 2,
        y_size: 1,
        z_size: 4,
        wireframe: true,
    }
}

function init(properties) {

    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 9000);
    camera.position.z = 1400;

    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);

    scene = new THREE.Scene();
    // scene.fog= new THREE.Fog(0xffffff, 0.095, 10);
    scene.fog= new THREE.FogExp2( 0x71757a, 0.0007 );

    //     // instantiate a listener
    // var audioListener = new THREE.AudioListener();

    // // add the listener to the camera
    // camera.add( audioListener );

    // // instantiate audio object
    // var oceanAmbientSound = new THREE.Audio( audioListener );

    // // add the audio object to the scene
    // scene.add( oceanAmbientSound );

    // // instantiate a loader
    // var loader = new THREE.AudioLoader();

    // // load a resource
    // loader.load(
    //     // resource URL
    //     'kick_shock.mp3',
    //     // Function when resource is loaded
    //     function ( audioBuffer ) {
    //         // set the audio object buffer to the loaded object
    //         oceanAmbientSound.setBuffer( audioBuffer );

    //         // play the audio
    //         oceanAmbientSound.play();
    //     },
    //     // Function called when download progresses
    //     function ( xhr ) {
    //         console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    //     },
    //     // Function called when download errors
    //     function ( xhr ) {
    //         console.log( 'An error happened' );
    //     }
    // );

    // var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    // scene.add(ambientLight);

    // var spotLight = new THREE.SpotLight( 0xffffff );
    // scene.add( spotLight );

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
    }


    // CIRCLE /////////////////
    var realXsizeCircle = properties.circle.x_size * 100;
    var realYsizeCircle = properties.circle.y_size * 100;
    var realZsizeCircle = properties.circle.z_size * 100;

    circleGeometry = new THREE.CircleGeometry(realXsize, realYsize, realZsize);

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
    }





    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}

function animate(properties) {

    requestAnimationFrame(animate);

    // var realXrotation = properties.x_rotation * 0.01;
    // var realYrotation = properties.y_rotation * 0.01;


    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;


    controls.update();

    // renderer.render(scene, camera);

}

function render() {
    renderer.render(scene, camera);
}




document.addEventListener('DOMContentLoaded', function() {
    init(properties);
    animate(properties);
    render();
});