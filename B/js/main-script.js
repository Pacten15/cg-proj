//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var scene, cameras = [], renderer;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(10));
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createPerspectiveCamera() {
    'use strict';
    var camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    cameras.push(camera);
}

function createPerspectiveCamera() {
    'use strict';
    var camera = new THREE.Camera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    cameras.push(camera);

}

function createPerspectiveCamera() {
    'use strict';
    var camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    cameras.push(camera);
}

function createPerspectiveCamera() {
    'use strict';
    var camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    cameras.push(camera);
}

function createOrtographicCamera() {
    var camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
        camera.position.x = 50;
        camera.position.y = 50;
        camera.position.z = 50;
        camera.lookAt(scene.position);

        cameras.push(camera);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createCube(x, y, z) {
    'use strict';

    var cube = new THREE.Object3D();

    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var geometry = new THREE.BoxGeometry(5, 5, 5);
    
    var mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y, z);
    
    cube.add(mesh);

    scene.add(cube);

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
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
function render() {
    'use strict';
    renderer.render(scene, cameras[0]);
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
    createCamera();

    createCube(0, 0, 0);

    render();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    render();
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

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