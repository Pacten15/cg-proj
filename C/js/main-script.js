//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var scene, renderer, groundMesh;

var geometry, material, mesh;

var skyDomeGeo, skyDome;

var sky;

var loader, texture;

var door, window1, window2, base, roof;

var controls;

var moon, globalLight, ambientLight;

var tree1, tree2, tree3, tree4, tree5, meshDoor, materialDoor;


var currentCam = [];

var ufo;
var ufoPointLights = [];
var ufoSpotLight;
var ufoLightBalls = [];
var ufoFlatCylinder;
var moonMesh;

var objects = [], colors = [];


// colors
const blue = 0x0000FF, yellow = 0xFFFF00, gray = 0x999999, darkGray = 0x555555, black = 0x000000, white = 0xF8F8FF, lilac = 0xC8A2C8;
const orange = 0xF5761A, moonYellow = 0xEBC815, lightBlue = 0x6495ED, orange_brown = 0xC5761A, green = 0x006400, lightGreen = 0x117c13;

var canSwitchGlobalLight = false;
var canSwitchUFOPointLights = false;
var canSwitchUFOSpotLight = false;

var leftArrow = false;
var rightArrow = false;
var upArrow = false;
var downArrow = false;

var scene,  groundScene,  skyScene;
var camera, groundCamera, skyCamera;

var stereoCamera;
var leftEyeCamera, rightEyeCamera;

var groundRenderTarget;
var skyRenderTarget;

var generateGroundTexture = false;
var generateSkyTexture = false;

var planeSide = 250;
var textureSide = 50;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(90%, 90%, 90%)");
    scene.add(new THREE.AxesHelper(10));
    createGround();
    createHouse(20,-1.9,60);
    createMoon();
    createSkydome();
    createUFO();
    createAmbientLight();
    createTrees();
}

function createGroundTextureScene(init) {
    'use strict';

    if (init) {
        groundScene = new THREE.Scene();
        groundScene.background = new THREE.Color("rgb(20%, 20%, 20%)");
    } else {
        groundScene.clear()
    }

    geometry = new THREE.PlaneGeometry(textureSide, textureSide);
    material = new THREE.MeshBasicMaterial({ color: lightGreen })
    mesh = new THREE.Mesh(geometry, material)
    groundScene.add(mesh);
    
    createDots(100, white, groundScene);
    createDots(100, yellow, groundScene);
    createDots(100, lilac, groundScene);
    createDots(100, lightBlue, groundScene);
}

function createSkyTextureScene(init) {
    'use strict';

    if (init) {
        skyScene = new THREE.Scene();
        skyScene.background = new THREE.Color("rgb(20%, 20%, 20%)");
    } else {
        skyScene.clear()
    }

    geometry = new THREE.PlaneGeometry(textureSide, textureSide);
    var material = new THREE.ShaderMaterial({
        uniforms: {
          color1: {
            value: new THREE.Color("blue")
          },
          color2: {
            value: new THREE.Color("purple")
          }
        },
        vertexShader: `
          varying vec2 vUv;
      
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
        
          varying vec2 vUv;
          
          void main() {
            
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
          }
        `,
    });

    mesh = new THREE.Mesh(geometry, material)
    skyScene.add(mesh);

    createDots(300, white, skyScene);
}

function createDots(numDots, color, scene) {
    for (var i = 0; i < numDots; i++) {
        createCircle(
            scene,
            getRandomBetween(-textureSide/2, textureSide/2),
            getRandomBetween(-textureSide/2, textureSide/2),
            0,
            0.1,
            color
        );
    }
}

function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createPerspectiveCamera(scene, x, y, z) {
    'use strict';
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(x, y, z);
    camera.lookAt(scene.position);
    scene.add(camera);
    return camera;

}

