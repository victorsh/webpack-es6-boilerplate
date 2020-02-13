export const test = () => {
  console.log('testy')
  let canvas = document.createElement('canvas')
  canvas.setAttribute('id', 'myCanvas')
  canvas.setAttribute('width', '100%')
  canvas.setAttribute('height', '100%')
  canvas.setAttribute('style', 'border:1px solid #000000')
  document.body.appendChild(canvas)
  canvas = document.getElementById('myCanvas')
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#FF0000'
  ctx.fillRect(0, 0, 50, 50)
}
