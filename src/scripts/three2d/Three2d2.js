/* eslint-disable */
import * as THREE from 'three'
import Stats from 'stats-js'
import p2 from 'p2'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

import { setupObjects } from './SceneObjects'

import * as Colors from './Colors'

export default class Three2D {
  constructor () {
    this.init()
  }

  init () {
    this.pause = false

    this.clock = new THREE.Clock()

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(Colors.BLACK)

    // Camera Setup
    this.frustumSize = 15
    let aspect = window.innerWidth / window.innerHeight
    this.dis = 2
    this.followPlayer = true
    this.camera = new THREE.OrthographicCamera
    (
      -this.frustumSize * aspect / this.dis,
      this.frustumSize * aspect / this.dis,
      this.frustumSize / this.dis,
      -this.frustumSize / this.dis,
      1, 1000
    )
    this.camera.position.z = 10
    this.camera.updateProjectionMatrix()

    // Setup Renderer
    this.selectedShader = 'fxaa'
    if (this.selectedShader === 'default') {
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
    } else {
      this.renderer = new THREE.WebGLRenderer()
    }
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.autoClear = false
    let pixelRatio = this.renderer.getPixelRatio()
    document.body.appendChild(this.renderer.domElement)

    // Setup Shaders
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
    
    // Create p2.js Physics
    this.world = new p2.World({
      gravity: [0, 0]
    })

    // Player Init
    this.player = {}
    this.enemies = []
    this.walls = []

    this.world.on('postStep', this.handlePostStep.bind(this))
    this.world.on('beginContact', (evt) => {
      console.log(evt)
    })
    this.world.on('preSolve', (evt) => {
      // console.log(evt)
    })
    this.world.on('endContact', (evt) => {
      console.log(evt)
    })

    // Add Audio
    // this.listener = new THREE.AudioListener()
    // this.camera.add(this.listener)
    // this.sound = new THREE.Audio(this.listener)

    // this.audioLoader = new THREE.AudioLoader()
    // this.audioLoader.load('https://localhost:8080/audio/game-sound.mp3', (buffer) => {
    //   this.sound.setBuffer(buffer)
    //   this.sound.setLoop(false)
    //   this.sound.setVolume(0.5)
    // })

    this.setupCameraControls()
    this.setupEvents()
    setupObjects(this.scene, this.player, this.enemies, this.walls,  this.world)
    // Run
    this.animate()
  }

