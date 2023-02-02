import {DesignTokenContainer} from './types';

export const isDesignToken = (node: DesignTokenContainer) => {
  return typeof node === 'object' && 'value' in node;
};

/**
 * Check if the node is a container that has _some_ design token leaf node.
 */
export const isContainer = (node: DesignTokenContainer): boolean => {
  if (typeof node !== 'object') return false;
  const children = Object.values(node);
  const hasDesignTokens = children.some(child => isDesignToken(child));
  if (hasDesignTokens) return true;
  return children.some(child => isContainer(child));
};
