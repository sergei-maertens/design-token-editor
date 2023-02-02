export interface DesignToken {
  name: string;
  value: string;
  original: {
    value: string;
  };
  path: string[];
  attributes: {
    [key: string]: string;
  };
  [key: string]: any;
}

/**
 * Key-value mapping, where the value may be a design token (leaf node) or another
 * container.
 */
export type DesignTokenContainer = DesignToken | {[key: string]: DesignTokenContainer};

export type TopLevelContainer = {
  [key: string]: DesignTokenContainer;
};
