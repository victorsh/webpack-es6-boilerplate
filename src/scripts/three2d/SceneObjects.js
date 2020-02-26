/* eslint-disable */
import * as THREE from 'three' 
import p2 from 'p2'

import * as Colors from './Colors'

import CaviarDreamFont from '../../fonts/CaviarDreams_Regular.json'
import MargatroidGrotesqueFont from '../../fonts/MargatroidGrotesque.json'

export const setupObjects = (scene) => {
  createLights(scene)
  createEntities(scene)
  createTestMenuItem(scene)
  createTestFont(scene)
}

const createLights = (scene) => {
  // Lights
  // this.lightAmbient = new THREE.AmbientLight(0xFFAFFA, 0.8)
  // this.scene.add(this.lightAmbient)
  let lightDirectional = new THREE.DirectionalLight(Colors.WHITE, 0.7)
  lightDirectional.position.set(1, 0, 1).normalize()
  scene.add(lightDirectional)
}

const createEntities = (scene) => {
  // Objects
  let playerCircle = new THREE.Mesh(
    new THREE.CircleBufferGeometry(0.1, 36),
    new THREE.MeshBasicMaterial({ color: Colors.PLAYER })
  )
  playerCircle.name = 'player'
  playerCircle.position.set(0, 0, 0)
  scene.add(playerCircle)

  let enemyCircle = new THREE.Mesh(
    new THREE.CircleBufferGeometry(0.1, 36),
    new THREE.MeshBasicMaterial({ color: Colors.ENEMY })
  )
  enemyCircle.name = 'enemy'
  enemyCircle.position.set(0, -1, 0)
  scene.add(enemyCircle)

  let plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 2),
    new THREE.MeshBasicMaterial({ color: Colors.OBSTACLE })
  )
  plane.name = 'obstacle'
  plane.position.set(2, 0, 0)
  scene.add(plane)

  let background = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50, 50),
    new THREE.MeshBasicMaterial({ color: Colors.BACKGROUND })
  )
  background.name = 'background'
  background.position.set(0, 0, -1)
  scene.add(background)
}

const createTestMenuItem = (scene) => {
  // Menu Item
  let menuPlay = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(3, 1),
    new THREE.MeshBasicMaterial({ color: Colors.MENU, transparent: true, opacity: 0.7 })
  )
  menuPlay.name = 'playButton'
  menuPlay.position.set(-3, 0, 1)

  let menuLeft = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(0.1, 1),
    new THREE.MeshBasicMaterial({ color: Colors.MENU })
  )
  menuLeft.name = 'playButton'
  menuLeft.position.set(-4.45, 0, 1.01)

  let menuRight = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(0.1, 1),
    new THREE.MeshBasicMaterial({ color: Colors.MENU })
  )
  menuRight.name = 'playButton'
  menuRight.position.set(-1.55, 0, 1.01)

  let menuTop = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(3, 0.1),
    new THREE.MeshBasicMaterial({ color: Colors.MENU })
  )
  menuTop.name = 'playButton'
  menuTop.position.set(-3, 0.45, 1.01)

  let menuBottom = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(3, 0.1),
    new THREE.MeshBasicMaterial({ color: Colors.MENU })
  )
  menuBottom.name = 'playButton'
  menuBottom.position.set(-3, -0.45, 1.01)

  let playFont = new THREE.Font(CaviarDreamFont)
  let playFontText = new THREE.Mesh(
    new THREE.ShapeBufferGeometry(playFont.generateShapes('Play', 0.5)),
    new THREE.MeshBasicMaterial({ color: Colors.BLACK })
  )
  playFontText.name = 'playButton'
  playFontText.position.set(-3.5, -0.25, 1.01)

  let playMenuGroup = new THREE.Group()
  playMenuGroup.add(menuPlay)
  playMenuGroup.add(menuLeft)
  playMenuGroup.add(menuRight)
  playMenuGroup.add(menuTop)
  playMenuGroup.add(menuBottom)
  playMenuGroup.add(playFontText)

  scene.add(playMenuGroup)
}

const createTestFont = (scene) => {
  // Font
  let fonter = new THREE.Font(MargatroidGrotesqueFont)
  let text = new THREE.Mesh(
    new THREE.ShapeBufferGeometry(fonter.generateShapes('hello world!', 1)),
    new THREE.MeshBasicMaterial({ color: Colors.BLACK })
  )
  text.position.set(-1.5, 3, 0)
  scene.add(text)
}