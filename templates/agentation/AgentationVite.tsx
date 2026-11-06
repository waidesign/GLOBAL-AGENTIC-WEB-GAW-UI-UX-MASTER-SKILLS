import React from 'react';
import { Agentation } from 'agentation';

/**
 * Vite Dev-Only Wrapper for Agentation
 * Evaluates `import.meta.env.DEV` at build time.
 */
export function AgentationVite() {
  if (!import.meta.env.DEV) {
    return null;
  }

  return <Agentation />;
}

export default AgentationVite;

