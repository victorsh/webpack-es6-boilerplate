/* eslint-disable */
import * as THREE from 'three'
import Stats from 'stats-js'

////// https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes_ortho.html
// https://stackoverflow.com/questions/17558085/three-js-orthographic-camera
// https://codepen.io/Jobarbo/pen/zZMwVm?editors=1010

export default class Three2D {
  constructor () {
    this.init()
  }

  init () {
    this.mouse = new THREE.Vector2(), this.INTERSECTED
    this.frustumSize = 1000
    this.aspect = window.innerWidth / window.innerHeight
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)
    this.camera = new THREE.OrthographicCamera(
      window.innerWidth / - 50, window.innerWidth / 50, window.innerHeight / 50, window.innerHeight / -50, 1, 1000 
    )

    this.raycaster = new THREE.Raycaster()

    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    
    this.stats = new Stats()
    document.body.appendChild(this.renderer.domElement)
    // document.body.appendChild(this.stats.dom)

		// document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false)
		window.addEventListener('resize', this.onWindowResize.bind(this), false)

    this.setupScene()
    this.animate()
  }

  setupScene () {
    // this.lightAmbient = new THREE.AmbientLight(0xFFAFFA)
    // this.scene.add(this.lightAmbient)

    this.lightDirectional = new THREE.DirectionalLight(0xffffff, 1)
    this.lightDirectional.position.set(1, 1, 1).normalize()
		this.scene.add(this.lightDirectional)

    this.cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshLambertMaterial({ color: 0xff0000 }))
    this.scene.add(this.cube)

    this.camera.position.z = 50
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this))

    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    this.camera.updateWorldMatrix()
    this.camera.updateProjectionMatrix()
    // this.raycaster.setFromCamera(this.mouse, this.camera)
    // let intersects = this.raycaster.intersectObjects(this.scene.children)
    // if (intersects > 0) {
    //   if (this.INTERSECTED != intersects[0].object) {
    //     //
    //   }
    // } else {
    //   this.INTERSECTED = null
    // }

    this.renderer.render(this.scene, this.camera)
    this.stats.update()
  }

  onWindowResize() {
    this.aspect = window.innerWidth / window.innerHeight

    this.camera.left = -this.frustumSize * aspect / 2
    this.camera.right = this.frustumSize * aspect / 2
    this.camera.top = this.frustumSize / 2
    this.camera.bottom = -this.frustumSize / 2

    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  onDocumentMouseMove(event) {
    event.preventDefault()

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  }
}