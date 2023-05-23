//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var scene, cameras = [], renderer, currentCam, atrelado, optimus, movementVector = [0, 0, 0];
var geometry, material, mesh;

// arrow keys detection
var leftArrow = false, upArrow = false, downArrow = false, rightArrow = false;

// legs
var legs, alegsX, alegsY, alegsZ;
var rotatePositiveLegs = false, rotateNegativeLegs = false; // legs manipulation

// feet
var originFootX, originFootY, originFootZ
var feet, feetX, feetY, feetZ;
var rotatePositiveFeet= false, rotateNegativeFeet = false;


var leftArm, rightArm, translanteInwards, translanteOutwards, translateArmsX, translateArmsY, translateArmsZ; // arms manipulation

var head, aheadX, aheadY, aheadZ, angleHeadX, angleHeadY, angleHeadZ, rotatePositiveHead = false, rotateNegativeHead = false; // head manipulation

// colors
const red = 0xFF0000, blue = 0x0000FF, yellow = 0xFFFF00, gray = 0x999999, black = 0x000000;

// optimus' parts dimensions
const torsoWidth           = 16,  torsoHeight           = 10, torsoDepth           = 6;
const abdomenWidth         = 10,  abdomenHeight         = 9,  abdomenDepth         = 6;
const waistWidth           = 16,  waistHeight           = 3,  waistDepth           = 1;
const wheelRadius          = 3,   wheelHeight           = 3;
const headBaseWidth        = 4,   headBaseHeight        = 4,  headBaseDepth        = 4;
const eyeWidth             = 1,   eyeHeight             = 1,  eyeDepth             = 0;
const antennaRadius        = 0.5, antennaHeight         = 2;
const armWidth             = 4,   armHeight             = 10, armDepth             = 4;
const lowerExhaustWidth    = 2,   lowerExhaustHeight    = 8,  lowerExhaustDepth    = 2;
const upperExhaustWidth    = 1,   upperExhaustHeight    = 3,  upperExhaustDepth    = 1;
const thighWidth           = 2,   thighHeight           = 7,  thighDepth           = 2.5;
const legLowerWidth        = 4,   legLowerHeight        = 18, legLowerDepth        = 4;
const footWidth            = 4,   footHeight            = 4,  footDepth            = 2;
const footGuardWidth       = 3,   footGuardHeight       = 4,  footGuardDepth       = 1;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(90%, 90%, 90%)");
    scene.add(new THREE.AxesHelper(10));
    createOptimus(0, 0, 0);
    /*createAtrelado(0, 0, -50);*/
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createOrthographicCamera(x, y, z) {
    'use strict';
    var camera = new THREE.OrthographicCamera(-60 * window.innerWidth / window.innerHeight,
                                               60 * window.innerWidth / window.innerHeight,
                                               60, - 60, 1, 1000);
    camera.position.set(x, y, z);
    camera.lookAt(scene.position);
    cameras.push(camera);
}

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
    geometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight);
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

