import * as THREE from 'three'
import "./style.css"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Load Rick model
const loader = new GLTFLoader();
let rickModel;
let mixer;
let animations = [];
let currentAnimationIndex = 0;

loader.load('/rick_combo.glb', function(gltf) {
    console.log('✅ GLB file loaded successfully!');
    
    rickModel = gltf.scene;
    scene.add(rickModel);
    rickModel.position.set(0, -2, 0);
    
    console.log('📦 Animations found:', gltf.animations.length);
    
    // Set up animations
    mixer = new THREE.AnimationMixer(rickModel);
    animations = gltf.animations;
    
    // Scale up significantly
    rickModel.scale.set(2, 2, 2);
    
    console.log('🎯 Rick model added to scene');
    
    // Play first animation
    if (animations.length > 0) {
        playAnimation(0);
    }
    
}, function(progress) {
    console.log('📥 Loading progress:', (progress.loaded / progress.total * 100) + '%');
}, function(error) {
    console.error('❌ Error loading model:', error);
});

// Function to play animations
function playAnimation(index) {
    if (mixer && animations[index]) {
        currentAnimationIndex = index;
        mixer.stopAllAction();
        const action = mixer.clipAction(animations[index]);
        action.play();
        console.log(`🎭 Now playing animation ${index + 1}`);
    }
}

// Next/Previous functions
function nextAnimation() {
    if (animations.length > 0) {
        const nextIndex = (currentAnimationIndex + 1) % animations.length;
        playAnimation(nextIndex);
    }
}

function previousAnimation() {
    if (animations.length > 0) {
        const prevIndex = (currentAnimationIndex - 1 + animations.length) % animations.length;
        playAnimation(prevIndex);
    }
}


// Setup lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 15);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 4;   
controls.maxDistance = 15;  

// Event listeners
document.getElementById('nextBtn').addEventListener('click', nextAnimation);
document.getElementById('prevBtn').addEventListener('click', previousAnimation);

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    
    controls.update();
    renderer.render(scene, camera);
}
animate();

console.log('🚀 Scene setup complete');