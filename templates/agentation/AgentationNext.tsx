'use client';

import React from 'react';
import { Agentation } from 'agentation';

/**
 * Next.js Client Component Wrapper for Agentation
 * Injected in root layout (`app/layout.tsx`).
 */
export function AgentationNext() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <Agentation />;
}

export default AgentationNext;

