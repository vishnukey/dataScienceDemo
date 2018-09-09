const express = require('express')
const app = express()

app.use(express.static('client'))

app.get('/', (req, res) => res.send('Hello World!'))

let points = [
  {x: 100, y:200, colour:"#FF00FF"},
  {x: 133, y: 331, colour: "#00FF00"},
  {x: 200, y: 200, colour: "#0000FF"}
]

let newData = true

app.post("/update", (res, req) => {
  // get colour from request

  //generate random point between (0, 0) and (400, 400)

  //add point with colour to points

  //redirected response to /collect.html
})

app.get("/points", (req, res) => {
  console.log("got request")
  res.send(JSON.stringify({newData, points}))
  newData = false
  //res.send(JSON.stringify({newData:false}))
})

app.get("/newdata", (req, res) => {
  console.log("data queried")
  res.send(JSON.stringify({value:newData}))
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