function createOrthographicCamera(scene, x, y, z) {
    'use strict';
    var camera = new THREE.OrthographicCamera(-textureSide/2, textureSide/2, textureSide/2, -textureSide/2, 0, 1000);
    camera.position.set(x, y, 100);
    camera.lookAt(scene.position);
    scene.add(camera);
    return camera;
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createGlobalLight() {
    'use strict'
    globalLight = new THREE.DirectionalLight(moonYellow, .40);
    globalLight.position.set(20, 80, 20);
    scene.add(globalLight);
}


function createAmbientLight() {
    'use strict'
    ambientLight = new THREE.AmbientLight(moonYellow, 0.5);
    scene.add(ambientLight);
}

function switchLights() {
    'use strict'

    if (canSwitchGlobalLight) {
        switchIt(globalLight, moonYellow)
        canSwitchGlobalLight = false;
    } else if (canSwitchUFOPointLights) {
        for (const pointLight of ufoPointLights) {
            switchIt(pointLight, white);
        }
        for (const lightBall of ufoLightBalls) {
            switchEmmissive(lightBall, lightBlue);
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
        if (mesh.material.emissive !== undefined) {
            if (mesh.material.emissive.getHex() == emmissionColor) {
                mesh.material.emissive.set(black);
            } else if (mesh.material.emissive.getHex() == black) {
            mesh.material.emissive.set(emmissionColor);
            }
        }
    }
}

function createSpotLight(obj) {
    'use strict'
    const spotLight = new THREE.SpotLight( white, 1, 100, Math.PI/6, .75);
    obj.add(spotLight);
    obj.add(spotLight.target);
    return spotLight;
}

function createPointLight(obj, x, y, z) {
    'use strict'
    const light = new THREE.PointLight(white, 1, 10);
    light.position.set( x, y, z );
    scene.add(light);
    obj.add(light)
    return light;
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createCircle(obj, x, y, z, radius, color) {
    'use strict';
    geometry = new THREE.CircleGeometry(radius);
    material = new THREE.MeshBasicMaterial({ color: color});
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function createCylinder(obj, x, y, z) {
    'use strict';
    material = new THREE.MeshPhongMaterial({ color: orange_brown, wireframe: false });
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
    material = new THREE.MeshPhongMaterial({ color: gray, emissive: gray });
    geometry = new THREE.CylinderGeometry(3, 3, .5, 32);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -1/3, 0);
    obj.add(mesh);

    objects.push(mesh);
    colors.push(gray);
    return mesh;
}

function createSphere(obj, x, y, z, radius, width, height, color) {
    'use strict' ;
    material = new THREE.MeshPhongMaterial({ color: color });
    geometry = new THREE.SphereGeometry(radius, width, height);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);

    objects.push(mesh);
    colors.push(color);
    return mesh;
}

function createCoolSphere(obj, color, x, y, z, radius, widthSegments, heightSegments, phiStart, phiLenght, thetaStart, spot) {
    'use strict';
    if (spot) {
        material = new THREE.MeshPhongMaterial({ emissive: color });
    } else {
        material = new THREE.MeshPhongMaterial({ color: color });
    }
    geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLenght, thetaStart);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);

    objects.push(mesh);
    colors.push(color);
    return mesh;
}


function createHouseWallBack(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshPhongMaterial({ color: color, side: THREE.FrontSide });
    geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array ([
        0, 0, 0,                       // Vertex 0
        0, height, 0,                  // Vertex 1
        width , 0, 0,                  // Vertex 2
        width , height, 0             // Vertex 3
    ]);


    var indices = [
        3, 2, 0,
        0, 1, 3
    ];

    var indexAttribute = new THREE.Uint16BufferAttribute(indices, 1);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indexAttribute);

    // Compute vertex normals for proper shading
    geometry.computeVertexNormals();

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-12,y-6,z-6);
    obj.add(mesh);

    objects.push(mesh);
    colors.push(color);
    return mesh;

}


function createHouseWallSideRight(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshPhongMaterial({ color: color, side: THREE.FrontSide });
    geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array ([
        0, 0, 0,                       // Vertex 0
        0, height/2, 0,                // Vertex 1
        0, 0, width,                   // Vertex 2
        0, height/2, width             // Vertex 3
    ]);


    var indices = [
        3, 2, 0,
        0, 1, 3
    ];
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    // Compute vertex normals for proper shading
    geometry.computeVertexNormals();

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-12,y-6,z-6);
    mesh.rotation.set(Math.PI/2, Math.PI, 0);
    obj.add(mesh);

    objects.push(mesh);
    colors.push(color);
    return mesh;
}

function createHouseWallSideLeft(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshPhongMaterial({ color: color, side: THREE.FrontSide });
    geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array ([
        0, 0, 0,                       // Vertex 0
        0, height/2, 0,                // Vertex 1
        0, 0, width,                   // Vertex 2
        0, height/2, width             // Vertex 3
    ]);


    var indices = [
        2, 1, 0,
        3, 1, 2    
    ];
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    // Compute vertex normals for proper shading
    geometry.computeVertexNormals();

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-12,y-6,z-6);
    mesh.rotation.set(Math.PI/2, Math.PI, 0);
    obj.add(mesh);

    objects.push(mesh);
    colors.push(color);
    return mesh;
}

