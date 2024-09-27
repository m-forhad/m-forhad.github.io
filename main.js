import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';
import { FontLoader } from 'three/addons/FontLoader.js';
import { TextGeometry } from 'three/addons/TextGeometry.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/CSS3DRenderer.js';
import { Sky } from 'three/addons/Sky.js';
import { RectAreaLightUniformsLib } from 'three/addons/RectAreaLightUniformsLib.js';

// Scene setup
const scene = new THREE.Scene();
const sceneCSS = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('css3d-container').appendChild(cssRenderer.domElement);

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 5000);
scene.add(camera);

// RectAreaLight setup
RectAreaLightUniformsLib.init();
const rectLight = new THREE.RectAreaLight(0xffffff, 15, 450, 330);
rectLight.position.set(0, 545, -775);
rectLight.lookAt(0, 545, 0);
scene.add(rectLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.75);
dirLight.position.set(-60, 50, 60);
scene.add(dirLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const loaderContainer = document.getElementById('loader-container');
const loaderPercent = document.getElementById('percent');

const manager = new THREE.LoadingManager();
manager.onProgress = function(url, itemsLoaded, itemsTotal) {
  const progress = (itemsLoaded / itemsTotal) * 100;
  loaderPercent.textContent = Math.floor(progress) + '%';
};
manager.onLoad = function() {
  loaderContainer.style.display = 'none';
};

//Loader
const gltfLoader = new GLTFLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);
const fontLoader = new FontLoader(manager);

// Load the room GLB file
gltfLoader.load(
  './src/model/room.glb',
  function(gltf) {
    const room = gltf.scene;
    room.scale.set(4, 4, 4);
    scene.add(room);
  }
);

// Flag Plane - Three js
const flagTexture = textureLoader.load('./src/textures/flag.png');
const flagGeometry = new THREE.PlaneGeometry(90, 150, 9, 15);
const flagMaterial = new THREE.MeshStandardMaterial({ map: flagTexture, side: THREE.DoubleSide });
const flag = new THREE.Mesh(flagGeometry, flagMaterial);
flag.position.set(0, 550, -1500);
flag.rotation.z = Math.PI / 2;
scene.add(flag);

// Flagpole - Three js
const poleGeometry = new THREE.CylinderGeometry(3, 3, 650, 32);
const poleMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const pole = new THREE.Mesh(poleGeometry, poleMaterial);
pole.position.set(-80, 280, -1500);
scene.add(pole);

// My photo poster - Three js
const posterTexture = textureLoader.load('./src/textures/my_photo.png');
const posterGeometry = new THREE.BoxGeometry(265, 375, 2);
const posterMaterial = new THREE.MeshStandardMaterial({ map: posterTexture });
const poster = new THREE.Mesh(posterGeometry, posterMaterial);
poster.position.set(420, 575, -698);
scene.add(poster);

// Create the Institute photo
const pictureTextures = [
                      textureLoader.load('src/textures/edu_1.png'),
                      textureLoader.load('src/textures/edu_2.png'),
                      textureLoader.load('src/textures/edu_3.png')
                     ];

const pictures = [];

for (let i = 0; i < 3; i++) {
  const pictureGeometry = new THREE.BoxGeometry(15, 150, 150);
  const pictureMaterial = new THREE.MeshStandardMaterial({ map: pictureTextures[i] });
  const picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
  picture.position.set(-575, 750 - (i * 75), -100 - (i * 160));
  scene.add(picture);
  pictures.push(picture);
}

const buttons = [];
const buttonTextures = [
                      textureLoader.load('src/textures/facebook.png'),
                      textureLoader.load('src/textures/linkedin.png'),
                      textureLoader.load('src/textures/telegram.png')
                     ];
const links = [
             'https://www.facebook.com/forhad.2004',
             'https://www.linkedin.com/in/md-forhad-hossain-1a55a42ba',
             'http://t.me/mdforhadhossain2004'
              ];

for (let i = 0; i < 3; i++) {
  const buttonGeometry = new THREE.PlaneGeometry(18, 12);
  const buttonMaterial = new THREE.MeshBasicMaterial({ map: buttonTextures[i], side: THREE.DoubleSide });
  const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
  button.position.set(140 - (i * 3.3), 196.5, -546.2 + (i * 12.5));
  button.rotation.set(-Math.PI / 2, 0, -Math.PI / 12);
  scene.add(button);
  buttons.push(button);
}

