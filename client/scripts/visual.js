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
    const jsonData = await response.json()

    console.log(jsonData.colourData)
    console.log(Object.keys(jsonData.colourData))

    if (!(Object.keys(jsonData.colourData).length === 0)){
      /*
       * Take the object that maps colour codes to number of occurences and then turn it into
       * and array of objects that contain colour and # of occurences and then
       * and then convert the colour code to an rgb object
       * make each object in the array occur as many times as its # of occurences field
       * and finally convert to just and array of rgb objects
       */
      colours = Object.keys(jsonData.colourData)
        .map(key => ({colour:key, count:jsonData.colourData[key]}))
        .map(({colour, count}) => ({colour:colourCodeToContrainedHue(colour), count}))
        .flatMap(c => Array(c.count).fill(c))
        .map(c => c.colour)
      }else{
        colours = [{r:255, g:255, b:255, a:255}]
      }
  }

  console.log(colours)

  return {newData, colours}
}


/*
 * converts a hex string of form #RRGGBB to a object of RGBA values, where A is all maxed out
 *
 * @param hex the hex string to be converted
 * @return an object containing rgb values in integer form
 */
function hexToRGBA(hex){
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
    a: 255
  }
}

/*
 * returns a random element from an array
 *
 * @param arr the array to select an random element from
 * @return the random element
 */
function chooseFromArray(arr){
  const min = 0
  const max = arr.length
  return arr[randomInt(min, max)]
}

/*
 * returns a random integer in the range [lb, ub)
 *
 * @param lb the lowerbound of the range to choose from
 * @param ub the upperbound of the range to choose from
 * @return the random integer
 */
function randomInt(lb, ub){
        return Math.floor((Math.random() * (ub - lb)) + lb)
}

function constrainToHueVariance(rgb){
  const [h, s, v] = rgbToHsv(rgb.r, rgb.g, rgb.b)
  const [r, g, b] = hsvToRgb(h, 1, 1)
  return {r, g, b, a:rgb.a}
}

function colourCodeToContrainedHue(colourCode){
    const rgb = hexToRGBA(colourCode)
    return constrainToHueVariance(rgb)
}


//retrieved from https://gist.github.com/mjackson/53112564
function rgbToHsv(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, v ];
}

function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [ r * 255, g * 255, b * 255 ];
}
