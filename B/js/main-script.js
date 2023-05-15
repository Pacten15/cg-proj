//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var scene, cameras = [], renderer, current_cam;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(90%, 90%, 90%)");
    scene.add(new THREE.AxisHelper(10));
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createOrthographicCamera(x, y, z) {
    'use strict';
    var camera = new THREE.OrthographicCamera( - 60 * window.innerWidth / window.innerHeight, 60 * window.innerWidth / window.innerHeight, 60, - 60, 1, 1000 );
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt( scene.position );

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
function createCube(x, y, z) {
    'use strict';

    var cube = new THREE.Object3D();

    var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

    var geometry = new THREE.BoxGeometry(15, 15, 15);
    
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

    createCube(0, 0, 0);

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
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
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