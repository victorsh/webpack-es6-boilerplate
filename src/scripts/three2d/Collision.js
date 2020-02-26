export const circleCollision = (x1, y1, r1, x2, y2, r2) => {
  return (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) < (r1 + r2))
}

export const rectagleCollision = (x1, y1, x2, y2, w1, h1, w2, h2) => {
  return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2)
}

export const circleRectangleCollision = (cx, cy, r, rx, ry, rw, rh) => {
  const circleDistanceX = Math.abs(cx - rx)
  const circleDistanceY = Math.abs(cy - ry)

  if (circleDistanceX > (rw / 2 + r)) return false
  if (circleDistanceY > (rh / 2 + r)) return false

  if (circleDistanceX <= (rw / 2)) return true
  if (circleDistanceY <= (rh / 2)) return true

  const cdsq = Math.pow(circleDistanceX - rw / 2, 2) + Math.pow(circleDistanceY - rh/2, 2)
  return (cdsq <= Math.pow(r, 2))
}

// if (this.circleCollision(player.position.x, player.position.y, player.geometry.parameters.radius, enemy.position.x, enemy.position.y, enemy.geometry.parameters.radius)) {
//   console.log('circle-collision')
// }

// if (this.circleRectangleCollision(
//   player.position.x, player.position.y, player.geometry.parameters.radius,
//   obstacle.position.x, obstacle.position.y, obstacle.geometry.parameters.width, obstacle.geometry.parameters.height
// )) {

// }
