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

var tree1, tree2, tree3, tree4, tree5, meshDoor, materialDoor;

var ufo;
var ufoPointLights = [];
var ufoSpotLight;
var ufoLightBalls = [];
var ufoFlatCylinder;


const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const phongMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const toonMaterial = new THREE.MeshToonMaterial({ color: 0x0000ff });


// colors
const red = 0xFF0000, blue = 0x0000FF, yellow = 0xFFFF00, gray = 0x999999, darkGray = 0x555555, black = 0x000000, white = 0xF8F8FF, orange = 0xF5761A, moonYellow = 0xEBC815, lightBlue = 0x6495ED, orange_brown = 0xC5761A, green = 0x006400;

var canSwitchGlobalLight = false;
var canSwitchUFOPointLights = false;
var canSwitchUFOSpotLight = false;

var leftArrow = false;
var rightArrow = false;
var upArrow = false;
var downArrow = false;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(90%, 90%, 90%)");
    scene.add(new THREE.AxesHelper(10));
    createHouse(0,15.55,30);
    
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

function switchLights() {

    if (canSwitchGlobalLight) {
        switchIt(globalLight, moonYellow)
        canSwitchGlobalLight = false;
    } else if (canSwitchUFOPointLights) {
        for (const pointLight of ufoPointLights) {
            switchIt(pointLight, white);
        }
        for (const lightBall of ufoLightBalls) {
            switchEmmissive(lightBall, white);
        }
        canSwitchUFOPointLights = false;
    } else if (canSwitchUFOSpotLight) {
        switchIt(ufoSpotLight, white);
        switchEmmissive(ufoFlatCylinder, gray);
        canSwitchUFOSpotLight = false;
    }

    function switchIt(light, onColor) {
        if (light.color.getHex() == onColor) {
            light.color.set(black);
        } else if (light.color.getHex() == black) {
            light.color.set(onColor);
        }
    }

    function switchEmmissive(mesh, emmissionColor) {
        if (mesh.material.emissive.getHex() == emmissionColor) {
            mesh.material.emissive.set(black);
        } else if (mesh.material.emissive.getHex() == black) {
            mesh.material.emissive.set(emmissionColor);
        }
    }
}

function createSpotLight(obj) {
    const spotLight = new THREE.SpotLight( white, 1, 100, Math.PI/6, 0);
    //spotLight.position.set( 10, 100, 10 );
    //scene.add(spotLight)
    obj.add(spotLight);
    obj.add(spotLight.target);
    //const spotLightHelper = new THREE.SpotLightHelper( spotLight );
    //scene.add(spotLightHelper)
    return spotLight;
}

function createPointLight(obj, x, y, z) {
    const light = new THREE.PointLight(white, 1, 10);
    light.position.set( x, y, z );
    scene.add(light);
    obj.add(light)
    return light;
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
    mesh.rotation.x = Math.PI;
    mesh.rotation.z = Math.PI;
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function createCoolCylinder(obj) {
    'use strict';
    material = new THREE.MeshPhongMaterial({ emissive: gray });
    geometry = new THREE.CylinderGeometry(3, 3, .5, 32);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -1/3, 0);
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
    material = new THREE.MeshBasicMaterial({ color: color });
    geometry = new THREE.SphereGeometry(radius, width, height);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function createCoolSphere(obj, color, x, y, z, radius, widthSegments, heightSegments, phiStart, phiLenght, thetaStart, spot) {
    'use strict';
    if (spot)
        material = new THREE.MeshPhongMaterial({ color: color, emissive: white });
    else
        material = new THREE.MeshPhongMaterial({ color: color });
    geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLenght, thetaStart);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}


function createHouseWallBack(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array ([
        0, 0, 0,                       // Vertex 1
        0, height, 0,                  // Vertex 2
        width , 0, 0,                  // Vertex 3
        width , height, 0             // Vertex 4
    ]);


    var indices = [
        0, 1, 2,
        2, 3, 1
    ];
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-12,y-6,z-6);
    obj.add(mesh);
    return mesh;

}


function createHouseWallSide(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array ([
        0, 0, 0,                       // Vertex 0
        0, height/2, 0,                // Vertex 1
        0, 0, width,                   // Vertex 2
        0, height/2, width             // Vertex 3
    ]);


    var indices = [
        0, 1, 2,
        2, 3, 1
    ];
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-12,y-6,z-6);
    mesh.rotation.set(Math.PI/2, Math.PI, 0);
    obj.add(mesh);
    return mesh;
}

