function ColourQueue(){
  this.colours = []

  this.enqueue = x => this.colours.unshift(x)

  this.dequeue = x => this.colours.pop()

  this.length = () => this.colours.length

  this.render = parent => {

    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }

    for (const colour of this.colours){
      const item = document.createElement("li")

      item.setAttribute("style", `background-color:${colour};`)
      item.setAttribute("class", "recent-colour")

      parent.appendChild(item)
    }
  }
}
