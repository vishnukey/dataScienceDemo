async function ready(){
  const canvas = document.querySelector("#cnv")
  const ctx = canvas.getContext("2d")

  //fetch the points form /points
  const points = await getPoints()

  const pointSize = 5

  //render points to canvas
  for (const point of points){
    ctx.fillStyle = point.colour
    ctx.fillRect(point.x, point.y, pointSize, pointSize)
    ctx.fillStyle = "white"
  }

  

}

async function getPoints(){
  const data = await fetch("./points")
  const points = await data.json()
  console.log(points)
  return points
}
