import fs from 'node:fs';
import path from 'node:path';
import { ProjectDetector } from '../project-detector/ProjectDetector.js';

/**
 * ProjectManager
 * Manages project workspace lifecycle, status verification, and configuration health.
 */
export class ProjectManager {
  constructor(projectDir = process.cwd()) {
    this.projectDir = path.resolve(projectDir);
  }

  isInitialized() {
    const brainDir = path.join(this.projectDir, 'ai-brain');
    return fs.existsSync(brainDir) && fs.existsSync(path.join(brainDir, 'context.md'));
  }

  getStatus() {
    const info = ProjectDetector.detect(this.projectDir);
    const initialized = this.isInitialized();
    const hasGraph = fs.existsSync(path.join(this.projectDir, 'graph.json'));

    return {
      projectPath: this.projectDir,
      projectName: info.projectName,
      framework: info.framework,
      languages: info.languages,
      packageManager: info.packageManager,
      isInitialized: initialized,
      hasGraph,
      hasAgentation: info.hasAgentation,
      health: initialized && hasGraph ? 'Healthy' : 'Needs Initialization'
    };
  }
}

export default ProjectManager;

