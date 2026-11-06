import React from 'react';
import { Agentation } from 'agentation';

/**
 * Universal React Dev-Only Wrapper for Agentation
 * Safely tree-shaken in production builds.
 */
export function AgentationDevWrapper() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <Agentation />;
}

export default AgentationDevWrapper;