function createHouseFront(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshPhongMaterial({ color: color, side: THREE.FrontSide });
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
        width-14, (2/3)*height, 0,              // Vertex 13
        width-10, (2/3)*height, 0,              // Vertex 14
        width-10, (1/3)*height, 0,              // Vertex 15
        width-6,  (2/3)*height, 0,              // Vertex 16
        width-6,  (1/3)*height, 0,              // Vertex 17
        width-2,  (2/3)*height, 0,              // Vertex 18
        width-2,  (1/3)*height, 0,              // Vertex 19
        width,    (1/3)*height, 0,              // Vertex 20
        width-10, 0, 0                          // Vertex 21
 
    ]);


    var indices = [
        4, 5, 3,
        1, 4, 3,
        4, 6, 8,
        6, 7, 8,
        10, 9, 0,
        9, 6, 0,
        9, 13, 11,
        13, 12, 11,
        17, 16, 15,
        16, 14, 15,
        2, 20, 21,
        20, 15, 21,
        20, 5, 19,
        5, 18, 19
    ];
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    // Compute vertex normals for proper shading
    geometry.computeVertexNormals();

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-12,y-6,z+6);
    obj.add(mesh);
    objects.push(mesh);
    colors.push(color);
    return mesh;
}


function createRoof(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshPhongMaterial({ color: color, side: THREE.FrontSide });
    geometry = new THREE.BufferGeometry();

    // Define the vertices of the pyramid
    var vertices = new Float32Array ([
        x, y + height, z,                          // Vertex 0 (apex)
        x - width , y, z - width / 2,              // Vertex 1 
        x, y, z - width/2,                         // Vertex 2
        x + width , y, z - width / 2,              // Vertex 3
        x + width, y, z,                           // Vertex 4 
        x + width , y, z + width / 2,              // Vertex 5
        x, y, z + width / 2,                       // Vertex 6
        x - width , y, z + width / 2,              // Vertex 7
        x , y, z + width/2,                         // Vertex 8
        x - width, y, z 
    ]);

    // Define the faces (triangles) by specifying the indices of the vertices
    var indices = [
        0, 2, 1,
        0, 3, 2,
        3, 0, 4,
        5, 4, 0,
        5, 0, 8,
        7, 8, 0,
        0, 9, 7,
        0, 1, 9

    ];

    // Set the vertices and indices of the geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    // Compute vertex normals for proper shading
    geometry.computeVertexNormals();

    mesh = new THREE.Mesh(geometry, material);
    obj.add(mesh);

    objects.push(mesh);
    colors.push(color);
    return mesh;
}

function createWindows(obj, x, y, z, width, height, color) {
    'use strict';
    material = new THREE.MeshPhongMaterial({ color: color, side: THREE.FrontSide });
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
        2, 3, 0,
        3, 1, 0,
        5, 4, 7,
        4, 6, 7

    ];
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    // Compute vertex normals for proper shading
    geometry.computeVertexNormals();

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-12,y-6,z+6);
    obj.add(mesh);

    objects.push(mesh);
    colors.push(color);
    return mesh;  
}

function createDoor(obj, x, y, z, width, height) {
    'use strict' ;
    var door = new THREE.Object3D();
    material = new THREE.MeshPhongMaterial({ color: lightBlue, side: THREE.FrontSide });
    geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array ([
        width-14, 0, 0,                         // Vertex 0
        width-14, (2/3)*height, 0,              // Vertex 1
        width-10, 0, 0,                         // Vertex 2
        width-10, (2/3)*height, 0,              // Vertex 3    
    ]);


    var indices = [
        2, 3, 0,
        3, 1, 0
    ];
    

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    // Compute vertex normals for proper shading
    geometry.computeVertexNormals();


    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x-12,y-6,z+6);
    objects.push(mesh);
    colors.push(lightBlue);
    door.add(mesh);
    createSphere(door, x+1, y-1.4, z+6.3, 0.3, 80, 32, white);
    obj.add(door);
    objects.push(mesh);
    colors.push(white);
    return mesh;
    
}


