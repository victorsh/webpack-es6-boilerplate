/* eslint-disable */
import * as BABYLON from 'babylonjs'

export const babylonRunner = () => {
  const canvas = document.createElement('canvas')
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.setAttribute('id', 'renderCanvas')
  canvas.setAttribute('touch-action', 'none')
  canvas.addEventListener('mousedown', e => {
    e.preventDefault()
  })
  document.body.appendChild(canvas)

  const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }, false)

  const createScene = () => {
    const scene = new BABYLON.Scene(engine)
    const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
    camera.setTarget(BABYLON.Vector3.Zero())
    camera.attachControl(canvas, true)
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
    const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE)
    sphere.position.y = 1
    const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false)
    return scene
  }

  const scene = createScene()

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
}
