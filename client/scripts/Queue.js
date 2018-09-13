function Queue(){
  this.internal = []

  this.enqueue = x => this.internal.unshift(x)

  this.dequeue = x => this.internal.pop()

  this.length = () => this.internal.length

  this.render = parent => {
    
  }
}