// Ground - Three js
const grassTexture = textureLoader.load('./src/textures/grass.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(14, 8);

const groundGeometry = new THREE.PlaneGeometry(7000, 4000);
const groundMaterial = new THREE.MeshBasicMaterial({ map: grassTexture, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.set(-500, -100, -2000);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Tree Line - Three js
const treeLineTexture = textureLoader.load('./src/textures/treeline.png');
treeLineTexture.wrapS = THREE.RepeatWrapping;
treeLineTexture.wrapT = THREE.RepeatWrapping;
treeLineTexture.repeat.set(4, 1);

for (let i = 0; i < 2; i++) {
  const treeGeometry = new THREE.PlaneGeometry(6400, 400);
  const treeMaterial = new THREE.MeshBasicMaterial({ map: treeLineTexture, transparent: true });
  const treeLine = new THREE.Mesh(treeGeometry, treeMaterial);
  treeLine.position.set((i % 2) * 150, 300, -2200 - (i * 175));
  scene.add(treeLine);
}

// Roof - Three js
const roofGeometry = new THREE.PlaneGeometry(1300, 1500);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, side: THREE.DoubleSide });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.set(0, 960, 0);
roof.rotation.x = Math.PI / 2;
scene.add(roof);

// Wall - Three js
const wallGeometry = new THREE.PlaneGeometry(1500, 960);
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf73156, side: THREE.DoubleSide });
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.set(600, 480, 0);
wall.rotation.y = -Math.PI / 2;
scene.add(wall);

fontLoader.load('./src/fonts/helvetiker_regular.typeface.json', function(font) {
  const texts = ['Hi, I am', 'Md. Forhad Hossain', 'I am from', 'Bangladesh', 'Educational Institute', 'University', 'College', 'High school'];
  const positions = [
    { x: 360, y: 820, z: -695 },
    { x: 280, y: 780, z: -695 },
    { x: -100, y: 100, z: -1600 },
    { x: 120, y: 100, z: -1600 },
    { x: -595, y: 845, z: -175 },
    { x: -595, y: 660, z: -75 },
    { x: -595, y: 585, z: -235 },
    { x: -595, y: 510, z: -395 }
    ];
  const rotations = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: Math.PI / 2, z: 0 },
    { x: 0, y: Math.PI / 2, z: 0 },
    { x: 0, y: Math.PI / 2, z: 0 },
    { x: 0, y: Math.PI / 2, z: 0 }
    ];
  const sizes = [20, 25, 35, 45, 15, 10, 10, 10];
  const depths = [2, 10, 2, 10, 2, 2, 2, 2]
  const colors = [0xffffff, 0xffffff, 0x222222, 0xff0000, 0xffffff, 0xffffff, 0xffffff, 0xffffff];

  texts.forEach((text, index) => {
    const geometry = new TextGeometry(text, {
      font: font,
      size: sizes[index],
      depth: depths[index],
    });
    const material = new THREE.MeshStandardMaterial({ color: colors[index] });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(positions[index].x, positions[index].y, positions[index].z);
    mesh.rotation.set(rotations[index].x, rotations[index].y, rotations[index].z);
    scene.add(mesh);
  });
});

// CSS3D Object - PC
const element = document.createElement('div');
element.className = 'pc';
element.innerHTML = '<h3>I am not a professional Web Developer. I build this website just as a hobby.</h3>';
const pcDisplay = new CSS3DObject(element);
pcDisplay.position.set(-530, 419, -257);
pcDisplay.rotation.y = Math.PI / 2;
sceneCSS.add(pcDisplay);

// Skybox
const sky = new Sky();
sky.scale.setScalar(10000);
scene.add(sky);

const sun = new THREE.Vector3();

const uniforms = sky.material.uniforms;
uniforms['turbidity'].value = 0.1;
uniforms['rayleigh'].value = 0.362;
uniforms['mieCoefficient'].value = 0.045;
uniforms['mieDirectionalG'].value = 0.988;

const parameters = {
  elevation: 25,
  azimuth: 170
};

function updateSun() {
  const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
  const theta = THREE.MathUtils.degToRad(parameters.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms['sunPosition'].value.copy(sun);
}

updateSun();

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
  raycaster.setFromCamera(mouse, camera);
  const intersectbuttons = raycaster.intersectObjects(buttons);
  const intersectpictures = raycaster.intersectObjects(pictures);

  if (intersectbuttons.length > 0) {
    const i = buttons.indexOf(intersectbuttons[0].object);
    if (i !== -1) {
      window.open(links[i], '_blank');
    }
  }

  if (intersectpictures.length > 0) {
    const i = pictures.indexOf(intersectpictures[0].object);
    if (i !== -1) {
      document.getElementById("cards-container").style.display = "block";
      document.getElementById("cards").innerHTML = details[i];
    }
  }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);

// Define camera positions and rotations
const positions = [
      new THREE.Vector3(425, 750, -200),
      new THREE.Vector3(425, 575, -200),
      new THREE.Vector3(120, 500, -700),
      new THREE.Vector3(-150, 725, -258),
      new THREE.Vector3(-150, 410, -258),
      new THREE.Vector3(-150, 390, -258),
      new THREE.Vector3(110, 300, -540),
      new THREE.Vector3(140, 300, -540),
      new THREE.Vector3(580, 500, 680),
    ];

const rotations = [
      new THREE.Euler(0, 0, 0),
      new THREE.Euler(0, 0, 0),
      new THREE.Euler(-Math.PI / 20, 0, 0),
      new THREE.Euler(0, Math.PI / 2, 0),
      new THREE.Euler(0, Math.PI / 2, 0),
      new THREE.Euler(0, Math.PI / 2, 0),
      new THREE.Euler(-Math.PI / 2, 0, 0),
      new THREE.Euler(-Math.PI / 2, 0, 0),
      new THREE.Euler(0, Math.PI / 4, 0),
    ];

