/* eslint-disable */
import * as THREE from 'three'
import Stats from 'stats-js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import CaviarDreamFont from '../fonts/CaviarDreams_Regular.json'

////// https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes_ortho.html
// https://stackoverflow.com/questions/17558085/three-js-orthographic-camera
// https://codepen.io/Jobarbo/pen/zZMwVm?editors=1010

const COLOR_BACKGROUND = 0xE0E0E0
const COLOR_PLAYER = 0x33F333
const COLOR_BLACK = 0x000000
const COLOR_WHITE = 0xFFFFFF

export default class Three2D {
  constructor () {
    this.init()
  }

  init () {
    this.pause = false

    this.playerSpeed = 1000
    this.playerUp = false
    this.playerDown = false
    this.playerLeft = false
    this.playerRight = false

    this.clock = new THREE.Clock()
    this.delta = 0
    this.interval = 1/60

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(COLOR_BACKGROUND)

    // Camera Setup
    this.setupCamera()

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(this.renderer.domElement)
    
    this.setupStats()
    this.setupCameraControls()
    this.setupEvents()
    this.setupScene()
    this.animate()
  }

  setupScene () {
    this.setupLights()
    this.setupFont()
    this.setupObjects()
  }

  setupEvents () {
		document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false)
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    document.addEventListener('keydown', this.handleKeyDown.bind(this), false)
    document.addEventListener('keyup', this.handleKeyUp.bind(this), false)
  }

  setupCamera () {
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
    this.camera.position.z = 10
    this.camera.updateProjectionMatrix()
  }

  setupFont () {
    this.fontLoader = new THREE.FontLoader()
    let self = this

    let fonter = new THREE.Font(CaviarDreamFont)
    let matMesh = new THREE.MeshBasicMaterial({ color: COLOR_BLACK, side: THREE.DoubleSide})
    let shapes = fonter.generateShapes('hello world!', 1)
    let geom = new THREE.ShapeBufferGeometry(shapes)
    geom.computeBoundingBox()

    let text = new THREE.Mesh(geom, matMesh)

    console.log(text)
    self.scene.add(text)
  }

  setupLights () {
    this.lightAmbient = new THREE.AmbientLight(0xFFAFFA, 0.8)
    this.scene.add(this.lightAmbient)

    this.lightDirectional = new THREE.DirectionalLight(COLOR_WHITE, 0.7)
    this.lightDirectional.position.set(1, 1, 1).normalize()
		this.scene.add(this.lightDirectional)
  }

  setupObjects() {
    this.cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshLambertMaterial({ color: COLOR_PLAYER }))
    this.cube.position.y = -1
    this.scene.add(this.cube)

    let circle = new THREE.Mesh(new THREE.CircleGeometry(1, 36), new THREE.MeshBasicMaterial({ color: COLOR_PLAYER, side: THREE.DoubleSide }))
    circle.name = 'player'
    circle.position.x = -2
    this.scene.add(circle)

    let plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 2), new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide }))
    plane.position.y = 3
    this.scene.add(plane)

    let plane2 = new THREE.Mesh(new THREE.PlaneGeometry(1, 2), new THREE.MeshBasicMaterial({ color: 0x0000a2, side: THREE.DoubleSide }))
    plane2.position.set(1, 3, -1)
    this.scene.add(plane2)
  }

  setupCameraControls() {
    this.oControls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.oControls.enabled = true
    // this.oControls.enableRotate = true
    // this.oControls.enableZoom = true
    // this.oControls.zoomSpeed = 1
    this.oControls.enablePan = false
  
    this.tControls = new TransformControls(this.camera, this.renderer.domElement, this.oControls)
    this.tControls.setMode('translate')
    this.scene.add(this.tControls)
  }

  setupStats () {
    this.stats = new Stats()
    this.stats.dom.style.width = 'auto';
    this.stats.dom.style.height = 'auto';
    document.body.appendChild(this.stats.dom)
  }

  animate () {
    this.stats.begin()
    requestAnimationFrame(this.animate.bind(this))
    this.delta += this.clock.getDelta()
    
    if (this.delta > this.interval && !this.pause) {

      this.cube.rotation.x += 0.01
      this.cube.rotation.y += 0.01

      this.playerMovement()
      
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

      console.log(player.position, enemy.position, obstacle.position)
  
      this.renderer.render(this.scene, this.camera)

      this.delta = this.delta % this.interval
    }


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

  playerMovement(delta) {
    let player = this.scene.getObjectByName('player')
    let enemy = this.scene.getObjectByName('enemy')
    let obstacle = this.scene.getObjectByName('obstacle')

    if(this.playerUp === 1) {
      let nextMove = this.scene.getObjectByName('player').position.y + this.playerSpeedUp * delta

      if (Collisions.circleCollision(
        player.position.x, nextMove, player.geometry.parameters.radius,
        enemy.position.x, enemy.position.y, enemy.geometry.parameters.radius)
      ) {
        // this.scene.getObjectByName('player').position.y = enemy.position.y - (enemy.geometry.parameters.radius + player.geometry.parameters.radius)
      } else if (Collisions.circleRectangleCollision(
        player.position.x, nextMove, player.geometry.parameters.radius,
        obstacle.position.x, obstacle.position.y, obstacle.geometry.parameters.width, obstacle.geometry.parameters.height
      )) {
        // this.scene.getObjectByName('player').position.y = obstacle.position.y - obstacle.geometry.parameters.height/2
      }
      else this.scene.getObjectByName('player').position.y = nextMove
    }
    if(this.playerDown === 1) {
      let nextMove = this.scene.getObjectByName('player').position.y - this.playerSpeedDown * delta

      if (Collisions.circleCollision(
        player.position.x, nextMove, player.geometry.parameters.radius,
        enemy.position.x, enemy.position.y, enemy.geometry.parameters.radius)
      ) {
        // this.scene.getObjectByName('player').position.y = enemy.position.y + (enemy.geometry.parameters.radius + player.geometry.parameters.radius)
      } else if (Collisions.circleRectangleCollision(
        player.position.x, nextMove, player.geometry.parameters.radius,
        obstacle.position.x, obstacle.position.y, obstacle.geometry.parameters.width, obstacle.geometry.parameters.height
      )) {
        this.scene.getObjectByName('player').position.y = obstacle.position.y + obstacle.geometry.parameters.height/2
      }
      else this.scene.getObjectByName('player').position.y = nextMove
    }
    if(this.playerLeft === 1) {
      let nextMove = this.scene.getObjectByName('player').position.x - this.playerSpeedLeft * delta

      if (Collisions.circleCollision(
        nextMove, player.position.y, player.geometry.parameters.radius,
        enemy.position.x, enemy.position.y, enemy.geometry.parameters.radius
      )) {
        // this.scene.getObjectByName('player').position.x = enemy.position.x + (enemy.geometry.parameters.radius + player.geometry.parameters.radius)
      } else if (Collisions.circleRectangleCollision(
        nextMove, player.position.y, player.geometry.parameters.radius,
        obstacle.position.x, obstacle.position.y, obstacle.geometry.parameters.width, obstacle.geometry.parameters.height
      )) {
        // this.scene.getObjectByName('player').position.x = obstacle.position.x + obstacle.geometry.parameters.width/2
      }
      else this.scene.getObjectByName('player').position.x = nextMove
    }
    if(this.playerRight === 1) {
      let nextMove = this.scene.getObjectByName('player').position.x + this.playerSpeedRight * delta

      if (Collisions.circleCollision(
        nextMove, player.position.y, player.geometry.parameters.radius,
        enemy.position.x, enemy.position.y, enemy.geometry.parameters.radius
      )) {
        // this.scene.getObjectByName('player').position.x = enemy.position.x - (enemy.geometry.parameters.radius + player.geometry.parameters.radius)
      } else if (Collisions.circleRectangleCollision(
        nextMove, player.position.y, player.geometry.parameters.radius,
        obstacle.position.x, obstacle.position.y, obstacle.geometry.parameters.width, obstacle.geometry.parameters.height
      )) {
        // this.scene.getObjectByName('player').position.x = obstacle.position.x - obstacle.geometry.parameters.width/2
      }
      else this.scene.getObjectByName('player').position.x = nextMove
    }
  }

  playerMovement() {
    if(this.playerUp) {
      this.scene.getObjectByName('player').position.y += this.playerSpeed * this.clock.getDelta()
    }
    if(this.playerDown) {
      this.scene.getObjectByName('player').position.y -= this.playerSpeed * this.clock.getDelta()
    }
    if(this.playerLeft) {
      this.scene.getObjectByName('player').position.x -= this.playerSpeed * this.clock.getDelta()
    }
    if(this.playerRight) {
      this.scene.getObjectByName('player').position.x += this.playerSpeed * this.clock.getDelta()
    }
  }

  handleKeyDown(event) {
    console.log(event)
    switch(event.code) {
      case 'ArrowUp':
        this.playerUp = true
        break
      case 'ArrowDown':
        this.playerDown = true
        break
      case 'ArrowLeft':
        this.playerLeft = true
        break
      case 'ArrowRight':
        this.playerRight = true
        break
      case 'KeyP':
        this.pause ? this.pause = false : this.pause = true
        break
    }
  }

  handleKeyUp(event) {
    switch(event.code) {
      case 'ArrowUp':
        this.playerUp = false
        break
      case 'ArrowDown':
        this.playerDown = false
        break
      case 'ArrowLeft':
        this.playerLeft = false
        break
      case 'ArrowRight':
        this.playerRight = false
        break
    }
  }
}