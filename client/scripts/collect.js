function update(){
  // get value for input (id: #color)
  const elem = document.querySelector("#colour")
  const colour = elem.value
  console.log(colour)

  const res = postData("./update", {colour})
}

async function postData(url = ``, data = {}, extraOptions = {}, extraHeaders = {}) {
  // Default options are marked with *
  const baseHeaders = {
          "Content-Type" : "application/json"
  }

  const headers = Object.assign(baseHeaders, extraHeaders)

  const body = JSON.stringify(data)

  const baseOptions = {
          method: "POST",
          headers,
          body
  }

  const options = Object.assign(baseOptions, extraOptions)

  console.log(options)

  const response = await fetch(url, options)

  const json = await response.json()

  return json
}