function createOptimus(x, y, z) {
    'use strict';
    optimus = new THREE.Object3D();
    
    createCube(optimus, 0, 0, 0, torsoWidth, torsoHeight, torsoDepth, red); // torso
    var abdomenY = -torsoHeight/2 - abdomenHeight/2;
    createCube(optimus, 0, abdomenY, 0, abdomenWidth, abdomenHeight, abdomenDepth, red); // abdomen
    var waistY = abdomenY - 2.5;
    createCube(optimus, 0, waistY, 3, waistWidth, waistHeight, waistDepth, gray); // waist
    var waistWheelX = abdomenWidth/2 + wheelHeight/2;
    var waistWHeelY = abdomenY - 3;
    createCylinder(optimus,  waistWheelX, waistWHeelY, 0); // left waist wheel
    createCylinder(optimus, -waistWheelX, waistWHeelY, 0); // right waist wheel
    
    head = new THREE.Object3D(); optimus.add(head);
    head.position.set(0, 2, 0);
    var headBaseY = 5
    createCube(head, 0, headBaseY, 0, headBaseWidth, headBaseHeight, headBaseDepth, blue); // head base
    var eyeX = 1;
    var eyeY = headBaseY + 0.5;
    var eyeZ = headBaseDepth/2;
    createCube(head,  eyeX, eyeY, eyeZ, eyeWidth, eyeHeight, eyeDepth, yellow); // left eye
    createCube(head, -eyeX, eyeY, eyeZ, eyeWidth, eyeHeight, eyeDepth, yellow); // right eyes
    var antennaX = headBaseWidth/2 + antennaRadius
    var antennaY = headBaseY + headBaseHeight/2;
    createCone(head,  antennaX, antennaY, 0, antennaRadius, antennaHeight, blue); // left antenna
    createCone(head, -antennaX, antennaY, 0, antennaRadius, antennaHeight, blue); // right antenna

    leftArm  = new THREE.Object3D(); optimus.add(leftArm);
    rightArm = new THREE.Object3D(); optimus.add(rightArm);
    leftArm .position.set( 5, 0, 0)
    rightArm.position.set(-5, 0, 0)
    var armX = 3 + armWidth/2;
    var lowerArmY = -armHeight;
    createCube(leftArm,   armX, 0, 0, armWidth, armHeight, armDepth, red); // left upper arm
    createCube(rightArm, -armX, 0, 0, armWidth, armHeight, armDepth, red); // right upper arm
    var lowerExhaustX = armX + armWidth/2 + lowerExhaustWidth/2;
    var upperExhaustY = lowerExhaustHeight/2 + upperExhaustHeight/2;
    createCube(leftArm,   lowerExhaustX, 0, 0, lowerExhaustWidth, lowerExhaustHeight, lowerExhaustDepth, gray); // left lower exhaust
    createCube(rightArm, -lowerExhaustX, 0, 0, lowerExhaustWidth, lowerExhaustHeight, lowerExhaustDepth, gray); // right lower exhaust
    createCube(leftArm,   lowerExhaustX, upperExhaustY, 0, upperExhaustWidth, upperExhaustHeight, upperExhaustDepth, gray); // left upper exhaust
    createCube(rightArm, -lowerExhaustX, upperExhaustY, 0, upperExhaustWidth, upperExhaustHeight, upperExhaustDepth, gray); // right lower exhaust

    createCube(leftArm,   armX, lowerArmY, 0, armWidth, armHeight, armDepth, red); // left lower arm
    createCube(rightArm, -armX, lowerArmY, 0, armWidth, armHeight, armDepth, red); // right lower arm

    legs = new THREE.Object3D(); optimus.add(legs);
    legs.position.set(0, abdomenY-2.5, 0);
    var thighX = abdomenWidth/2 - abdomenWidth/5;
    var thighY = -2 - thighHeight/2;
    var thighZ = 0;
    createCube(legs,  thighX, thighY, thighZ, thighWidth, thighHeight, thighDepth, gray); // left thigh
    createCube(legs, -thighX, thighY, thighZ, thighWidth, thighHeight, thighDepth, gray); // right thigh
    var legLowerX = thighX;
    var legLowerY = thighY - thighHeight/2 - legLowerHeight/2;
    createCube(legs,  legLowerX, legLowerY, thighZ, legLowerWidth, legLowerHeight, legLowerDepth, blue); // left lower leg
    createCube(legs, -legLowerX, legLowerY, thighZ, legLowerWidth, legLowerHeight, legLowerDepth, blue); // right lower leg
    var legWheelX = legLowerX + legLowerWidth/2 + wheelHeight/2;
    var upperLegWheelY = thighY - thighHeight/2 - 6;
    var lowerLegWheelY = upperLegWheelY - wheelRadius - 2 - wheelRadius;
    createCylinder(legs,  legWheelX, upperLegWheelY, thighZ); // left upper leg wheel
    createCylinder(legs, -legWheelX, upperLegWheelY, thighZ); // right upper leg wheel
    createCylinder(legs,  legWheelX, lowerLegWheelY, thighZ); // left lower leg wheel
    createCylinder(legs, -legWheelX, lowerLegWheelY, thighZ); // right lower leg wheel

    
    feet = new THREE.Object3D(); optimus.add(feet);
    originFootX = legLowerX;
    originFootY = legLowerY - legLowerHeight/2 + footHeight/2
    originFootZ = legLowerDepth/2 + footDepth/2;
    feet.position.set(0, originFootY, 0)
    var footX = 3;
    var footY = 0;
    var footZ = 3; 
    createCube(feet,  footX, footY, footZ, footWidth, footHeight, footDepth, blue); // left foot
    createCube(feet, -footX, footY, footZ, footWidth, footHeight, footDepth, blue); // right foot
    var footGuardX = footX + footWidth/2 + footGuardWidth/2;
    var footGuardY = footY;
    var footGuardZ = footZ + footGuardDepth/2;
    createCube(feet,  footGuardX, footGuardY, footGuardZ, footGuardWidth, footGuardHeight, footGuardDepth, blue); // left foot guard
    createCube(feet, -footGuardX, footGuardY, footGuardZ, footGuardWidth, footGuardHeight, footGuardDepth, blue); // right foot guard
 
    legs.add(feet);
    
    scene.add(optimus);
    optimus.position.set(x, y, z);
}

function moveHead() {
    var speed = Math.PI/40 ; // Rotation speed (in radians)

    if (rotatePositiveHead) {
        head.rotation.x += speed;
        if (head.rotation.x >= 0) head.rotation.x = 0;
    }

    if (rotateNegativeHead) {
        head.rotation.x -= speed;
        if (head.rotation.x <= -Math.PI/2) head.rotation.x = -Math.PI/2;
    }
}

