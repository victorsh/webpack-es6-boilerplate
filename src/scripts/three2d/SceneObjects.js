/* eslint-disable */
import * as THREE from 'three' 
import CaviarDreamFont from '../../fonts/CaviarDreams_Regular.json'
import MargatroidGrotesqueFont from '../../fonts/MargatroidGrotesque.json'

const COLOR_BACKGROUND = 0xE7F4E7
const COLOR_PLAYER = 0x77F577
const COLOR_ENEMY = 0xF57777
const COLOR_OBSTACLE = 0x7777F5
const COLOR_WHITE = 0xFFFFFF
const COLOR_BLACK = 0x000000
const COLOR_MENU = 0xE3E3E3

export const setupObjects = (scene) => {
  // Lights
  // this.lightAmbient = new THREE.AmbientLight(0xFFAFFA, 0.8)
  // this.scene.add(this.lightAmbient)
  let lightDirectional = new THREE.DirectionalLight(0xffffff, 0.7)
  lightDirectional.position.set(1, 0, 1).normalize()
  scene.add(lightDirectional)

  // Font
  let fonter = new THREE.Font(MargatroidGrotesqueFont)
  let text = new THREE.Mesh(
    new THREE.ShapeBufferGeometry(fonter.generateShapes('hello world!', 1)),
    new THREE.MeshBasicMaterial({ color: COLOR_BLACK })
  )
  text.position.set(-1.5, 3, 0)
  scene.add(text)

  // Menu Item
  let menuPlay = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(3, 1),
    new THREE.MeshBasicMaterial({ color: COLOR_MENU, transparent: true, opacity: 0.7 })
  )
  menuPlay.name = 'playButton'
  menuPlay.position.set(-3, 0, 1)

  let menuLeft = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(0.1, 1),
    new THREE.MeshBasicMaterial({ color: COLOR_MENU })
  )
  menuLeft.name = 'playButton'
  menuLeft.position.set(-4.45, 0, 1.01)

  let menuRight = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(0.1, 1),
    new THREE.MeshBasicMaterial({ color: COLOR_MENU })
  )
  menuRight.name = 'playButton'
  menuRight.position.set(-1.55, 0, 1.01)

  let menuTop = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(3, 0.1),
    new THREE.MeshBasicMaterial({ color: COLOR_MENU })
  )
  menuTop.name = 'playButton'
  menuTop.position.set(-3, 0.45, 1.01)

  let menuBottom = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(3, 0.1),
    new THREE.MeshBasicMaterial({ color: COLOR_MENU })
  )
  menuBottom.name = 'playButton'
  menuBottom.position.set(-3, -0.45, 1.01)

  let playFont = new THREE.Font(CaviarDreamFont)
  let playFontText = new THREE.Mesh(
    new THREE.ShapeBufferGeometry(playFont.generateShapes('Play', 0.5)),
    new THREE.MeshBasicMaterial({ color: COLOR_BLACK })
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

  // Objects
  let playerCircle = new THREE.Mesh(
    new THREE.CircleBufferGeometry(0.1, 36),
    new THREE.MeshBasicMaterial({ color: COLOR_PLAYER })
  )
  playerCircle.name = 'player'
  playerCircle.position.set(0, 0, 0)
  scene.add(playerCircle)

  let enemyCircle = new THREE.Mesh(
    new THREE.CircleBufferGeometry(0.1, 36),
    new THREE.MeshBasicMaterial({ color: COLOR_ENEMY })
  )
  enemyCircle.name = 'enemy'
  enemyCircle.position.set(0, -1, 0)
  scene.add(enemyCircle)

  let plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 2),
    new THREE.MeshBasicMaterial({ color: COLOR_OBSTACLE })
  )
  plane.name = 'obstacle'
  plane.position.set(2, 0, 0)
  scene.add(plane)

  let background = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50, 50),
    new THREE.MeshBasicMaterial({ color: COLOR_BACKGROUND })
  )
  background.name = 'background'
  background.position.set(0, 0, -1)
  scene.add(background)
}