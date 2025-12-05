import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';
import { FontLoader } from 'three/addons/FontLoader.js';
import { TextGeometry } from 'three/addons/TextGeometry.js';
import { Sky } from 'three/addons/Sky.js';
import { RectAreaLightUniformsLib } from 'three/addons/RectAreaLightUniformsLib.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.fog = new THREE.Fog(0xeeeeee, 350, 1500);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 2000);
scene.add(camera);

// RectAreaLight setup
RectAreaLightUniformsLib.init();
const rectLight = new THREE.RectAreaLight(0xffffff, 10, 112.5, 82.5);
rectLight.position.set(0, 136.25, -250);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);

// DirectionalLight setup
const dirLight = new THREE.DirectionalLight(0xfed33c, 10); //0xfed33c
dirLight.position.set(200, 200, -375);
dirLight.castShadow = true;
dirLight.shadow.bias = -0.001;
scene.add(dirLight);

// AmbientLight setup
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

// Shadow area setup
dirLight.shadow.mapSize.set(2048, 2048);
dirLight.shadow.camera.left = -250;
dirLight.shadow.camera.right = 250;
dirLight.shadow.camera.top = 375;
dirLight.shadow.camera.bottom = -125;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 750

// Load manager
const loaderContainer = document.getElementById('loader-container');

const manager = new THREE.LoadingManager();
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  const progress = (itemsLoaded / itemsTotal) * 100;
  document.getElementById("loaded").innerHTML = Math.round(progress) + '%';
  document.getElementById("loadedBorder").style.width = Math.round(progress) * 2 + 'px';

};
manager.onLoad = function () {
  setTimeout(function () {
    loaderContainer.style.display = 'none';
  }, 1000);
};

//Loader
const gltfLoader = new GLTFLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);
const fontLoader = new FontLoader(manager);

// Load the room GLB file
gltfLoader.load(
  './src/model/room.glb',
  function (gltf) {
    const room = gltf.scene;
    room.scale.set(1, 1, 1);

    // Enable shadows for all meshes
    room.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;

        // Some glTF materials need this
        if (obj.material) {
          obj.material.needsUpdate = true;
        }
      }
    });
    scene.add(room);
  }
);

// Flag Plane - Three js
const flagTexture = textureLoader.load('./src/textures/flag.png');
const flagGeometry = new THREE.PlaneGeometry(22.5, 37.5, 9, 15);
const flagMaterial = new THREE.MeshBasicMaterial({ map: flagTexture, side: THREE.DoubleSide });
const flag = new THREE.Mesh(flagGeometry, flagMaterial);
flag.position.set(25, 137.5, -225);
flag.rotation.z = Math.PI / 2;
flag.castShadow = true;
scene.add(flag);

// Flagpole - Three js
const poleGeometry = new THREE.CylinderGeometry(1, 1, 160, 32);
const poleMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const pole = new THREE.Mesh(poleGeometry, poleMaterial);
pole.position.set(5, 70, -225);
pole.castShadow = true;
scene.add(pole);

// My photo poster - Three js
const photoTexture = textureLoader.load('./src/textures/my_photo.png');
const photoGeometry = new THREE.BoxGeometry(66.25, 93.75, 0.5);
const photoMaterial = new THREE.MeshStandardMaterial({ map: photoTexture });
const photo = new THREE.Mesh(photoGeometry, photoMaterial);
photo.position.set(150, 143.75, -50);
photo.rotation.y = -Math.PI / 2;
scene.add(photo);

// Map poster - Three js
const mapTexture = textureLoader.load('./src/textures/map.png');
const mapGeometry = new THREE.BoxGeometry(66.25, 93.75, 0.5);
const mapMaterial = new THREE.MeshStandardMaterial({ map: mapTexture });
const map = new THREE.Mesh(mapGeometry, mapMaterial);
map.position.set(105, 143.75, -174.5);
scene.add(map);

// Create the Institute photo
const pictureTextures = [
  textureLoader.load('src/textures/edu_1.png'),
  textureLoader.load('src/textures/edu_2.png'),
  textureLoader.load('src/textures/edu_3.png')
];

const pictures = [];

for (let i = 0; i < 3; i++) {
  const pictureGeometry = new THREE.BoxGeometry(4, 37.5, 37.5);
  const texturedMat = new THREE.MeshBasicMaterial({ map: pictureTextures[i] });
  const plainMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const pictureMaterial = [
    texturedMat, // front
    plainMat, // right
    plainMat, // left
    plainMat, // top
    plainMat, // bottom 
    plainMat  // back
  ];

  const picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
  picture.position.set(-146.25, 187.5 - (i * 18.75), -25 - (i * 40));
  picture.castShadow = true;
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
  'https://www.facebook.com/forhad.hossain.006',
  'https://www.linkedin.com/in/m-forhad/',
  'http://t.me/mdforhadhossain2004'
];

