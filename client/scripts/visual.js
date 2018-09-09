const POINT_SIZE = 5

async function ready(){
  const canvas = document.querySelector("#cnv")
  const ctx = canvas.getContext("2d")

  const renderFunc = makeRenderFunc(ctx)

  renderFunc(true)

  const looper = setInterval(renderFunc, 3000)
}

function makeRenderFunc(ctx){
  return async function(force = false){
    //fetch the points form /points
    const {newData, points} = await getPoints(force)
    console.log(points)

    if (!newData && !force) return

    //render data to canvas
    for (const point of points){
      ctx.fillStyle = point.colour
      ctx.fillRect(point.x, point.y, POINT_SIZE, POINT_SIZE)
      ctx.fillStyle = "white"
    }
  }
}

async function getPoints(force = false){
  const newDataResponse = await fetch("./newdata")
  const newDataData = await newDataResponse.json()
  const newData = newDataData.value
  console.log(newData)
  let data = []
  if (newData || force){
    const response = await fetch("./points")
    const jsonData = await response.json()
    data = jsonData.points
  }

  return {newData, points:data}
}
