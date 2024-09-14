import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CSS2DObject from 'three-addons/examples/jsm/controls/CSS2DObject.js';

let camera, scene, renderer, controls;

init();
animate();

function init() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(screenWidth, screenHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    // Add a simple cube to the scene
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add light to the scene
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Load and add an image to the scene
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/assets/your-image.jpg', (texture) => {
        const imageGeometry = new THREE.PlaneGeometry(2, 2);
        const imageMaterial = new THREE.MeshBasicMaterial({ map: texture });
        const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);
        imageMesh.position.set(0, 1, -3);
        scene.add(imageMesh);
    });

    // Add OrbitControls for camera movement
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Resize handling
    window.addEventListener('resize', onWindowResize);
    
    // Set background color
    scene.background = new THREE.Color(0xcccccc); // Light gray background

    // Create a group for the menu items
    const menuGroup = new THREE.Group();
    menuGroup.position.z = -5; // Move the menu behind the scene
    scene.add(menuGroup);

    // Add menu items (text elements) to the menu group
    const menuItems = [
        { text: 'Item 1', position: new THREE.Vector3(-1, 1, 0) },
        { text: 'Item 2', position: new THREE.Vector3(0, 1, 0) },
        { text: 'Item 3', position: new THREE.Vector3(1, 1, 0) },
    ];

    menuItems.forEach((item) => {
        const textGeometry = new THREE.PlaneGeometry(0.5, 0.3);
        const textMaterial = new CSS2DObject(document.createElement('div'));
        textMaterial.element.textContent = item.text;
        textMaterial.element.style.fontSize = '24px';
        textMaterial.element.style.color = 'black';
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.copy(item.position);
        menuGroup.add(textMesh);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
}