  handlePostStep () {
    if (!this.pause) {

      let vx = this.player.speed * (this.player.direction[1] - this.player.direction[3])
      let vy = this.player.speed * (this.player.direction[0] - this.player.direction[2])

      if (vx !== 0 && vy !== 0) {
        let vxy = Math.sqrt(vx*vx + vy*vy)
        vx = (this.player.direction[1] - this.player.direction[3]) * vxy / 2
        vy = (this.player.direction[0]- this.player.direction[2]) * vxy / 2
      }

      if (this.player.direction[0] === 1) { // UP
        if (this.player.acceleration[1] < 4) {
          this.player.acceleration[1] += 0.1
        }
      } else if (this.player.direction[2] === 1) { // Down
        if (this.player.acceleration[1] > -4) {
          this.player.acceleration[1] -= 0.1
        }
      } else if (this.player.acceleration[1] > 0.09) {
        this.player.acceleration[1] -= 0.05
      } else if (this.player.acceleration[1] < -.09) {
        this.player.acceleration[1] += 0.05
      } else {
        this.player.acceleration[1] = 0
      }

      if (this.player.direction[1] === 1) { // Right
        if (this.player.acceleration[0] < 4) {
          this.player.acceleration[0] += 0.1
        }
      } else if (this.player.direction[3] === 1) { // Left
        if (this.player.acceleration[0] > -4) {
          this.player.acceleration[0] -= 0.1
        }
      } else if (this.player.acceleration[0] > 0.09) {
        this.player.acceleration[0] -= 0.05
      } else if (this.player.acceleration[0] < -0.09) {
        this.player.acceleration[0] += 0.05
      } else {
        this.player.acceleration[0] = 0
      }

      // console.log(this.player.acceleration)

      this.player.body.velocity = [vx + this.player.acceleration[0], vy + this.player.acceleration[1]]

      for (let i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i].followPlayer) {
          const dx = this.player.body.position[0] - this.enemies[i].body.position[0]
          const dy = this.player.body.position[1] - this.enemies[i].body.position[1]
          const adx = Math.abs(dx)
          const ady = Math.abs(dy)
          const evx = dx / (adx + ady)
          const evy = dy / (adx + ady)
          this.enemies[0].body.velocity = [evx, evy]
        }
      }
    }
  }

  animate () {
    this.stats.begin()
    ///
    requestAnimationFrame(this.animate.bind(this))

    if (!this.pause) {
      let delta = this.clock.getDelta()
      this.world.step(1/60, delta, 5)
      this.scene.getObjectByName('player').position.set(this.player.body.position[0], this.player.body.position[1], 0)
      this.scene.getObjectByName('enemy-0').position.set(this.enemies[0].body.position[0], this.enemies[0].body.position[1], 0)

      if (this.followPlayer) this.camera.position.set(this.player.body.position[0], this.player.body.position[1], 10)
      this.camera.updateWorldMatrix()

      if (this.selectedShader === 'default') {
        this.renderer.render(this.scene, this.camera)
      } else {
        this.effectComposer.render()
      }
    }
    ///
    this.stats.end()
  }

  setupCameraControls() {
    this.oControls = new OrbitControls(this.camera, this.renderer.domElement)
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
    let aspect = window.innerWidth / window.innerHeight
    this.camera.left = -this.frustumSize * aspect / this.dis
    this.camera.right = this.frustumSize * aspect / this.dis
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
    document.addEventListener('mouseup', this.handleMouseUp.bind(this), false)
    document.addEventListener('keydown', this.handleKeyDown.bind(this), false)
    document.addEventListener('keyup', this.handleKeyUp.bind(this), false)
  }

  removeEvents () {
    window.removeEventListener('resize', this.onWindowResize.bind(this), false)
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this), false)
    document.removeEventListener('mousedown', this.handleMouseDown.bind(this), false)
    document.removeEventListener('mouseup', this.handleMouseUp.bind(this), false)
    document.removeEventListener('keydown', this.handleKeyDown.bind(this), false)
    document.removeEventListener('keyup', this.handleKeyUp.bind(this), false)
  }

  /* EVENT INPUTS */

  handleMouseMove (event) {
    event.preventDefault()
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    // console.log(this.mouse.x, this.mouse.y)

    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.scene.children, true)

    if(intersects.length > 0) {
      if (intersects[0].object.name === 'playButton') {
      this.scene.getObjectByName('playButton').material.color = new THREE.Color(0xFFAA11)
        console.log('Play Button Hover')
      } else {
        this.scene.getObjectByName('playButton').material.color = new THREE.Color(Colors.MENU)
      }
    }
  }

  handleMouseDown (event) {
    event.preventDefault()
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.scene.children, true)

    if (intersects[0].object.name === 'playButton') {
      this.playButtonPressed = true
      console.log('Play Button Pressed')
    }

    console.log(intersects)
  }

  handleMouseUp (event) {
    event.preventDefault()
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.scene.children, true)

    if (intersects[0].object.name === 'playButton' && this.playButtonPressed) {
      this.playButtonPressed = false
      console.log('Play Button Released')
    }
  }

  handleKeyDown (event) {
    switch (event.code) {
      case 'ArrowUp': this.player.direction[0] = 1
        break
      case 'ArrowRight': this.player.direction[1] = 1
        break
      case 'ArrowDown': this.player.direction[2] = 1
        break
      case 'ArrowLeft': this.player.direction[3] = 1
        break
      case 'KeyP': this.pause ? this.pause = false : this.pause = true
        break
    }
  }

  handleKeyUp (event) {
    switch (event.code) {
      case 'ArrowUp': this.player.direction[0] = 0
        break
      case 'ArrowRight': this.player.direction[1] = 0
        break
      case 'ArrowDown': this.player.direction[2] = 0
        break
      case 'ArrowLeft': this.player.direction[3] = 0
        break
    }
  }
}