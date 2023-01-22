import React, {useContext} from 'react';
import TokenEditorContext, {TokenEditorContextType} from './Context';

export type DesignToken = {
  name: string;
  value: string;
  original: {
    value: string;
  }
  path: string[];
  attributes: {
    [key: string]: string;
  }
}

const getTokenHtmlID = (token: string) => `dte-token-${token}`;

export interface TokenRowProps  {
  designToken: DesignToken;
}

const TokenRow = ({designToken}: TokenRowProps): JSX.Element => {
  const context = useContext(TokenEditorContext) as TokenEditorContextType;

  const { value, original, path } = designToken;
  const tokenPath = path.join('.');

  const inputProps = (context === null)
    ? {defaultValue: '', readOnly: true}
    : {
        value: context.tokenValues[tokenPath] || '',
        onChange: (
          e: React.ChangeEvent<HTMLInputElement>
        ) => context.onValueChange(tokenPath, e.target.value),
    };

  return (
    <tr>
      <td id={getTokenHtmlID(tokenPath)} style={{padding: '.5em'}}>
        <code>{tokenPath}</code>
      </td>
      <td style={{padding: '.5em'}}>
        <input
          name={tokenPath}
          type="text"
          placeholder={value}
          {...inputProps}
        />
      </td>
      <td style={{padding: '.5em'}}>
        <code>{original.value}</code>
      </td>
    </tr>
  );
};

export default TokenRow;
