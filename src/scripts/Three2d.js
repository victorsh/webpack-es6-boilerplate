/* eslint-disable */
import * as THREE from 'three'

////// https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes_ortho.html

export default class Three2D {
  constructor () {
    this.init()
  }

  init () {
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / -2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000)

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    this.setupScene()
    this.animate()
  }

  setupScene () {
    this.lightAmbient = new THREE.AmbientLight(0xFFAFFA)
    this.scene.add(this.lightAmbient)

    this.cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshLambertMaterial({ color: 0xff0000 }))
    this.scene.add(this.cube)

    this.camera.position.z = 5
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this))

    this.cube.rotation.x += 0.1
    this.cube.rotation.y += 0.1

    this.renderer.render(this.scene, this.camera)
  }
}