function createHouseFront(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array ([
        0, 0, 0,                                // Vertex 0
        0, height, 0,                           // Vertex 1
        width , 0, 0,                           // Vertex 2
        width , height, 0,                      // Vertex 3
        0, (2/3)*height, 0,                     // Vertex 4
        width, (2/3)*height,0,                  // Vertex 5
        0, (1/3)*height, 0,                     // Vertex 6
        (1/12)*width, (1/3)*height, 0,          // Vertex 7
        (1/12)*width, (2/3)*height, 0,          // Vertex 8
        width-14, (1/3)*height, 0,              // Vertex 9
        width-14, 0, 0,                         // Vertex 10
        (1/4)*width, (1/3)*height, 0,           // Vertex 11
        (1/4)*width, (2/3)*height, 0,           // Vertex 12
        width-14, (1/3)*height, 0,              // Vertex 13
        width-14, (2/3)*height, 0,              // Vertex 14
        width-10, (2/3)*height, 0,              // Vertex 15
        width-10, (1/3)*height, 0,              // Vertex 16
        width-6,  (2/3)*height, 0,              // Vertex 17
        width-6,  (1/3)*height, 0,              // Vertex 18
        width-2,  (2/3)*height, 0,              // Vertex 19
        width-2,  (1/3)*height, 0,              // Vertex 20
        width,    (1/3)*height, 0,              // Vertex 21
        width-10, 0, 0                          // Vertex 22
 
    ]);


    var indices = [
        4, 1, 3,
        3, 4, 5,
        6, 4, 8,
        8, 6, 7,
        0, 6, 9,
        9, 0, 10,
        11, 12, 14,
        14, 11, 13,
        22, 16, 21,
        21, 22, 2,
        16, 15, 17,
        17, 16, 18,
        20, 19, 5,
        5, 20, 21

    ];
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-12,y-6,z+6);
    obj.add(mesh);
    return mesh;

}


function createRoof(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    geometry = new THREE.BufferGeometry();

    // Define the vertices of the pyramid
    var vertices = new Float32Array ([
        x, y + height, z,                          // Vertex 0 (apex)
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

function createWindows(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array ([
        (1/12)*width, (1/3)*height, 0,          // Vertex 0
        (1/12)*width, (2/3)*height, 0,          // Vertex 1
        (1/4)*width, (1/3)*height, 0,           // Vertex 2
        (1/4)*width, (2/3)*height, 0,           // Vertex 3
        width-2,  (2/3)*height, 0,              // Vertex 4
        width-2,  (1/3)*height, 0,              // Vertex 5
        width-6,  (2/3)*height, 0,              // Vertex 6
        width-6,  (1/3)*height, 0,              // Vertex 7       
    ]);


    var indices = [
        0, 1, 3,
        3, 0, 2,
        7, 6, 4,
        4, 7, 5

    ];
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-12,y-6,z+6);
    obj.add(mesh);
    return mesh;  
}

function createDoor(obj, x, y, z, width, height) {
    'use strict' ;
    var door = new THREE.Object3D();

    'use strict';
    material = new THREE.MeshBasicMaterial({ color: lightBlue, side: THREE.DoubleSide });
    geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array ([
        width-14, 0, 0,                         // Vertex 0
        width-14, (2/3)*height, 0,              // Vertex 1
        width-10, 0, 0,                         // Vertex 2
        width-10, (2/3)*height, 0,              // Vertex 3    
    ]);


    var indices = [
        0, 1, 3,
        3, 0, 2
    ];
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-12,y-6,z+6);
    door.add(mesh);
    createSphere(door, x+1, y-1.4, z+6.3, 0.3, 80, 32, white);
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
           displacementScale: 80,
           map: green,
           side: THREE.DoubleSide
    } );

    groundMesh = new THREE.Mesh(groundGeo, material);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.rotation.z = -Math.PI / 4;
    groundMesh.position.y = 25;
    scene.add(groundMesh);
}

function createMoon() {
    'use strict';20, 100, 20, 10
    material = new THREE.MeshPhongMaterial({ emissive: moonYellow });
    geometry = new THREE.SphereGeometry(10);
    moon = new THREE.Mesh(geometry, material);
    moon.position.set(20, 100, 20);
    moon.scale.set(2,2,2);
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

    createHouseWallBack(house, x, y, z, 24, 12, white);

    createHouseWallSide(house , x, y, z, 12, 24, white);

    createHouseWallSide(house , x+24, y, z, 12, 24, white);

    createHouseFront(house, x, y, z, 24, 12, white);

    createWindows(house, x, y, z, 24, 12, lightBlue);

    createDoor(house, x, y, z, 24, 12);

    createRoof(house, x, y + 6, z, 12, 8 ,orange);


    scene.add(house);
    house.position.set(x, y, z);
}

