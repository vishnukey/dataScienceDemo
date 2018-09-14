function ColourQueue(){
  this.colours = []

  this.enqueue = x => this.colours.unshift(x)

  this.dequeue = x => this.colours.pop()

  this.length = () => this.colours.length

  this.render = parent => {
    parent.childNodes.forEach(node => parent.removeChild(node))
    for (const colour of this.colours){
      const item = document.createElement("li")

      const attr = document.createAttribute("style")
      attr.value =`background-color:${colour};`

      item.setAttribute("style", `background-color:${colour};`)
      item.setAttribute("class", "recent-colour")

      parent.appendChild(item)
    }
  }
}
