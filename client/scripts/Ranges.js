function makeBoxes(start, step){
  let boxes = []

  for (let i = 0; i < 360; i += step * 2){
    const lowerBound = toPositiveAngle(start + i - step)
    const middle = toPositiveAngle(start + i)
    const upperBound = toPositiveAngle(start + i + step)

    const box = new Box(hue => {

      return (hue >= lowerBound) || (hue < upperBound)
    }, RBGtoHex(hsvToRgb(middle, 1, 1))

    boxes.push(box)
  }

  return boxes
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
