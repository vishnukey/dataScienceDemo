function makeBoxes(start, step){
  let boxes = []

  const parent = document.querySelector("#colour-percents")

  for (let i = 0; i < 360; i += step * 2){
    const lowerBoundAngle = toPositiveAngle(start + i - step)
    const middleAngle = toPositiveAngle(start + i)
    const upperBoundAngle = toPositiveAngle(start + i + step)

    const lowerBound = map(lowerBoundAngle, 0, 360, 0, 1)
    const middle = map(middleAngle, 0, 360, 0, 1)
    const upperBound = map(upperBoundAngle, 0, 360, 0, 1)

    const repColour = RBGtoHex(hsvToRgb(middle, 1, 1))

    const item = document.createElement("li")
    const colourBox = document.createElement("span")
    const text = document.createTextNode("0%")

    //item.setAttribute("style", `background-color:${repcolour};`)
    item.setAttribute("class", "colour-percent")
    item.setAttribute("id", `colour-box-${middle}`)

    colourBox.setAttribute("class", "colour-box")
    colourBox.setAttribute("style", `background-color:${repColour}`)

    item.appendChild(colourBox)
    item.appendChild(text)


    parent.appendChild(item)

    const box = new Box(
      hue => {
        const matches = (hue >= lowerBound) && (hue < upperBound)
        console.log(`${lowerBound} < ${hue} < ${upperBound} is ${matches}`)
        return matches
      },
      repColour,
      text)

    boxes.push(box)
  }

  return boxes
}

function map(s, a1, a2, b1, b2)
{
    return b1 + (s-a1)*(b2-b1)/(a2-a1);
}

function toPositiveAngle(x){
  if (x > 360){
    return x - 360
  } else if(x < 0){
    return 360 - x
  } else{
    return x
  }
}