function createGround() {
    'use strict' ;
    var groundGeo = new THREE.PlaneGeometry(planeSide, planeSide, 25, 25);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("js/heightmap.png");

    const material = new THREE.MeshPhongMaterial( {
           //color: blue,
           map: groundRenderTarget.texture,
           displacementMap: texture,
           displacementScale: 25,
           side: THREE.DoubleSide
    });

    groundMesh = new THREE.Mesh(groundGeo, material);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.rotation.z = -Math.PI / 4;
    groundMesh.position.y = -10;
    groundMesh.scale.set(1.40,1.40,1.40);
    scene.add(groundMesh);
}

function createMoon() {
    'use strict';
    moon = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: moonYellow, emissive: moonYellow });
    geometry = new THREE.SphereGeometry(10);
    moonMesh = new THREE.Mesh(geometry, material);
    moonMesh.scale.set(2,2,2);
    moon.add(moonMesh);

    objects.push(moonMesh);
    colors.push(moonYellow);
    
    createGlobalLight();
    
    moon.position.set(20, 80, 20);
    scene.add(moon);
}

function createSkydome() {
    'use strict' ;
    geometry = new THREE.SphereGeometry(250, 80, 32);
    const material = new THREE.MeshPhongMaterial({ map: skyRenderTarget.texture, side: THREE.BackSide });
    sky = new THREE.Mesh(geometry, material);
    sky.position.set(0,0,0);
    scene.add(sky);
}

function createHouse(x,y,z) {
    'use strict' ;
    var house = new THREE.Object3D();

    createHouseWallBack(house, x, y, z, 24, 12, white);

    createHouseWallSideRight(house , x, y, z, 12, 24, white);

    createHouseWallSideLeft(house , x+24, y, z, 12, 24, white);

    createHouseFront(house, x, y, z, 24, 12, white);

    createWindows(house, x, y, z, 24, 12, lightBlue);

    createDoor(house, x, y, z, 24, 12);

    createRoof(house, x, y + 6, z, 12, 8 ,orange);

    scene.add(house);
    house.rotation.set(0, 40, 0);
    house.position.set(x-80, y, z+50);
}

function createTree(x,y,z) {
    'use strict' ;
    
    var tree = new THREE.Object3D()

    mesh = createCylinder(tree, x, y, z);

    objects.push(mesh);
    colors.push(orange_brown);

    material = new THREE.MeshPhongMaterial({ color: green } );
    geometry = new THREE.SphereGeometry(3, 32, 16);
    geometry.scale(2, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 8.5, z);
    objects.push(mesh);
    colors.push(green);
    tree.add(mesh);
    
    material = new THREE.MeshPhongMaterial({ color: orange_brown });
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x - 3, y + 3, z);
    mesh.rotation.z += Math.PI / 4;
    objects.push(mesh);
    colors.push(orange_brown);
    tree.add(mesh);

    material = new THREE.MeshPhongMaterial({ color: green } );
    geometry = new THREE.SphereGeometry(0.5, 32, 16);
    geometry.scale(2, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x - 4.7, y + 4.7, z);
    mesh.rotation.z += Math.PI / 4;
    objects.push(mesh);
    colors.push(green);
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

    for (const ball of ufoLightBalls) {
        ball.material.color.set(lightBlue);
    }

    ufoFlatCylinder = createCoolCylinder(ufo);

    ufoSpotLight = createSpotLight(ufo);

    ufo.position.set(0, 50, 75);
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

function turnEmissive() {
    if (ufoPointLights[0].color.getHex() == black) {
        for (const ball of ufoLightBalls) {
            if (ball.material.emissive !== undefined)
                ball.material.emissive.set(black);
        }
    }
    else {
        for (const ball of ufoLightBalls) {
            if (ball.material.emissive !== undefined)
                ball.material.emissive.set(lightBlue);
        }
    }
    if (ufoSpotLight.color.getHex() == black) {
        if (ufoFlatCylinder.material.emissive !== undefined)
            ufoFlatCylinder.material.emissive.set(black);
    }
    else {
        if (ufoFlatCylinder.material.emissive !== undefined)
            ufoFlatCylinder.material.emissive.set(gray);
    }
    if (globalLight.color.getHex() == black) {
        if(moonMesh.material.emissive !== undefined)
            moonMesh.material.emissive.set(black);
    }
    else {
        if (moonMesh.material.emmisive !== undefined)
            moonMesh.material.emissive.set(moonYellow);
    }
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    controls.update()
    ufo.rotation.y += Math.PI/300
    turnEmissive();
    switchLights();
    moveUFO();
}

