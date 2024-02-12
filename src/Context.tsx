import React from 'react';

export type TokenEditorContextType = {
  onValueChange: (token: string[], newValue: string) => void;
  tokenValues: Map<string[], string>;
};

const TokenEditorContext = React.createContext<TokenEditorContextType | null>(null);
TokenEditorContext.displayName = 'TokenEditorContext';

export default TokenEditorContext;
