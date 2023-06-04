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

var moon, globalLight, ambientLight;

var tree1, tree2, tree3, tree4, tree5;


// colors
const red = 0xFF0000, blue = 0x0000FF, yellow = 0xFFFF00, gray = 0x999999, darkGray = 0x555555, black = 0x000000, white = 0xF8F8FF, orange = 0xF5761A, moonYellow = 0xEBC815, light_blue = 0x6495ED, orange_brown = 0xC5761A, green = 0x006400;

var canSwitchLight = false;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(90%, 90%, 90%)");
    scene.add(new THREE.AxesHelper(10));
    createHouse(4,19,0);
    
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

function createGlobalLight() {
    globalLight = new THREE.DirectionalLight(moonYellow, 1);
    globalLight.position.set(50, 100, 50);
    globalLight.rotation.x += Math.PI/4;
    scene.add(globalLight);
    const lightHelper = new THREE.DirectionalLightHelper(globalLight, 1);
    scene.add( lightHelper );
}

function createAmbientLight() {
    ambientLight = new THREE.AmbientLight(moonYellow, intensity=0.5);
    scene.add(ambientLight);
}

function switchLight() {
    if (canSwitchLight) {
        if (globalLight.color.getHex() == moonYellow) {
            globalLight.color.set(black);
        } else if (globalLight.color.getHex() == black) {
            globalLight.color.set(moonYellow);
        }
        canSwitchLight = false;
    }
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
    material = new THREE.MeshBasicMaterial({ color: orange_brown, wireframe: false });
    geometry = new THREE.CylinderGeometry(2, 2, 12, 32);
    mesh = new THREE.Mesh(geometry, material);
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

function createRoof(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    geometry = new THREE.BufferGeometry();

    // Define the vertices of the pyramid
    var vertices = new Float32Array ([
        x, y + height, z,                            // Vertex 0 (apex)
        x - width , y, z - width / 2,             // Vertex 1
        x + width , y, z - width / 2,             // Vertex 2
        x + width , y, z + width / 2,             // Vertex 3
        x - width , y, z + width / 2              // Vertex 4
    ]);

    // Define the faces (triangles) by specifying the indices of the vertices
    var indices = [
        0, 1, 2,    // Triangle 1 (apex, v1, v2)
        0, 2, 3,    // Triangle 2 (apex, v2, v3)
        0, 3, 4,    // Triangle 3 (apex, v3, v4)
        0, 4, 1,    // Triangle 4 (apex, v4, v1)
        1, 2, 3,    // Triangle 5 (v1, v2, v3)
        1, 3, 4     // Triangle 6 (v1, v3, v4)
    ];

    // Set the vertices and indices of the geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    // Compute vertex normals for proper shading
    geometry.computeVertexNormals();

    mesh = new THREE.Mesh(geometry, material);
    obj.add(mesh);
    return mesh;
}

function createWindow(obj, x, y, z, width, height, depth, color) {
    'use strict' ;
    material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8 });
    geometry = new THREE.BoxGeometry(width, height, depth);
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function createDoor(obj, x, y, z, width, height, depth) {
    'use strict' ;
    var door = new THREE.Object3D();

    createCube(door, x, y, z, width, height, depth, light_blue);

    createSphere(door, x+0.8, y, z+0.3, 0.3, 80, 32, white);

    obj.add(door);
    return mesh;
    
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


function createDoor(obj, x, y, z, width, height, depth) {
    'use strict' ;
    var door = new THREE.Object3D();

    createCube(door, x, y, z, width, height, depth, light_blue);

    createSphere(door, x+0.8, y, z+0.3, 0.3, 80, 32, white);

    obj.add(door);
    return mesh;
    
}

function createMoon() {
    'use strict';20, 100, 20, 10
    material = new THREE.MeshPhongMaterial({ emissive: moonYellow });
    geometry = new THREE.SphereGeometry(10);
    moon = new THREE.Mesh(geometry, material);
    moon.position.set(20, 100, 20);
    scene.add(moon);
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

function createHouse(x,y,z) {
    'use strict' ;
    var house = new THREE.Object3D();

    createCube(house, x, y, z, 24, 12, 12, white);

    createRoof(house, x, y + 6, z, 12, 8 ,orange);

    createWindow(house, x+8, y+2, z + 6, 4, 4, 0.1, light_blue);

    createWindow(house, x-8, y+2, z + 6, 4, 4, 0.1, light_blue);

    createDoor(house, x, y-3, z + 6, 4, 6, 0.1, light_blue);


    scene.add(house);
    house.position.set(x, y, z);
}

function createTree(x,y,z) {
    'use strict' ;
    
    var tree = new THREE.Object3D()

    createCylinder(tree, x, y, z);

    material = new THREE.MeshBasicMaterial({ color: green, wireframe: false } );
    geometry = new THREE.SphereGeometry(2, 32, 16);
    geometry.scale(2, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 8, z);
    tree.add(mesh);


    scene.add(tree);
    tree.position.set(x, y, z);
    return tree;
}

function createBranch(obj) {
    'use strict' ;
    
    var branch = new THREE.Object3D();


    material = new THREE.MeshBasicMaterial({ color: orange_brown, wireframe: false });
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    mesh = new THREE.Mesh(geometry, material);
    branch.add(mesh);

    material = new THREE.MeshBasicMaterial({ color: green, wireframe: false } );
    geometry = new THREE.SphereGeometry(0.5, 32, 16);
    geometry.scale(2, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 2.5, 0);
    branch.add(mesh);
    branch.rotation.z += Math.PI / 4;

    branch.position.set(obj.position.x - 3, obj.position.y + 3, obj.position.z);



    obj.add(branch);
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
    switchLight();
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
    createGround();
    createMoon();
    createSkydome();
    createGlobalLight();
    createAmbientLight();
    tree1 = createTree(0, 15.5, 80);
    tree2 = createTree(10, 15.5, 65);
    tree3 = createTree(-20, 15.5, 45);
    createBranch(tree3);
    tree4 = createTree(-10, 15.5, 40);
    tree5 = createTree(10, 25, 10);

    createBranch(tree5);

    createPerspectiveCamera(125, 125, 125); 

    render(cameras[0]);

    controls = new THREE.OrbitControls(currentCam, renderer.domElement);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
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
    switch (e.keyCode) {
        case 68: // letter D
            canSwitchLight = true;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {
        case 68: // letter D
            canSwitchLight = false;
            break;
    }
}