import * as THREE from 'three'
import "./style.css"
import gsap from "gsap" 
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//Scene
const scene = new THREE.Scene(); //a scene is a hierachry of 3D objects
 
//create our sphere
const geometry = new THREE.SphereGeometry( 3, 64, 64 ); //geometry is js shape
const material = new THREE.MeshStandardMaterial({ // material is how it looks like 

    color: "#00ff83",
    roughness: 0.4,

})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
//light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 5, 5)  //x,y,z position
light.intensity = 5
scene.add(light)

//Camera
const camera = new THREE.PerspectiveCamera(75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000)
camera.position.z = 5
scene.add(camera)

//Renderer to make, to load 
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 15

//Resize
window.addEventListener("resize", () => {
    //Update Sizes
    console.log(window.innerWidth)
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    //Update Camera
    camera.updateProjectionMatrix
    camera.aspect = sizes.width / sizes.height
    renderer.setSize(sizes.width, sizes.height)
})

window.addEventListener('resize', () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


const loop = () => {
    //mesh.rotation.x += 0.1
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}
loop()

//timeline magic
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, {z: 0, x: 0, y: 0, }, {z: 1, x: 1, y: 1 })
tl.fromTo("nav", { y: "-100%"}, { y: "0%" })
tl.fromTo(".title", { opacity: 0}, { opacity: 1 })

//Mouse Animation Color
let mouseDown = false
let rgb = []
window. addEventListener( "mousedown", () => (mouseDown = true))
window. addEventListener("mouseup", () => (mouseDown = false))

window. addEventListener("mousemove", (e) => {
    if (mouseDown) {
    rgb = [
        Math.round((e.pageX/sizes.width) * 255),
        Math.round((e.pageY/sizes.height) * 255),
        150, //default for blue
    ]
    //lets animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color,{
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
    })
  }
})