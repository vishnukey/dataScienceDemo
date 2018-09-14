const express = require('express')
const app = express()
const bodyparser = require("body-parser")

//Middleware, modify requests before the rest of the server deals with them
app.use(bodyparser.json()) //handles request with Content-Type: application/json
app.use(express.static('client')) //statically serves files in directory client/


//globals
let colourData = {} //maps colour codes to # of occurences

let newData = true
let lastColour = ''

//request handlers

// handles post requests to update
app.post("/update", (req, res) => {
  // get colour from request
  const body = req.body
  const colour = body.colour

  //increade number of request counter
  //colourData.count++

  //if the colour has never been chosen before, add it and set it's number of occurences to 1
  //otherwise, increment its number of occurences
  if(!(colour in colourData)) colourData[colour] = 1
  else colourData[colour]++

  newData = true //flag a change as having been made
  lastColour = colour

  //dummy data, not used but closes connection
  res.send(JSON.stringify({value:"recevied"}))
})

// handles get requests to points
app.get("/points", (req, res) => {
  console.log(JSON.stringify(colourData))
  // send points to the client as well as a flag if there is new data
  res.send(JSON.stringify({colourData, lastColour}))

  // flag that the most recent data has been sent to the client
  newData = false
})

// handles get requests to newdata
app.get("/newdata", (req, res) => {
  res.send(JSON.stringify({value:newData}))
})

// start the server on port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'))
