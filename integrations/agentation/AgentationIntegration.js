import { AgentationManager } from '../../core/agentation-manager/AgentationManager.js';

export class AgentationIntegration {
  static configure(projectInfo, options = {}) {
    const manager = new AgentationManager({ projectRoot: projectInfo.projectPath });
    return manager.configure(projectInfo, options);
  }
}

export default AgentationIntegration;

