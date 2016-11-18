var camera, scene, renderer;
var geometry, material, mesh, controls;

function init() {


    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1500;

    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(100, 100, 100);
    // geometry2 = new THREE.BoxGeometry(200, 200, 200);

    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });

    // material2 = new THREE.MeshBasicMaterial({
    //     color: 0xff0000,
    //     wireframe: true
    // });
    for (var i = 0; i < 11; i++) {
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 1000;
        mesh.position.y = (Math.random() - 0.5) * 1000;
        mesh.position.z = (Math.random() - 0.5) * 1000;

        scene.add(mesh);
    }



    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;

    controls.update();

    // renderer.render(scene, camera);

}

function render() {
    renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', function() {
    init();
    animate();
    render();
});