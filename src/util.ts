import {JSONType} from './types';

export const isDesignToken = (node: JSONType) => {
  return node && typeof node === 'object' && 'value' in node;
};

/**
 * Check if the node is a container that has _some_ design token leaf node.
 */
export const isContainer = (node: JSONType): boolean => {
  if (!node || typeof node !== 'object') return false;
  const children = Object.values(node);
  const hasDesignTokens = children.some(child => isDesignToken(child));
  if (hasDesignTokens) return true;
  return children.some(child => isContainer(child));
};
