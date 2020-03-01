/* eslint-disable */
import * as THREE from 'three' 
import p2 from 'p2'

import * as Colors from './Colors'

import CaviarDreamFont from '../../fonts/CaviarDreams_Regular.json'
import MargatroidGrotesqueFont from '../../fonts/MargatroidGrotesque.json'

export const setupObjects = (scene, player, enemies, walls, world) => {
  createLights(scene)
  createBackground(scene, player, world)
  createPlayer(scene, player, world)
  createEnemies(scene, enemies, world)
  createWalls(scene, walls, world)
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

const createBackground = (scene) => {
  let background = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50, 50),
    new THREE.MeshBasicMaterial({ color: Colors.BACKGROUND })
  )
  background.name = 'background'
  background.position.set(0, 0, -1)
  scene.add(background)
}

const createWalls = (scene, walls, world) => {
  let wallPositions = [[-5, 0, 0], [5, 0, 0], [0, 5, 0], [0, -5, 0], [2, 0, 0]]
  for (let i = 0; i < wallPositions.length; i++) {
    let wall = {}
    wall.body = new p2.Body({ position: [wallPositions[i][0], wallPositions[i][1]]})
    wall.body.addShape(new p2.Box({ width: 1, height: 2}))
    wall.body.name = 'wall-'+i
    world.addBody(wall.body)
    walls.push(wall)
  
    let wallBox = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 2),
      new THREE.MeshBasicMaterial({ color: Colors.WALL })
    )
    wallBox.name = 'wall-'+i
    wallBox.position.set(wallPositions[i][0], wallPositions[i][1], wallPositions[i][2])
    scene.add(wallBox)
  }
}

const createEnemies = (scene, enemies, world) => {
  let enemyPositions = [[0, -1]]
  for (let i = 0; i < enemyPositions.length; i++) {
    let enemy = {}
    enemy.body = new p2.Body({ mass: 1, position: [enemyPositions[0][0], enemyPositions[0][1]] })
    enemy.body.addShape(new p2.Circle({ radius: 0.1 }))
    world.addBody(enemy.body)
    enemies.push(enemy)

    let enemyCircle = new THREE.Mesh(
      new THREE.CircleBufferGeometry(0.1, 36),
      new THREE.MeshBasicMaterial({ color: Colors.ENEMY })
    )
    enemyCircle.name = 'enemy-'+i
    enemyCircle.position.set(enemyPositions[0][0], enemyPositions[0][1], 0)
    scene.add(enemyCircle)
  }
}

const createPlayer = (scene, player, world) => {
  player.speed = 2
  player.up = 0
  player.down = 0
  player.left = 0
  player.right = 0
  player.pause = false
  player.body = new p2.Body({
    mass: 1,
    fixedRotation: true,
    position: [0, 0],
    damping: 0.5
  })
  player.body.addShape(new p2.Circle({ radius: 0.1 }))
  world.addBody(player.body)

  let playerCircle = new THREE.Mesh(
    new THREE.CircleBufferGeometry(0.1, 36),
    new THREE.MeshBasicMaterial({ color: Colors.PLAYER })
  )
  playerCircle.name = 'player'
  playerCircle.position.set(0, 0, 0)
  scene.add(playerCircle)
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