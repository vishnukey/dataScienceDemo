const express = require('express')
const app = express()
const bodyparser = require("body-parser")

//Middleware, modify requests before the rest of the server deals with them
app.use(bodyparser.json()) //handles request with Content-Type: application/json
app.use(express.static('client')) //statically serves files in directory client/


//globals
let points = [
  {point: {x: 100, y:200}, colour: "#FF00FF"},
  {point: {x: 133, y: 331}, colour: "#00FF00"},
  {point: {x: 200, y: 200}, colour: "#0000FF"}
]

let newData = true

//request handlers

// handles post requests to update
app.post("/update", (req, res) => {
  // get colour from request
  const body = req.body
  const colour = body.colour

  //generate random point between (0, 0) and (400, 400)
  const point = randomPoint(max = 400)

  //add point with colour to points
  points.push({point, colour})
  newData = true //flag a change as having been made

  //dummy data, not used but closes connection
  res.send(JSON.stringify({value:"recevied"}))
})

// handles get requests to points
app.get("/points", (req, res) => {
  // send points to the client as well as a flag if there is new data
  res.send(JSON.stringify({newData, points}))

  // flag that the most recent data has been sent to the client
  newData = false
})

// handles get requests to newdata
app.get("/newdata", (req, res) => {
  res.send(JSON.stringify({value:newData}))
})

// start the server on port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'))

//helper functions

/*
 * generates a random integer between lb and ub
 *
 * @param lb the lower bound
 * @param ub the upper bound
 * @return a random integer
 */
function randomInt(lb, ub){
        return Math.floor((Math.random() * (ub - lb)) + lb)
}

/*
 * generates a random point bounded in the square defined by (min, min) and (max, max)
 *
 * @param min the x, y of the top left corner of the bounding square
 * @param max the x, y of the bottom right corner of the bounding square
 * @return the random point
 */
function randomPoint(min = 0, max = 0){
        const point = new Point(
                randomInt(min, max),
                randomInt(min, max)
        )

        return point
}


// Constructor functions
// used with 'new' operator, like class definitions

/*
 * a constructor function to produce Point objects with an x and y
 * not meant to be called without 'new' operator
 *
 * @param x the x coordinate
 * @param y the y coordinate
 * @return undefined
 */
function Point(x, y){
        this.x = x
        this.y = y
}
