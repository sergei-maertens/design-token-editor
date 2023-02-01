import React from 'react';

export type TokenEditorContextType = {
  onValueChange: (token: string, newValue: string) => void;
  tokenValues: {
    [key: string]: string;
  };
  mode: 'documentation' | 'edit';
};

const TokenEditorContext = React.createContext<TokenEditorContextType | null>(null);
TokenEditorContext.displayName = 'TokenEditorContext';

export default TokenEditorContext;
