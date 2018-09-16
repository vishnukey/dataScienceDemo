const POINT_SIZE = 5

const clrs = new ColourQueue()
let boxes

/*
 * this function is called when the web page is done loading
 * it sets up the canvas, performs an initial draw and then
 * sets up a the canvas to be re-rendered every 3 seconds
 */
async function ready(){
  boxes = makeBoxes(0, 10)


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
  return async function(force=false){
    //fetch the points form /points
    const {newData, colours} = await getPoints(force)

    // quit if there is no new data and rendering isn't forced
    if (!newData && !force) return

    //create separate buffer to draw to, to avoid extra repaints
    const imageData = ctx.createImageData(400, 400)

    //set each pixel to a random colour
    for (let i = 0; i < imageData.data.length; i += 4){
      const colour = chooseFromArray(colours)

      imageData.data[i]   = colour.r
      imageData.data[i+1] = colour.g
      imageData.data[i+2] = colour.b
      imageData.data[i+3] = colour.a
    }

    //render the buffer to the canvas
    ctx.putImageData(imageData, 0, 0)

    clrs.render(document.querySelector("#recent-colours"))
  }
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

  let colours = []

  //If there is new data, or if the flag is true, the get the points data from the server
  if (newData || force){
    const response = await fetch("./points") //fetch /points endpoint
    const {colourData, lastColour} = await response.json()

    clrs.enqueue(lastColour)

    while(clrs.length() > 5) clrs.dequeue()

    if (!(Object.keys(colourData).length === 0)){
      /*
       * Take the object that maps colour codes to number of occurences and then turn it into
       * and array of objects that contain colour and # of occurences and then
       * and then convert the colour code to an rgb object
       * make each object in the array occur as many times as its # of occurences field
       * and finally convert to just and array of rgb objects
       */
      colours = Object.keys(colourData)
        .map(key => ({colour:key, count:colourData[key]}))
        //.map(({colour, count}) => {clrs.enqueue(colour); return {colour, count}})
        .map(({colour, count}) => ({colour:colourCodeToConstrainedHue(colour), count}))
        .flatMap(c => Array(c.count).fill(c))
        .map(c => c.colour)
      }else{
        colours = [{r:255, g:255, b:255, a:255}]
      }

      console.log(boxes)
      const total = boxes.reduce((acc, box) => acc + box.count, 0)
      console.log(total)
      boxes.forEach(box => box.textNode.nodeValue = `${box.count / total}%`)
  }

  return {newData, colours}
}
