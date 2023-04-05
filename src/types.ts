export type JSONType = string | boolean | number | null | JSONType[] | JSONObject;

interface JSONObject {
  [key: string]: JSONType;
}

interface DesignTokenExtensions {
  'dte.metadata'?: {
    isCurated?: boolean;
    category?: 'color' | 'spacing' | 'component';
    stateType?: 'userAction' | 'component' | 'appearance';
  };
}

interface GroupExtensions {
  'dte.metadata'?: {
    groupDescription?: string;
  };
}

export interface DesignToken {
  name: string;
  value: string;
  comment?: string;
  $extensions?: DesignTokenExtensions;
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
export type DesignTokenContainer =
  | DesignToken
  | ({[key: string]: DesignTokenContainer} & {$extensions?: GroupExtensions});

export type TopLevelContainer = {
  [key: string]: DesignTokenContainer;
};