// Convert Euler rotations to Quaternions
const quaternions = rotations.map(rotation => new THREE.Quaternion().setFromEuler(rotation));

// Track scroll percentage
let scrollPosition = 0, scrollTop = 0, docHeight = 0;
const instruction = document.getElementById("text");

window.addEventListener('scroll', () => {
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollPosition = scrollTop / docHeight;

  if (scrollTop >= docHeight - 1) {
    window.scrollTo(0, 1);
  }

  const scrollPercent = Math.floor(scrollPosition * 100);

  if (scrollPercent > 30 && scrollPercent < 40) {
    instruction.textContent = "Select one to know details";
  }
  else if (scrollPercent > 67 && scrollPercent < 77) {
    instruction.textContent = "Use this mobile to contact with me";
  }
  else { instruction.textContent = "Scroll to Explore"; }
});

function updateCameraFOV() {
  const width = window.innerWidth;
  if (width >= 768) {
    camera.fov = 45;
  }
  else {
    camera.fov = 75;
  }

  camera.updateProjectionMatrix();
}
updateCameraFOV();

// Flag geomatry attribute
const positionAttribute = flagGeometry.attributes.position;
const vertexCount = positionAttribute.count;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);
  const intersectbuttons = raycaster.intersectObjects(buttons);
  const intersectpictures = raycaster.intersectObjects(pictures);
  buttons.forEach(button => {
    button.position.y = 197;
  });
  if (intersectbuttons.length > 0) {
    intersectbuttons[0].object.position.y = 199;
  }
  pictures.forEach(picture => {
    picture.position.x = -585;
  });
  if (intersectpictures.length > 0) {
    intersectpictures[0].object.position.x = -570;
  }


  const totalSegments = positions.length;
  const segment = Math.floor(scrollPosition * totalSegments); // 0, 1, 2, or 3
  const segmentPercent = (scrollPosition * totalSegments) - segment; // Percentage within the segment (0 to 1)
  const nextSegment = (segment + 1) % totalSegments;
  camera.position.lerpVectors(positions[segment], positions[nextSegment], segmentPercent);
  camera.quaternion.slerpQuaternions(quaternions[segment], quaternions[nextSegment], segmentPercent);

  const time = Date.now() * 0.005;

  for (let i = 0; i < vertexCount; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const waveX = Math.cos(x * 0.05 + time) * 0.5 * i;
    const waveY = Math.sin(y * 0.05 + time) * 0.5 * i;
    const wave = waveX + waveY;
    positionAttribute.setZ(i, wave);
  }

  positionAttribute.needsUpdate = true;

  renderer.render(scene, camera);
  cssRenderer.render(sceneCSS, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  updateCameraFOV();
  renderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
});

const details = [];

details[0] = "<h2>University</h2> <hr> <div class='info'> <div class='image'> <img src='./src/textures/edu_1.png'> </div> <div class='text'> <h3>Rajshahi University of Engineering and Technology, Rajshahi,Bangladesh </h3> <p> Studying <b>BSc.(Eng) in Civil Engineering (CE-23)</b></p></div></div>";
details[1] = "<h2>College</h2> <hr> <div class='info'> <div class='image'> <img src='./src/textures/edu_2.png'> </div> <div class='text'> <h3>St. Josheph's School & College, Bonpara, Natore</h3><p>Passed <b>Higher Secondary Certificate (HSC-23)</b> with <b>GPA 5.00</b> in <b>2023</b></p></div></div>";
details[2] = "<h2>High School</h2> <hr> <div class='info'> <div class='image'> <img src='./src/textures/edu_3.png'> </div> <div class='text'> <h3>Ahmedpur M.H. High School, Boraigram, Natore</h3><p>Passed <b>Secondary School Certificate (SSC-21)</b> with <b>GPA 5.00</b> in <b>2021</b></p></div></div>";
details[3] = "<h2>Credit</h2> <hr> <p><b>3D model: </b><a href='https://skfb.ly/6CGo8'  target='_blank'>Low Poly Room</a> by IsaacTheMaverick is licensed under <a href='http://creativecommons.org/licenses/by/4.0/'  target='_blank'>Creative Commons Attribution</a>.<br><br> Inspired by: <a href='https://mbilalkhan.com/'  target='_blank'>Muhammad Bilal Khan.</a> </p>";

const cardsContainer = document.getElementById("cards-container");

document.getElementById("credit").onclick = function() {
  cardsContainer.style.display = "block";
  document.getElementById("cards").innerHTML = details[3];
}

document.getElementById("close").onclick = function() {
  cardsContainer.style.display = "none";
  document.getElementById("cards").innerHTML = "";
}

cardsContainer.onclick = function() {
  this.style.display = "none";
  document.getElementById("cards").innerHTML = "";
}