for (let i = 0; i < 3; i++) {
  const buttonGeometry = new THREE.PlaneGeometry(4.5, 3);
  const buttonMaterial = new THREE.MeshBasicMaterial({ map: buttonTextures[i] });
  const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
  button.position.set(35 - (i * 0.825), 49.125, -136.55 + (i * 3.125));
  button.rotation.set(-Math.PI / 2, 0, -Math.PI / 12);
  scene.add(button);
  buttons.push(button);
}

// Texture for pc

const canvas = document.createElement("canvas");
canvas.width = 910;
canvas.height = 510;

const ctx = canvas.getContext("2d");
ctx.font = "48px Arial";
ctx.textBaseline = "top";
ctx.fillStyle = "white";

const texture = new THREE.CanvasTexture(canvas);

// Text for pc
const fullText = "I am an undergraduate student of Civil Engineering. I build this website just as a hobby.......";
let currentLength = 0;
const lineHeight = 48; // space between lines
const maxWidth = canvas.width - 10; // padding

// Function to split text into lines that fit canvas
function wrapText(text) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  return lines;
}

function drawText() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const visibleText = fullText.substring(0, currentLength);
  const lines = wrapText(visibleText);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 10, 30 + i * lineHeight);
  }

  texture.needsUpdate = true;
}

// PC - Three js
const pcGeometry = new THREE.PlaneGeometry(68.25, 38.25);
const pcMaterial = new THREE.MeshStandardMaterial({ map: texture });
const pcScreen = new THREE.Mesh(pcGeometry, pcMaterial);
pcScreen.position.set(-132.5, 104.75, -64.25);
pcScreen.rotation.y = Math.PI / 2;
pcScreen.castShadow = true;
pcScreen.receiveShadow = true;
scene.add(pcScreen);


// Ground - Three js
const grassTexture = textureLoader.load('./src/textures/grass.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(5, 5);

const groundGeometry = new THREE.PlaneGeometry(1500, 1500);
const groundMaterial = new THREE.MeshBasicMaterial({ map: grassTexture });

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.set(-75, -25, -625);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Tree Line - Three js
const treeLineTexture = textureLoader.load('./src/textures/treeline.png');
treeLineTexture.wrapS = THREE.RepeatWrapping;
treeLineTexture.wrapT = THREE.RepeatWrapping;
treeLineTexture.repeat.set(4, 1);

for (let i = 0; i < 4; i++) {
  const treeGeometry = new THREE.PlaneGeometry(800, 50);
  const treeMaterial = new THREE.MeshBasicMaterial({ map: treeLineTexture, transparent: true });
  const treeLine = new THREE.Mesh(treeGeometry, treeMaterial);
  treeLine.position.set((i % 2) * 37.5, 0, -1000 - (i * 18.75));
  scene.add(treeLine);
}


// Roof - Three js
const roofGeometry = new THREE.PlaneGeometry(325, 375);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.set(0, 240, 0);
roof.rotation.x = Math.PI / 2;
roof.castShadow = true;
scene.add(roof);

// Wall - Three js
const wallGeometry = new THREE.PlaneGeometry(375, 240);
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf73156 });
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.set(150, 120, 0);
wall.rotation.y = -Math.PI / 2;
wall.castShadow = true;
scene.add(wall);

