import { GraphifyManager } from '../../core/graphify-manager/GraphifyManager.js';

export class GraphifyIntegration {
  static generate(projectPath, options = {}) {
    const manager = new GraphifyManager({ projectRoot: projectPath });
    return manager.generateGraph(options);
  }
}

export default GraphifyIntegration;