function moveArms() {
    var speed = Math.PI/40 ; // Rotation speed (in radians)

    if (translanteOutwards) { // E
        leftArm.rotation.y  -= speed;
        rightArm.rotation.y += speed;
        if (leftArm.rotation.y <= 0) {
            leftArm.rotation.y  = 0;
            rightArm.rotation.y = 0;
        }
    }

    if (translanteInwards) { // D
        leftArm.rotation.y  += speed;
        rightArm.rotation.y -= speed;
        if (leftArm.rotation.y >=  Math.PI/2) { 
            leftArm.rotation.y  =  Math.PI/2;
            rightArm.rotation.y = -Math.PI/2;
        }
    }
}

function moveLegs() {
    var speed = Math.PI/40 ; // Rotation speed (in radians)

    if (rotatePositiveLegs) {
        legs.rotation.x += speed;
        if (legs.rotation.x >= Math.PI/2) legs.rotation.x = Math.PI/2;
    }

    if (rotateNegativeLegs ) {
        legs.rotation.x -= speed;
        if (legs.rotation.x <= 0) legs.rotation.x = 0;
    }
}

function moveFeet() {
    var speed = Math.PI/40 ; // Rotation speed (in radians)

    if (rotatePositiveFeet && (feet.rotation.x < Math.PI/2)) {
        feet.rotation.x += speed;
        if (feet.rotation.x >= Math.PI/2) feet.rotation.x = Math.PI/2;
    }

    if (rotateNegativeFeet && (feet.rotation.x > 0 )) {
        feet.rotation.x -= speed;
        if (feet.rotation.x <= 0) feet.rotation.x = 0;
    }
}


function createAtrelado(x, y, z) {
    'use strict';
    atrelado = new THREE.Object3D();
    createCube(atrelado, 0, 0, 0, 16, 30, 80, gray);
    createCylinder(atrelado, 7  , -15 -3, -32);
    createCylinder(atrelado, 7, -15 -3, -24);
    createCylinder(atrelado, -7, -15 -3, -32);
    createCylinder(atrelado, -7, -15 -3, -24);
    scene.add(atrelado);
    atrelado.position.set(x, y, z);
}

function moveAtrelado() {
    var speed = 0.6;
    if (leftArrow == true && rightArrow == false) {
        atrelado.position.x += speed;
    }
    else if (leftArrow == false && rightArrow == true) {
        atrelado.position.x -= speed;
    }
    if (upArrow == true && downArrow == false) {
        atrelado.position.z += speed;
    }
    else if (upArrow == false && downArrow == true) {
        atrelado.position.z -= speed;
    }
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
    createOrthographicCamera(0, 0, 70);     //frontal (vista para xy)
    createOrthographicCamera(70, 0, 0);     //lateral (vista para yz)
    createOrthographicCamera(0, 70, 0);     //topo (vista para xz)
    createOrthographicCamera(50, 50, -50);  //perspetiva isométrica (projeção ortogonal)
    createPerspectiveCamera(50, 50, 50);    //perspetiva isométrica (projeção perspetiva)

    render(cameras[0]);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    moveAtrelado();
   
    moveFeet();

    moveLegs();

    moveArms();

    moveHead();

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
        for (let i = 0; i < 5; i++) {
            cameras[i].aspect = window.innerWidth / window.innerHeight;
            cameras[i].updateProjectionMatrix();
        }
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
        case 49: // 1
        case 50: // 2
        case 51: // 3 
        case 52: // 4
        case 53: // 5
            render(cameras[e.keyCode - 49]);
            break;
        case 54: // 6
            scene.traverse(function(node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            })
            render(currentCam);
            break;
        case 65 : // letter A
            rotateNegativeFeet = true;
            break;
        case 68: // letter D
            translanteInwards = true;
            break;
        case 69: // letter E
            translanteOutwards = true;
            break;
        case 70: // letter F
            rotateNegativeHead = true;
            break;
        case 81 :// letter Q
            rotatePositiveFeet = true;
            break;
        case 82 : // letter R
            rotatePositiveHead = true;
            break;
        case 83 : // letter S
            rotateNegativeLegs = true;
            break;
        case 87 : // letter W
            rotatePositiveLegs = true; // rotation
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
        case 65 : // letter A
            rotateNegativeFeet = false;
            break;
        case 68: // letter D
            translanteInwards = false;
            break;
        case 69: // letter E
            translanteOutwards = false;
            break;
        case 70: // letter F
            rotateNegativeHead = false;
            break;
        case 81 :// letter Q
            rotatePositiveFeet = false;
            break;
        case 82 : // letter R
            rotatePositiveHead = false;
            break;
        case 83 : // letter S
            rotateNegativeLegs = false;
            break;
        case 87 : // letter W
            rotatePositiveLegs = false; // rotation
            break; 
        
    }
}