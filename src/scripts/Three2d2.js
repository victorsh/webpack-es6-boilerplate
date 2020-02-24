/* eslint-disable */
import * as THREE from 'three'
import Stats from 'stats-js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import CaviarDreamFont from '../bmt-fonts/CaviarDreams_Regular.json'

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes_ortho.html
// https://stackoverflow.com/questions/17558085/three-js-orthographic-camera
// https://codepen.io/Jobarbo/pen/zZMwVm?editors=1010
// http://www.jeffreythompson.org/collision-detection/circle-rect.php
// https://gero3.github.io/facetype.js/

const COLOR_BACKGROUND = 0xE0E0E0
const COLOR_PLAYER = 0x33F333

export default class Three2D {
  constructor () {
    this.init()
  }

  init () {
    this.pause = false

    this.startSpeed = 10
    this.playerSpeedUp = this.startSpeed
    this.playerSpeedDown = this.startSpeed
    this.playerSpeedLeft = this.startSpeed
    this.playerSpeedRight = this.startSpeed
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
    this.renderer.shadowMap = true

    document.body.appendChild(this.renderer.domElement)

    this.stats = new Stats()
    this.stats.dom.style.width = 'auto';
    this.stats.dom.style.height = 'auto';
    document.body.appendChild(this.stats.dom)
    
    this.setupCameraControls()
    this.setupEvents()
    this.setupScene()
    this.animate()
    console.log(this.scene)
  }

  setupScene () {
    this.setupLights()
    this.setupFont()
    this.setupObjects()
  }

  setupFont () {
    let fonter = new THREE.Font(CaviarDreamFont)
    let matMesh = new THREE.MeshLambertMaterial({ color: 0x000000, side: THREE.DoubleSide})
    let shapes = fonter.generateShapes('hello world!', 1)
    let geom = new THREE.ShapeBufferGeometry(shapes)
    geom.computeBoundingBox()

    let text = new THREE.Mesh(geom, matMesh)
    text.position.set(0, 3, 0)
    this.scene.add(text)
  }

  setupObjects() {
    let playerGeom = new THREE.CircleGeometry(0.1, 36)
    let playerMat = new THREE.MeshBasicMaterial({ color: COLOR_PLAYER, side: THREE.DoubleSide })
    let playerCircle = new THREE.Mesh(playerGeom, playerMat)
    playerCircle.name = 'player'
    playerCircle.position.set(0, 0, 0)
    playerCircle.castShadow = true
    this.scene.add(playerCircle)

    let enemyGeom = new THREE.CircleGeometry(0.1, 36)
    let enemyMat = new THREE.MeshBasicMaterial({ color: 0xF38888, side: THREE.DoubleSide })
    let enemyCircle = new THREE.Mesh(enemyGeom, enemyMat)
    enemyCircle.name = 'enemy'
    enemyCircle.position.set(0, -1, 0)
    enemyCircle.castShadow = true
    this.scene.add(enemyCircle)

    let objGeom = new THREE.PlaneGeometry(1, 2)
    objGeom.computeBoundingBox()
    let objMesh = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide })
    let plane = new THREE.Mesh(objGeom, objMesh)
    plane.name = 'obstacle'
    plane.position.set(-1, 0, 0)
    this.scene.add(plane)

    let backgroundGeom = new THREE.PlaneGeometry(50, 50)
    let backgroundMat = new THREE.MeshBasicMaterial({ color: 0x337788, side: THREE.DoubleSide })
    let background = new THREE.Mesh(backgroundGeom, backgroundMat)
    background.name = 'background'
    background.position.set(0, 0, -1)
    background.receiveShadow = true
    this.scene.add(background)
  }

  animate () {
    this.stats.begin()
    requestAnimationFrame(this.animate.bind(this))
    this.delta += this.clock.getDelta()
    this.playerMovement()
    if (this.delta > this.interval && !this.pause) {
      
      
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

      this.delta = this.delta % this.interval
    }
    this.stats.end()
  }

  setupCamera () {
    this.frustumSize = 10
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

  setupLights () {
    this.lightAmbient = new THREE.AmbientLight(0xFFAFFA, 0.8)
    this.scene.add(this.lightAmbient)

    this.lightDirectional = new THREE.DirectionalLight(0xffffff, 0.7)
    this.lightDirectional.position.set(1, 0, 1).normalize()
    this.lightDirectional.castShadow = true
		this.scene.add(this.lightDirectional)
  }

  playerMovement() {
    if(this.playerUp) {
      this.scene.getObjectByName('player').position.y += this.playerSpeedUp * this.clock.getDelta()
    }
    if(this.playerDown) {
      this.scene.getObjectByName('player').position.y -= this.playerSpeedDown * this.clock.getDelta()
    }
    if(this.playerLeft) {
      this.scene.getObjectByName('player').position.x -= this.playerSpeedLeft * this.clock.getDelta()
    }
    if(this.playerRight) {
      this.scene.getObjectByName('player').position.x += this.playerSpeedRight * this.clock.getDelta()
    }
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

  onWindowResize() {
    this.aspect = window.innerWidth / window.innerHeight

    this.camera.left = -this.frustumSize * this.aspect / this.dis
    this.camera.right = this.frustumSize * this.aspect / this.dis
    this.camera.top = this.frustumSize / this.dis
    this.camera.bottom = -this.frustumSize / this.dis

    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  /* EVENT LISTENERS */

  setupEvents () {
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
		document.addEventListener('mousemove', this.handleMouseMove.bind(this), false)
    document.addEventListener('keydown', this.handleKeyDown.bind(this), false)
    document.addEventListener('keyup', this.handleKeyUp.bind(this), false)
  }

  removeEvents () {
    window.removeEventListener('resize', this.onWindowResize.bind(this), false)
		document.removeEventListener('mousemove', this.handleMouseMove.bind(this), false)
    document.removeEventListener('keydown', this.handleKeyDown.bind(this), false)
    document.removeEventListener('keyup', this.handleKeyUp.bind(this), false)
  }

  /* EVENT INPUTS */

  handleMouseMove(event) {
    event.preventDefault()

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // console.log(this.mouse.x, this.mouse.y)
  }

  handleKeyDown (event) {
    switch (event.code) {
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

  handleKeyUp (event) {
    switch (event.code) {
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

  circleCollision (x1, x2, y1, y2, r1, r2) {
    return (Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2, 2)) < (r1+r2))
  }
  
  rectagleCollision (x1, y1, x2, y2, w1, h1, w2, h2) {
    return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2)
  }

  circleRectangleCollision(cx, cy, r, rx, ry, rw, rh) {
    let testx = cx
    let testy = cy

    if (cx < rx) {
      testx = rx
    } else if (cx > rx + rw) {
      testx = rx + rw
    } else if (cy < ry) {
      testy = ry
    } else if (cy > ry + rh) {
      testy = ry + rh
    }

    let distx = cx - testx
    let disty = cy - testy
    let distance = Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))

    if (distance <= r) {
      return true
    }
    return false
  }
}