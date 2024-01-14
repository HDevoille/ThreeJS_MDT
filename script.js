import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera1.position.set(100,100,100);

const camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
camera2.position.set(3,2,-1.5);

const camera3 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
camera3.position.set(20,2,-1.5);

const cameralist = [camera1,camera2,camera3];

let currentcamera = cameralist[0];

const canvas = document.getElementById("canvas");

const controls = new OrbitControls(camera1, canvas);
controls.enablePan = false; // Disable panning
controls.enableDamping = true; // an animation loop is required when damping is enabled
controls.dampingFactor = 0.25; // set damping factor (0 = no damping, 1 = full damping)

const controls1 = new OrbitControls(camera2, canvas);
controls1.target = new THREE.Vector3(camera2.position.x,camera2.position.y,camera2.position.z+0.01);

const controls2 = new OrbitControls(camera3, canvas);
controls2.target = new THREE.Vector3(camera3.position.x,camera3.position.y,camera3.position.z+0.01);

let clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

window.addEventListener('resize', () => {
    // Update the camera
    currentcamera.aspect =  window.innerWidth / window.innerHeight;
    currentcamera.updateProjectionMatrix();

    // Update the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

let starship = new THREE.Object3D();
let SSVEP_light_1 = new THREE.PointLight();
let SSVEP_light_2 = new THREE.PointLight();
let door_left = new THREE.Object3D();
let door_right = new THREE.Object3D();

let loader = new GLTFLoader();
loader.load(
    "./objects/SampleScene.gltf",
    (test) => {
        let mesh = test.scene;
        console.log(mesh);
        scene.add(mesh);
        starship = scene.getObjectByName('Ships').getObjectByName('SpaceWarship01_Var1_Red_Prefab');
        SSVEP_light_1 = scene.getObjectByName('SSVEP_Light').getObjectByName('Roof_Light_003').getObjectByName('Roof_Light_003_1');
        SSVEP_light_2 = scene.getObjectByName('SSVEP_Light').getObjectByName('Roof_Light_003_(1)').getObjectByName('Roof_Light_003_(1)_1');
        door_left = scene.getObjectByName('Static_scene').getObjectByName('First_Room').getObjectByName('Wall').getObjectByName('Wall_2_Doorway_(1)').getObjectByName('Doorway_001').getObjectByName('Door_Left_001');
        door_right = scene.getObjectByName('Static_scene').getObjectByName('First_Room').getObjectByName('Wall').getObjectByName('Wall_2_Doorway_(1)').getObjectByName('Doorway_001').getObjectByName('Door_Right_001');
        console.log(door_left);
        console.log(door_right);
    },
    (xhr) => {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},
    (error) => {
        console.log(error)
    }
)

const geometry1 = new THREE.SphereGeometry(0.05);
let material1 = new THREE.MeshBasicMaterial({color: 0xff0000});
let mesh1 = new THREE.Mesh(geometry1,material1);
mesh1.position.set(3.5,2.25,-3.8);
scene.add(mesh1);

const geometry2 = new THREE.SphereGeometry(0.04);
let material2 = new THREE.MeshBasicMaterial({color: 0xff0000});
let mesh2 = new THREE.Mesh(geometry2,material2);
mesh2.position.set(5,1.83,-2.3);
scene.add(mesh2);

const infoSSVEP = document.createElement('div');
infoSSVEP.style.position = 'absolute';
infoSSVEP.style.bottom = '10px';
infoSSVEP.style.left = '10px';
infoSSVEP.style.color = 'white';
infoSSVEP.style.fontFamily = 'Arial';
infoSSVEP.style.fontSize = '24px';
document.body.appendChild(infoSSVEP);

function updateinfoSSVEP(message){
    infoSSVEP.innerText = message;
}

const infoERD = document.createElement('div');
infoERD.style.position = 'absolute';
infoERD.style.bottom = '10px';
infoERD.style.right = '10px';
infoERD.style.color = 'white';
infoERD.style.fontFamily = 'Arial';
infoERD.style.fontSize = '24px';
document.body.appendChild(infoERD);

function updateinfoERD(message2){
    infoERD.innerText = message2;
}


let pointerPosition = { x: 0, y: 0 };

window.addEventListener('pointermove', (event) => {
    pointerPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointerPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});

const raycaster = new THREE.Raycaster();

const light = new THREE.AmbientLight(0xffffff,1);
scene.add(light);   

const moveButton = document.getElementById('camera_button');
let currentcameraIndex = 0;

moveButton.addEventListener('click', () => {
    currentcameraIndex = (currentcameraIndex + 1) % cameralist.length;
    currentcamera = cameralist[currentcameraIndex];  
})

let blink = 0;
let blink2 = 0;

let door_right_init_x = door_right.position.x;
let door_left_init_x = door_left.position.x;

let message;
let message2;

const animate = () => {
    // Call animate recursively
    requestAnimationFrame(animate);

    controls.update();
    controls1.update();
    controls2.update();

    raycaster.setFromCamera(pointerPosition, camera2);

    const intersect1 = raycaster.intersectObject(mesh1, false);
    const intersect2 = raycaster.intersectObject(mesh2,false);

    if (intersect1.length > 0) {
        mesh1.material.color.set(0x00ff00);
        let increment = clock.getDelta();
        let timer = 0.067;
        if(timer - blink <= 0){
            SSVEP_light_1.color.set(0xffffff);
            blink = 0;
        }
        else{
            SSVEP_light_1.color.set(0x000000);
            blink += increment;
        }
        let timer2 = 0.1;
        if(timer2 - blink2 <= 0){
            SSVEP_light_2.color.set(0xffffff);
            blink2 = 0;
        }
        else{
            SSVEP_light_2.color.set(0x000000);
            blink2 += increment;
        }
        message = 'SSVEP is now Online';
        updateinfoSSVEP(message);
    }
    else{
        mesh1.material.color.set(0xff0000);
        message = 'SSVEP is Offline';
        updateinfoSSVEP(message);
    }

    if(intersect2.length > 0){
        mesh2.material.color.set(0x00ff00);
        if(door_right.position.x > door_right_init_x - 1){
            door_right.position.x -= 0.01;
        }
        if(door_left.position.x < door_left_init_x + 1){
            door_left.position.x += 0.01;
        }
        message2 = 'ERD/ERS are detected, doors are opening';
        updateinfoERD(message2);
    }
    else{
        mesh2.material.color.set(0xff0000);
        if(door_right.position.x < door_right_init_x){
            door_right.position.x += 0.01;
        }
        if(door_left.position.x > door_left_init_x){
            door_left.position.x -= 0.01;
        }
        message2 = 'No ERD/ERS detected';
        updateinfoERD(message2);
    }

    starship.position.x += 0.1;
    // Render the scene
    renderer.render(scene, currentcamera);
}

// Call animate for the first time
animate();

