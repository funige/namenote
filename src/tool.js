
class Tool {
  constructor(options) {
    this.options = options || {};
  }

  destructor() {
    this.options = null;
  }

  start() {
    //console.log(`[${this.name} start]`);
  }

  stop() {
    //console.log(`[${this.name} stop]`);
  }

  onDown(e) {
  }

  onUp(e) {
  }

  onMove(e) {
  }
}

export { Tool };
