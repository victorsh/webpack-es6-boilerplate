/* eslint-disable */
import * as THREE from 'three'
import Stats from 'stats-js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

import CaviarDreamFont from '../../fonts/CaviarDreams_Regular.json'

import { setupObjects } from './SceneObjects'

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes_ortho.html
// https://stackoverflow.com/questions/17558085/three-js-orthographic-camera
// https://codepen.io/Jobarbo/pen/zZMwVm?editors=1010
// http://www.jeffreythompson.org/collision-detection/circle-rect.php
// https://gero3.github.io/facetype.js/
// https://discoverthreejs.com/tips-and-tricks/

const COLOR_BACKGROUND = 0xA4F4C1
const COLOR_PLAYER = 0x33F333
const COLOR_WHITE = 0xFFFFFF
const COLOR_BLACK = 0x000000

export default class Three2D {
  constructor () {
    this.init()
  }

  init () {
    this.pause = false

    this.startSpeed = 1
    this.playerSpeedUp = this.startSpeed
    this.playerSpeedDown = this.startSpeed
    this.playerSpeedLeft = this.startSpeed
    this.playerSpeedRight = this.startSpeed
    this.playerUp = false
    this.playerDown = false
    this.playerLeft = false
    this.playerRight = false
    this.playerMovePause = false

    this.clock = new THREE.Clock()

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(COLOR_BLACK)

    // Camera Setup
    this.frustumSize = 15
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

    // Setup Renderer
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.autoClear = false
    let pixelRatio = this.renderer.getPixelRatio()
    document.body.appendChild(this.renderer.domElement)

    // Setup Shaders
    this.selectedShader = 'fxaa'
    this.effectComposer = new EffectComposer(this.renderer)
    this.renderPass = new RenderPass(this.scene, this.camera)
    this.effectComposer.addPass(this.renderPass)

    if (this.selectedShader === 'fxaa') {
      // FXAA
      this.fxaaPass = new ShaderPass(FXAAShader)
      this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio)
      this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio)
      this.effectComposer.addPass(this.fxaaPass)
    } else if (this.selectedShader === 'smaa') {
      // SMAA
      this.smaaShader = new SMAAPass(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio)
      this.effectComposer.addPass(this.smaaShader)
    }

    this.stats = new Stats()
    this.stats.dom.style.width = 'auto'
    this.stats.dom.style.height = 'auto'
    document.body.appendChild(this.stats.dom)
    
    this.setupCameraControls()
    this.setupEvents()
    setupObjects(this.scene)
    this.animate()
  }

  animate () {
    this.stats.begin()
    ///

    let delta = this.clock.getDelta()
    requestAnimationFrame(this.animate.bind(this))

    this.playerMovement(delta)

    let player = this.scene.getObjectByName('player')
    let enemy = this.scene.getObjectByName('enemy')
    let obstacle = this.scene.getObjectByName('obstacle')

    if (this.circleCollision(player.position.x, player.position.y, player.geometry.parameters.radius, enemy.position.x, enemy.position.y, enemy.geometry.parameters.radius)) {
      console.log('circle-collision')
    }

    if (this.circleRectangleCollision(
      player.position.x, player.position.y, player.geometry.parameters.radius,
      obstacle.position.x, obstacle.position.y, obstacle.geometry.parameters.width, obstacle.geometry.parameters.height
    )) {
      if(this.playerLeft === true) this.playerLeft = false
      if(this.playerRight === true) this.playerRight = false
      if(this.playerUp === true) this.playerUp = false
      if(this.playerDown === true) this.playerDown = false
    }

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

    // this.renderer.render(this.scene, this.camera)
    this.effectComposer.render()

    ///
    this.stats.end()
  }

  playerMovement(delta) {
    if(this.playerUp) {
      this.scene.getObjectByName('player').position.y += this.playerSpeedUp * delta
    }
    if(this.playerDown) {
      this.scene.getObjectByName('player').position.y -= this.playerSpeedDown * delta
    }
    if(this.playerLeft) {
      this.scene.getObjectByName('player').position.x -= this.playerSpeedLeft * delta
    }
    if(this.playerRight) {
      this.scene.getObjectByName('player').position.x += this.playerSpeedRight * delta
    }
  }

  setupCameraControls() {
    this.oControls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.oControls.enabled = true
    // this.oControls.enableRotate = true
    // this.oControls.enableZoom = true
    // this.oControls.zoomSpeed = 1
    this.oControls.enablePan = true
  
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
    let pixelRatio = this.renderer.getPixelRatio()
    if (this.selectedShader === 'fxaa') {
      this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio)
      this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio)
    } else if (this.selectedShader === 'smaa') {
      this.effectComposer.setSize(window.innerWidth, window.innerHeight)
    }
  }

  /* EVENT LISTENERS */

  setupEvents () {
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), false)
    document.addEventListener('mousedown', this.handleMouseDown.bind(this), false)
    document.addEventListener('keydown', this.handleKeyDown.bind(this), false)
    document.addEventListener('keyup', this.handleKeyUp.bind(this), false)
  }

  removeEvents () {
    window.removeEventListener('resize', this.onWindowResize.bind(this), false)
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this), false)
    document.removeEventListener('mousedown', this.handleMouseDown.bind(this), false)
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

  handleMouseDown(event) {
    event.preventDefault()
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.scene.children, true)
    if (intersects[0].object.name === 'playButton') {
      console.log('Play Button Pressed')
    }
    console.log(intersects)
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

  circleCollision (x1, y1, r1, x2, y2, r2) {
    return (Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2, 2)) < (r1+r2))
  }
  
  rectagleCollision (x1, y1, x2, y2, w1, h1, w2, h2) {
    return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2)
  }

  circleRectangleCollision(cx, cy, r, rx, ry, rw, rh) {
    let circleDistanceX = Math.abs(cx - rx)
    let circleDistanceY = Math.abs(cy - ry)

    if (circleDistanceX > (rw/2 + r)) return false
    if (circleDistanceY > (rh/2 + r)) return false

    if (circleDistanceX <= (rw/2)) return true
    if (circleDistanceY <= (rh/2)) return true

    let cdsq = Math.pow(circleDistanceX - rw/2, 2) + Math.pow(circleDistanceY - rh/2, 2)
    return (cdsq <= Math.pow(r, 2))
  }
}