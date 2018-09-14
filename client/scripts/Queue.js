function ColourQueue(){
  this.colours = []

  this.enqueue = x => this.colours.unshift(x)

  this.dequeue = x => this.colours.pop()

  this.length = () => this.colours.length

  this.render = parent => {
    for (const colour of this.colours){
      item = document.createElement("li")
      
    }
  }
}