function createTree(x,y,z) {
    'use strict' ;
    
    var tree = new THREE.Object3D()

    createCylinder(tree, x, y, z);

    material = new THREE.MeshBasicMaterial({ color: green, wireframe: false } );
    geometry = new THREE.SphereGeometry(3, 32, 16);
    geometry.scale(2, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 8.5, z);
    tree.add(mesh);
    
    material = new THREE.MeshBasicMaterial({ color: orange_brown, wireframe: false });
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x - 3, y + 3, z);
    mesh.rotation.z += Math.PI / 4;
    tree.add(mesh);

    material = new THREE.MeshBasicMaterial({ color: green, wireframe: false } );
    geometry = new THREE.SphereGeometry(0.5, 32, 16);
    geometry.scale(2, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x - 4.7, y + 4.7, z);
    mesh.rotation.z += Math.PI / 4;
    tree.add(mesh);

    scene.add(tree);
    tree.position.set(x, y, z);
    return tree;
}

function createUFO() {
    'use strict'

    ufo = new THREE.Object3D();

    var body = createCoolSphere(ufo, white, 0, 0, 0, 6, undefined, undefined, undefined, undefined, undefined, false)
    body.scale.set(1, 1/12, 1);

    var cockpit = createCoolSphere(ufo, lightBlue, 0, 0, 0, 3, undefined, undefined, undefined, undefined, Math.PI/2, false);
    cockpit.rotation.x += Math.PI;

    var placer = new THREE.Vector3(6, 1/2, 0)
    const div = 4
    for (var i = 0; i < div; i++) {
        placer.applyAxisAngle(new THREE.Vector3(0, 1, 0), 2 * Math.PI/div);
        ufoLightBalls.push(createCoolSphere(ufo, lightBlue, placer.x, placer.y, placer.z, 1/2, undefined, undefined, undefined, undefined, undefined, true));
        ufoPointLights.push(createPointLight(ufo, placer.x, placer.y, placer.z))
    }

    ufoFlatCylinder = createCoolCylinder(ufo);

    ufoSpotLight = createSpotLight(ufo);

    ufo.position.set(0, 75, 75);
    ufo.scale.set(2,2,2);
    scene.add(ufo);

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
    ufo.rotation.y += Math.PI/300
    switchLights();
    moveUFO();
}

function moveUFO() {
    var speed = 1;
    if (upArrow) {
        ufo.position.z += speed;
        if      (leftArrow)  ufo.position.x += speed;
        else if (rightArrow) ufo.position.x -= speed;
    } else if (downArrow) {
        ufo.position.z -= speed;
        if      (leftArrow)  ufo.position.x += speed;
        else if (rightArrow) ufo.position.x -= speed;
    } else if (leftArrow) {
        ufo.position.x += speed;
        if      (upArrow)   ufo.position.z += speed;
        else if (downArrow) ufo.position.z -= speed;
    } else if (rightArrow) {
        ufo.position.x -= speed;
        if      (upArrow)   ufo.position.z += speed;
        else if (downArrow) ufo.position.z -= speed;
    }


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
    createUFO();
    createGlobalLight();
    createAmbientLight();
    tree1 = createTree(0, 15.5, 0);
    tree1.rotation.y += Math.PI;
    tree1.position.set(70, 15.5, 70);
    tree2 = createTree(10, 15.5, 65);
    tree3 = createTree(0, 15.5, 0);
    tree3.rotation.y += Math.PI;
    tree3.position.set(-20, 15.5, 90);
    tree4 = createTree(-10, 13.5, 40);
    tree4.rotation.z -= Math.PI/6;
    tree4.rotation.y += Math.PI/4;
    tree5 = createTree(10, 15.5, 10);

    createPerspectiveCamera(125, 125, 125); 

    render(cameras[0]);

    createGround();
    createSkydome();

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
        case 37: // left arrow
            leftArrow = true;
            break;
        case 38: // up arrow
            upArrow = true;
            break;
        case 39: // right arrow
            rightArrow = true;
            break;
        case 40: // down arrow
            downArrow = true;
            break;
        case 68: // letter D
            canSwitchGlobalLight = true;
            break;
        case 80: // letter P
            canSwitchUFOPointLights = true;
            break;
        case 83: // letter S
            canSwitchUFOSpotLight = true;
            break;function onKeyDown(e) {
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
        case 114: //r
            meshDoor.material = materialDoor;
            break;
        case 87:  //W
        case 119: //w
            meshDoor.material = phongMaterial;
            break;
        case 69:  //E
        case 101: //e
            meshDoor.material = toonMaterial;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {
        case 37: // left arrow
            leftArrow = false;
            break;
        case 38: // up arrow
            upArrow = false;
            break;
        case 39: // right arrow
            rightArrow = false;
            break;
        case 40: // down arrow
            downArrow = false;
            break;
        case 68: // letter D
            canSwitchGlobalLight = false;
            break;
        case 80: // letter P
            canSwitchUFOPointLights = false;
            break;
        case 83: // letter S
            canSwitchUFOSpotLight = false;
            break;
    
    }
}