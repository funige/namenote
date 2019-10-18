import { PenTool } from './pen-tool.js';
import { EraserTool } from './eraser-tool.js';
import { TextTool } from './text-tool.js';

class ToolManager {
  constructor() {
    this.tools = [];
    this.stack = [];
  }

  addTool(tool) {
    this.tools.push(tool);
  }

  currentTool() {
    return this.stack[0];
  }

  select(name) {
    const newTool = this.tools.find((tool) => tool.name === name);
    if (!newTool) return;

    const oldTool = this.stack.pop();
    this.stack.push(newTool);

    oldTool.stop();
    newTool.start();
  }

  push(name) {
    const newTool = this.tools.find((tool) => tool.name === name);
    if (!newTool) return;

    if (this.stack.length > 0) {
      const oldTool = this.stack[0];
      oldTool.stop();
    }
    this.stack.push(newTool);
    newTool.start();
  }

  pop() {
    if (this.stack.length > 0) {
      const oldTool = this.stack.pop();
      oldTool.stop();
    }
    const newTool = this.stack[0];
    newTool.start();
  }
}

const toolManager = new ToolManager();
toolManager.addTool(new PenTool());
toolManager.addTool(new EraserTool());
toolManager.addTool(new TextTool());
toolManager.push('pen');

export { toolManager };
