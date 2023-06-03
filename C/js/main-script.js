//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var scene, cameras = [], renderer, currentCam, groundMesh;

var geometry, material, mesh;

var skyDomeGeo, skyDome;

var sky;

var loader, texture;

var door, window1, window2, base, roof;

var controls;


// colors
const red = 0xFF0000, blue = 0x0000FF, yellow = 0xFFFF00, gray = 0x999999, darkGray = 0x555555, black = 0x000000, white = 0xF8F8FF, orange = 0xF5761A;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(90%, 90%, 90%)");
    scene.add(new THREE.AxesHelper(10));
    
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createPerspectiveCamera(x, y, z) {
    'use strict';
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(x, y, z);
    camera.lookAt(scene.position);
    cameras.push(camera);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createLight() {
    const light = new THREE.PointLight(color=0xffffff, intensity=1, distance=0, decay=2);
    light.position.set(0, 100, 0);
    scene.add( light );
    const pointLightHelper = new THREE.PointLightHelper( light, 1 );
    scene.add( pointLightHelper );
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////


function createCube(obj, x, y, z, width, height, depth, color) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
    geometry = new THREE.BoxGeometry(width, height, depth);
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function createCylinder(obj, x, y, z) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: black, wireframe: false });
    geometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight,32);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI/2;
    mesh.rotation.z = Math.PI/2;
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function createCone(obj, x, y, z, radius, height, color) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
    geometry = new THREE.ConeGeometry(radius, height);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function createSphere(obj, x, y, z, radius, width, height, color) {
    'use strict' ;
    material = new THREE.MeshBasicMaterial({ color: color});
    geometry = new THREE.SphereGeometry(radius, width, height);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function createRoof(obj, x, y, z, radius, color) {
    'use strict' ;
    material = new THREE.MeshBasicMaterial({ color: color});
    geometry = new THREE.TetrahendronGeometry(radius, 0);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function createWindows(obj, x, y, z, width, height) {
    'use strict' ;
    material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8 });
    geometry = new THREE.BoxGeometry(width, height, depth);
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}



function createSkydome() {
    'use strict' ;
    geometry = new THREE.SphereGeometry(250, 80, 32);
    const textureLoader = new THREE.TextureLoader();
    //Estou a usar uma imagem random mas quando tiveremos as texturas feitas a do céu estrelado coloca-se aqui\\
    const texture = textureLoader.load("js/2823368.jpg");
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide});
    sky = new THREE.Mesh(geometry, material);
    sky.position.set(0,0,0);
    scene.add(sky);
}

function createGround() {
    'use strict' ;
    var groundGeo = new THREE.PlaneGeometry(250, 250, 25, 25);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("js/heightmap.png");
    const green   = textureLoader.load("js/ground.png");

    const material = new THREE.MeshStandardMaterial( {
           //color: blue,
           wireframe: false,
           displacementMap: texture,
           displacementScale: 125,
           map: green,
           side: THREE.DoubleSide
    } );

    groundMesh = new THREE.Mesh(groundGeo, material);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.rotation.z = -Math.PI / 4;
    groundMesh.position.y = 25;
    scene.add(groundMesh);
}


function createHouse(x,y,z) {
    'use strict' ;
    house = new THREE.Object3D();

    createCube(house, x, y, z, 12, 6, 6, white);

    createRoof(house, x, y + 6, z, orange);

    createWindows(house, x, y, z);


}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    controls.update()
}


/////////////
/* DISPLAY */
/////////////
function render(camera) {
    'use strict';
    currentCam = camera;
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    createScene();
    createPerspectiveCamera(125, 125, 125);    //perspetiva isométrica (projeção perspetiva)
    createLight();

    render(cameras[0]);

    createGround();
    createSkydome();

    controls = new THREE.OrbitControls(currentCam, renderer.domElement);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    update();
    
    render(currentCam);

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        cameras[0].aspect = window.innerWidth / window.innerHeight;
        cameras[0].updateProjectionMatrix();
    }
    render(currentCam);
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}