//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var scene, cameras = [], renderer, current_cam;

var geometry, material, mesh; 

const torsoWidth           = 16,  torsoHeight           = 10, torsoDepth           = 6;
const abdomenWidth         = 10,  abdomenHeight         = 9,  abdomenDepth         = 6;
const waistWidth           = 16,  waistHeight           = 3,  waistDepth           = 1;
const wheelRadiusTop       = 3,   wheelRadiusBottom     = 3,  wheelHeight          =  3;
const headBaseWidth        = 4,   headBaseHeight        = 4,  headBaseDepth        =  4;
const headEyeWidth         = 1,   headEyeHeight         = 1,  headEyeDepth         =  0;
const headAntennaRadius    = 0.5, headAntennaHeight     = 2;
const armWidth             = 4,   armHeight             = 10, armDepth             =  4;
const armUpperExhaustWidth = 2,   armUpperExhaustHeight = 8,  armUpperExhasutDepth =  2.5;
const armLowerExhaustWidth = 1,   armLowerExhaustHeight = 7,  armLowerExhasutDepth =  1;
const legThighWidth        = 2.5, legThighHeight        = 2,  legThighDepth        =  6;
const legLowerWidth        = 4,   legLowerHeight        = 18, legLowerDepth        =  4;
const footWidth            = 4,   footHeight            = 4,  footDepth            =  2;
const footGuardWidth       = 3,   footGuardHeight       = 4,  footGuardDepth       =  1;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(90%, 90%, 90%)");
    scene.add(new THREE.AxisHelper(10));
    //createAtrelado(0, 0 ,0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createOrthographicCamera(x, y, z) {
    'use strict';
    var camera = new THREE.OrthographicCamera(-60 * window.innerWidth / window.innerHeight,
                                               60 * window.innerWidth / window.innerHeight,
                                               60, - 60, 1, 1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);
    cameras.push(camera);
}

function createPerspectiveCamera(x, y, z) {
    'use strict';
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);
    cameras.push(camera);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createCube(obj, x, y, z, width, height, depth) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: true });
    geometry = new THREE.BoxGeometry(width, height, depth);
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function createCylinder(obj, x, y, z, radiusTop, radiusBottom, height) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI/2;
    mesh.rotation.z = Math.PI/2;
    mesh.position.set(x, y-3, z);
    obj.add(mesh);
    return mesh;
}

function createCone(obj, x, y, z) {
    'use strict';
    
}

function createOptimus(x, y, z) {
    'use strict';
    var optimus = new THREE.Object3D();
    
    createCube(optimus, 0, 0, 0, torsoWidth, torsoHeight, torsoDepth); // torso
    createCube(optimus, 0, -(torsoHeight/2 + abdomenHeight/2), 0); // abdomen
    createCube(optimus); // waist
    createCylinder(optimus); // left waist wheel
    createCylinder(optimus); // right waist wheel
    
    var head = new THREE.Object3D(); optimus.add(head);
    createCube(head); // base
    createCube(head); // left eye
    createCube(head); // right eye
    createCone(head); // left antenna
    createCone(head); // right antenna

    leftArm = new THREE.Object3D(); optimus.add(leftArm);
    createCube(leftArm); // upper
    createCube(leftArm); // lower
    createCube(leftArm); // upper exhaust
    createCube(leftArm); // lower exhaust

    rightArm = new THREE.Object3D(); optimus.add(rightArm);
    createCube(rightArm); // upper
    createCube(rightArm); // lower
    createCube(rightArm); // upper exhaust
    createCube(rightArm); // lower exhaust

    leftLeg = new THREE.Object3D(); optimus.add(leftLeg);
    createCube(leftLeg); // thigh
    createCube(leftLeg); // lower
    createCylinder(leftLeg); // upper leg wheel
    createCylinder(leftLeg); // lower leg wheel
    leftFoot = new Three.Object3D(); optimus.add(leftFoot);
    createCube(leftFoot); // foot
    createCube(leftFoot); // guard

    rightLeg = new THREE.Object3D(); optimus.add(rightLeg);
    createCube(rightLeg); // thigh
    createCube(rightLeg); // lower
    createCylinder(rightLeg); // upper leg wheel
    createCylinder(rightLeg); // lower leg wheel
    rightFoot = new Three.Object3D(); optimus.add(rightFoot);
    createCube(rightFoot); // foot
    createCube(rightFoot); // guard

}

function createAtrelado(x, y, z) {
    'use strict';
    var atrelado = new THREE.Object3D();
    createCube(atrelado, 0, 0, 0, 16, 30, 80);
    createCylinder(atrelado, 7, -15, -32);
    createCylinder(atrelado, 7, -15, -24);
    createCylinder(atrelado, -7, -15, -32);
    createCylinder(atrelado, -7, -15, -24);
    scene.add(atrelado);
    atrelado.position.x = x;
    atrelado.position.y = y;
    atrelado.position.z = z;
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

}

/////////////
/* DISPLAY */
/////////////
function render(camera) {
    'use strict';
    current_cam = camera;
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
    createOrthographicCamera(0, 0, 70);     //frontal (vista para xy)
    createOrthographicCamera(70, 0, 0);     //lateral (vista para yz)
    createOrthographicCamera(0, 70, 0);     //topo (vista para xz)
    createOrthographicCamera(50, 50, -50);  //perspetiva isométrica (projeção ortogonal)
    createPerspectiveCamera(50, 50, 50);    //perspetiva isométrica (projeção perspetiva)

    render(cameras[0]);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    render(current_cam);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        for (let i = 0; i < 5; i++) {
            cameras[i].aspect = window.innerWidth / window.innerHeight;
            cameras[i].updateProjectionMatrix();
        }
    }
    render(current_cam);
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
    case 49: // 1
    case 50: // 2
    case 51: // 3 
    case 52: // 4
    case 53: // 5
        render(cameras[e.keyCode - 49]);
        break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}