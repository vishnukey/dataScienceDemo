function Box(matcher, rep, textNode){
  this.count = 0
  this.rep = rep
  this.match = (x) => {
    accepting = matcher(x)
    if (accepting) this.count++
    return accepting
  }
  this.textNode = textNode
}
