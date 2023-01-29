import {DesignToken} from './TokenRow';

/**
 * Key-value mapping, where the value may be a design token (leaf node) or another
 * container.
 */
export type DesignTokenContainer = DesignToken | {[key: string]: DesignTokenContainer};

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
