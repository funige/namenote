import { PenTool } from './pen-tool.js';
import { EraserTool } from './eraser-tool.js';
import { HandTool } from './hand-tool.js';
import { TextTool } from './text-tool.js';
import { TextMoveTool } from './text-move-tool.js';

class ToolManager {
  constructor() {
    this.tools = [];
    this.stack = [];
  }

  addTool(tool) {
    this.tools.push(tool);
  }

  currentTool() {
    return this.stack[this.stack.length - 1];
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
    console.warn('push ' + newTool.name, this.stack);
  }

  pop() {
    if (this.stack.length > 1) {
      const oldTool = this.stack.pop();
      oldTool.stop();
      console.warn('pop ' + oldTool.name, this.stack);
      const newTool = this.stack[0];
      newTool.start();
    } else {
      console.warn('toolManager: not popped', this.currentTool().name);
    }
  }
}

const toolManager = new ToolManager();
toolManager.addTool(new PenTool());
toolManager.addTool(new EraserTool());
toolManager.addTool(new TextTool());
toolManager.addTool(new HandTool());
toolManager.addTool(new TextMoveTool());

toolManager.push('pen');

export { toolManager };
