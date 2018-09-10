/*
 * when the colour input selector has chnaged, send its new value to the server
 */
function update(){
  // get value for input (id: #color)
  const elem = document.querySelector("#colour") //get the colour input selector
  const colour = elem.value // get the inputs value

  const res = postData("./update", {colour}) // send the colour to the server
}

/*
 * POST some data to a url encoded as jsonData
 *
 * @param url the destination of the POST request
 * @param data the data to be sent
 * @param extraOptions additional options to be sent to the fetch function
 * @param extraHeaders additional headers for the POST request
 * @return a promise to the response data, as an object
 */
async function postData(url = ``, data = {}, extraOptions = {}, extraHeaders = {}) {
  // Form the options for the request

  // sending data encoded as json
  const baseHeaders = {
          "Content-Type" : "application/json"
  }

  // add any additional headers that there might be
  const headers = Object.assign(baseHeaders, extraHeaders)

  // encode the data as json
  const body = JSON.stringify(data)

 // minial object to pass to fetch for a POST request
  const baseOptions = {
          method: "POST",
          headers,
          body
  }

  // add any addition options that there might be
  const options = Object.assign(baseOptions, extraOptions)

  const response = await fetch(url, options) // send the request
  const json = await response.json() //covnert response body to an object

  return json
}
