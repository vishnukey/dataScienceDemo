const POINT_SIZE = 5

/*
 * this function is called when the web page is done loading
 * it sets up the canvas, performs an initial draw and then
 * sets up a the canvas to be re-rendered every 3 seconds
 */
async function ready(){
  const canvas = document.querySelector("#cnv") // get the canvas
  const ctx = canvas.getContext("2d") // get the rendering contex

  const renderFunc = makeRenderFunc(ctx)

  renderFunc(true)

  const looper = setInterval(renderFunc, 3000)
}

/*
 * given a context, produces a function that will render the points to the canvas
 * @param ctx the context object of a canvas to be draw to
 * @return an asynchornous function that draws to the canvas
 */
function makeRenderFunc(ctx){

  /*
   * an asynchornous function that fetches new data if it exists and then
   * renders the data to the canvas if it exists
   *
   * @param force forces the drawing of data even if there is no new Data
   */
  return async function(force = false){
    //fetch the points form /points
    const {newData, points, colours} = await getPoints(force)

    // quit if there is no new data and rendering isn't forced
    if (!newData && !force) return

    const imageData = ctx.createImageData(400, 400)
    console.log(imageData)
    for (let i = 0; i < imageData.data.length; i += 4){
      const colour = hexToRGBA(chooseFromArray(colours))
      imageData.data[i]   = colour.r
      imageData.data[i+1] = colour.g
      imageData.data[i+2] = colour.b
      imageData.data[i+3] = colour.a
    }

    console.log(imageData)

    ctx.putImageData(imageData, 0, 0)

    /*//render data to canvas
    for (const point of points){
      //set colour to be drawn
      ctx.fillStyle = point.colour

      //render the point as a small square
      ctx.fillRect(point.point.x, point.point.y, POINT_SIZE, POINT_SIZE)

      //return drawing colour to a default value
      ctx.fillStyle = "white"
    }*/
  }
}

function hexToRGBA(hex){
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
    a: 255
  }
}

function chooseFromArray(arr){
  const min = 0
  const max = arr.length
  return arr[randomInt(min, max)]
}

function randomInt(lb, ub){
        return Math.floor((Math.random() * (ub - lb)) + lb)
}

/*
 * check to see if new data is available, and if it is, the fetch interval
 *
 * @param force force the retrieval of data, even if it's old
 * @return a promise to an object containing a flag for new data and the data if it exists
 */
async function getPoints(force = false){
  // Check to see if there is new data available
  const newDataResponse = await fetch("./newdata") //fetch /newdata endpoint
  const newDataJson = await newDataResponse.json() //convert response to an object
  const newData = newDataJson.value

  let points = []
  let colours = []

  //If there is new data, or if the flag is true, the get the points data from the server
  if (newData || force){
    const response = await fetch("./points") //fetch /points endpoint
    const jsonData = await response.json()
    points = jsonData.points
    console.log(jsonData.colourData)

    colours = Object.keys(jsonData.colourData.colours)
      .map(key => ({colour:key, count:jsonData.colourData.colours[key]}))
      .flatMap(c => Array(c.count).fill(c))
      .map(c => c.colour)
      //.sort((x, y) => x.count - y.count)
    console.log(colours)
  }

  return {newData, points, colours}
}
