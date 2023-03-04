import React from 'react';

export type TokenEditorContextType = {
  onValueChange: (token: string, newValue: string) => void;
  tokenValues: {
    [key: string]: string;
  };
};

const TokenEditorContext = React.createContext<TokenEditorContextType | null>(null);
TokenEditorContext.displayName = 'TokenEditorContext';

export default TokenEditorContext;