fontLoader.load('./src/fonts/helvetiker_regular.typeface.json', function (font) {
  const texts = ['Hi, I am', 'Md. Forhad Hossain', 'I am from', 'Bangladesh', 'Educational Institute', 'University', 'College', 'High school'];
  const positions = [
    { x: 147.5, y: 205, z: -62.5 },
    { x: 147.5, y: 195, z: -87.5 },
    { x: -30, y: 195, z: -173.75 },
    { x: 1.25, y: 195, z: -173.75 },
    { x: -148.75, y: 211.25, z: -43.75 },
    { x: -148.75, y: 165, z: -18.75 },
    { x: -148.75, y: 146.25, z: -58.75 },
    { x: -148.75, y: 127.5, z: -98.75 }
  ];
  const rotations = [
    { x: 0, y: -Math.PI / 2, z: 0 },
    { x: 0, y: -Math.PI / 2, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: Math.PI / 2, z: 0 },
    { x: 0, y: Math.PI / 2, z: 0 },
    { x: 0, y: Math.PI / 2, z: 0 },
    { x: 0, y: Math.PI / 2, z: 0 }
  ];
  const sizes = [5, 6, 5, 6, 4, 2.5, 2.5, 2.5];
  const depths = [0.5, 1.25, 0.5, 1.25, 0.5, 0.5, 0.5, 0.5]
  const colors = [0xffffff, 0xffffff, 0x222222, 0x46983c, 0xffffff, 0xffffff, 0xffffff, 0xffffff];

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


// Skybox
const sky = new Sky();
sky.scale.setScalar(2000);
scene.add(sky);

const sun = new THREE.Vector3();

const uniforms = sky.material.uniforms;
uniforms['turbidity'].value = 0.1;
uniforms['rayleigh'].value = 0.362;
uniforms['mieCoefficient'].value = 0.045;
uniforms['mieDirectionalG'].value = 0.988;

const parameters = {
  elevation: 5,
  azimuth: 140
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
  new THREE.Vector3(31.25, 187.5, -50),
  new THREE.Vector3(31.25, 143.75, -50),
  new THREE.Vector3(12.5, 143.75, 0),
  new THREE.Vector3(-37.5, 181.25, -64.5),
  new THREE.Vector3(-37.5, 102.5, -64.5),
  new THREE.Vector3(-37.5, 97.5, -64.5),
  new THREE.Vector3(0, 97.5, -64.5),
  new THREE.Vector3(27.5, 75, -135),
  new THREE.Vector3(35, 75, -135),
  new THREE.Vector3(0, 125, 170),
];

const rotations = [
  new THREE.Euler(0, -Math.PI / 2, 0),
  new THREE.Euler(0, -Math.PI / 2, 0),
  new THREE.Euler(0, 0, 0),
  new THREE.Euler(0, Math.PI / 2, 0),
  new THREE.Euler(0, Math.PI / 2, 0),
  new THREE.Euler(0, Math.PI / 2, 0),
  new THREE.Euler(0, Math.PI / 2, 0),
  new THREE.Euler(-Math.PI / 2, 0, 0),
  new THREE.Euler(-Math.PI / 2, 0, 0),
  new THREE.Euler(0, 0, 0),
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

  if (scrollPercent > 25 && scrollPercent < 37) {
    instruction.textContent = "Select one to know details";
  }
  else if (scrollPercent > 37 && scrollPercent < 55) {
    currentLength = Math.floor(fullText.length * ((scrollPercent - 37) / (55 - 37)));
    drawText();
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

const clock = new THREE.Clock();

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);
  const intersectbuttons = raycaster.intersectObjects(buttons);
  const intersectpictures = raycaster.intersectObjects(pictures);
  buttons.forEach(button => {
    button.position.y = 49.25;
  });
  if (intersectbuttons.length > 0) {
    intersectbuttons[0].object.position.y = 49.75;
  }
  pictures.forEach(picture => {
    picture.position.x = -146.25;
  });
  if (intersectpictures.length > 0) {
    intersectpictures[0].object.position.x = -143.75;
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
    const waveX = Math.cos(x * 0.05 + time) * 0.25 * i;
    const waveY = Math.sin(y * 0.05 + time) * 0.25 * i;
    const wave = waveX + waveY;
    positionAttribute.setZ(i, wave);
  }

  positionAttribute.needsUpdate = true;

  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  updateCameraFOV();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const details = [];

details[0] = "<h2>University</h2> <hr> <div class='info'> <div class='image'> <img src='./src/textures/edu_1.png'> </div> <div class='text'> <h3>Rajshahi University of Engineering and Technology, Rajshahi,Bangladesh </h3> <p> Studying <b>BSc.(Eng) in Civil Engineering (CE-23)</b></p></div></div>";
details[1] = "<h2>College</h2> <hr> <div class='info'> <div class='image'> <img src='./src/textures/edu_2.png'> </div> <div class='text'> <h3>St. Josheph's School & College, Bonpara, Natore</h3><p>Passed <b>Higher Secondary Certificate (HSC-23)</b> with <b>GPA 5.00</b> in <b>2023</b></p></div></div>";
details[2] = "<h2>High School</h2> <hr> <div class='info'> <div class='image'> <img src='./src/textures/edu_3.png'> </div> <div class='text'> <h3>Ahmedpur M.H. High School, Boraigram, Natore</h3><p>Passed <b>Secondary School Certificate (SSC-21)</b> with <b>GPA 5.00</b> in <b>2021</b></p></div></div>";
details[3] = "<h2>Credit</h2> <hr> <p><b>3D model: </b><a href='https://skfb.ly/6CGo8'  target='_blank'>Low Poly Room</a> by IsaacTheMaverick is licensed under <a href='http://creativecommons.org/licenses/by/4.0/'  target='_blank'>Creative Commons Attribution</a>.<br><br> Inspired by: <a href='https://mbilalkhan.com/'  target='_blank'>Muhammad Bilal Khan.</a> </p>";

const cardsContainer = document.getElementById("cards-container");

document.getElementById("credit").onclick = function () {
  cardsContainer.style.display = "block";
  document.getElementById("cards").innerHTML = details[3];
}

document.getElementById("close").onclick = function () {
  cardsContainer.style.display = "none";
  document.getElementById("cards").innerHTML = "";
}

cardsContainer.onclick = function () {
  this.style.display = "none";
  document.getElementById("cards").innerHTML = "";

}