function moveUFO() {
    var speed = 1;
    if (upArrow) {
        ufo.position.z += speed;
        if      (leftArrow)  ufo.position.x += speed;
        else if (rightArrow) ufo.position.x -= speed;
        else if (downArrow)  ufo.position.z -= speed;
    } else if (downArrow) {
        ufo.position.z -= speed;
        if      (leftArrow)  ufo.position.x += speed;
        else if (rightArrow) ufo.position.x -= speed;
        else if (upArrow)    ufo.position.z += speed;
    } else if (leftArrow) {
        ufo.position.x += speed;
        if      (upArrow)   ufo.position.z += speed;
        else if (downArrow) ufo.position.z -= speed;
        else if (rightArrow) ufo.position.x -= speed;
    } else if (rightArrow) {
        ufo.position.x -= speed;
        if      (upArrow)   ufo.position.z += speed;
        else if (downArrow) ufo.position.z -= speed;
        else if (leftArrow) ufo.position.x += speed;
    }
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    if (generateGroundTexture) {
        createGroundTextureScene(false)
        renderGroundTexture()
    } else if (generateSkyTexture) {
        createSkyTextureScene()
        renderSkyTexture()
    }
    
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(scene, camera);
    //renderer.render(groundScene, groundCamera);
}

function renderGroundTexture() {
    'use strict';
    renderer.setRenderTarget(groundRenderTarget);
    renderer.clear();
    renderer.render(groundScene, groundCamera);
}

function renderSkyTexture() {
    'use strict';
    renderer.setRenderTarget(skyRenderTarget);
    renderer.clear();
    renderer.render(skyScene, skyCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    createRenderTargets();
    
    createScene();
    createGroundTextureScene(true);
    createSkyTextureScene(true);
    
    camera = createPerspectiveCamera(scene, 145, 100, 5);
    groundCamera = createOrthographicCamera(groundScene, 0, 0, 10);
    skyCamera    = createOrthographicCamera(skyScene, 0, 0, 10);    
    
    createRenderer();

    document.body.appendChild( VRButton.createButton( renderer ) );
    renderer.xr.enabled = true;

    renderer.setAnimationLoop( function () {
        renderer.render( scene, camera );
    
    } );
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.keys = {};

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    renderGroundTexture();
    renderSkyTexture();
}

function createRenderTargets() {
    'use strict';
    groundRenderTarget = new THREE.WebGLRenderTarget(textureSide * 64, textureSide * 64);
    skyRenderTarget    = new THREE.WebGLRenderTarget(textureSide * 64, textureSide * 64);
}

function createRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    
}

function createTrees() {
    tree1 = createTree(0, -2, 0);
    tree1.rotation.y += Math.PI;
    tree1.position.set(70, -2, 70);
    tree2 = createTree(10, -2, 65);
    tree3 = createTree(0, -2, 0);
    tree3.rotation.y += Math.PI;
    tree3.position.set(-20, -2, 90);
    tree4 = createTree(-10, -5, 40);
    tree4.rotation.z -= Math.PI/6;
    tree4.rotation.y += Math.PI/4;
    tree5 = createTree(10, -2, 10);

}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    requestAnimationFrame(animate);
    update();
    render();
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    render(currentCam);
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    let size = objects.length;
    switch (e.keyCode) {
        case 49: // number 1
            generateGroundTexture = true;
            break;
        case 50: // number 2
            generateSkyTexture = true;
            break;
        case 37: // left arrow
            leftArrow = true;
            break;
        case 38: // up arrow
            upArrow = true;
            break;
        case 39: // right arrow
            rightArrow = true;1
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
            break;
        case 81:  //Q
            var i;
            for (i = 0; i < size; i++) {
                objects[i].material = new THREE.MeshLambertMaterial({ color: colors[i], side: THREE.DoubleSide });
            }
            break;
        case 82:  //R
            var i;
            for (i = 0; i < size; i++) {
                objects[i].material = new THREE.MeshBasicMaterial({ color: colors[i], side: THREE.DoubleSide });
            }
            break;
        case 87:  //W
            var i;
            for (i = 0; i < size; i++) {
                objects[i].material = new THREE.MeshPhongMaterial({ color: colors[i], side: THREE.DoubleSide });
            }
            break;
        case 69:  //E
            var i;
            for (i = 0; i < size; i++) {
                objects[i].material = new THREE.MeshToonMaterial({ color: colors[i], side: THREE.DoubleSide });
            }
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {
        case 49: // number 1
            generateGroundTexture = false;
            break;
        case 50: // number 2
            generateSkyTexture = false;
            break;
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