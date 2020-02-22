/* eslint-disable */
import * as THREE from 'three'
import Stats from 'stats-js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

////// https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes_ortho.html
// https://stackoverflow.com/questions/17558085/three-js-orthographic-camera
// https://codepen.io/Jobarbo/pen/zZMwVm?editors=1010

export default class Three2D {
  constructor () {
    this.init()
  }

  init () {
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)

    this.frustumSize = 20
    this.aspect = window.innerWidth / window.innerHeight
    this.dis = 2
  
    this.camera = new THREE.OrthographicCamera
    (
      this.frustumSize * this.aspect/-this.dis,
      this.frustumSize * this.aspect/this.dis,
      this.frustumSize/this.dis,
      this.frustumSize/-this.dis, 1, 1000
    )

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.setupCameraControls()
    
    document.body.appendChild(this.renderer.domElement)

    this.stats = new Stats()
    this.stats.dom.style.width = 'auto';
    this.stats.dom.style.height = 'auto';
    document.body.appendChild(this.stats.dom)
    
		document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false)
		window.addEventListener('resize', this.onWindowResize.bind(this), false)

    this.setupScene()
    this.animate()
  }

  setupScene () {
    this.lightAmbient = new THREE.AmbientLight(0xFFAFFA)
    this.scene.add(this.lightAmbient)

    this.lightDirectional = new THREE.DirectionalLight(0xffffff, 1)
    this.lightDirectional.position.set(1, 1, 1).normalize()
		this.scene.add(this.lightDirectional)

    this.cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshLambertMaterial({ color: 0xff0000 }))
    this.scene.add(this.cube)

    let circle = new THREE.Mesh(new THREE.CircleGeometry(1, 36), new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }))
    circle.position.x = 0
    this.scene.add(circle)

    let plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 2), new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide }))
    plane.position.y = 2
    this.scene.add(plane)

    this.camera.position.z = 10
    this.camera.updateProjectionMatrix()
  }

  setupCameraControls() {
    this.oControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.oControls.enabled = true
    this.oControls.enableRotate = true
    this.oControls.enableZoom = true
    this.oControls.zoomSpeed = 1
    this.oControls.enablePan = true
  
    this.tControls = new TransformControls(this.camera, this.renderer.domElement, this.oControls)
    this.tControls.setMode('translate')
    this.scene.add(this.tControls)
  }

  animate () {
    this.stats.begin()
    requestAnimationFrame(this.animate.bind(this))

    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    this.camera.updateWorldMatrix()

    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.scene.children)

    // if (intersects > 0) {
    //   if (this.INTERSECTED != intersects[0].object) {
    //     //
    //   }
    // } else {
    //   this.INTERSECTED = null
    // }

    this.renderer.render(this.scene, this.camera)
    this.stats.end()
  }

  onWindowResize() {
    console.log('resize')
    this.aspect = window.innerWidth / window.innerHeight

    this.camera.left = -this.frustumSize * this.aspect / this.dis
    this.camera.right = this.frustumSize * this.aspect / this.dis
    this.camera.top = this.frustumSize / this.dis
    this.camera.bottom = -this.frustumSize / this.dis

    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  onDocumentMouseMove(event) {
    event.preventDefault()

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // console.log(this.mouse.x, this.mouse.y)
  }
}