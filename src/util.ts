import {JSONType, DesignToken, DesignTokenContainer} from './types';

export function isDesignToken<T extends JSONType = DesignToken>(
  node: JSONType
): node is T {
  // rule out null, false...
  if (!node) return false;
  // rule out primitives
  if (typeof node !== 'object') return false;
  return 'value' in node;
}

/**
 * Check if the node is a container that has _some_ design token leaf node.
 */
export const isContainer = (node: JSONType): node is DesignTokenContainer => {
  if (!node || typeof node !== 'object') return false;
  const children = Object.values(node);
  const hasDesignTokens = children.some(child => isDesignToken(child));
  if (hasDesignTokens) return true;
  return children.some(child => isContainer(child));
};
