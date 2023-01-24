import React, {useContext} from 'react';

import TokenEditorContext, {TokenEditorContextType} from './Context';
import ColorPreview, {isColor} from './ColorPreview';

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

  const currentValue = context?.tokenValues?.[tokenPath] || value;

  return (
    <tr>
      <td id={getTokenHtmlID(tokenPath)} style={{padding: '.5em'}}>
        <code>{tokenPath}</code>
      </td>
      <td style={{padding: '.5em'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: '2em'}}>
          <input
            name={tokenPath}
            type="text"
            placeholder={value}
            size={8}
            {...inputProps}
          />
          <ColorPreview token={tokenPath} value={currentValue} />
        </div>
      </td>
      <td style={{padding: '.5em'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: '.5em'}}>
          {
            isColor(tokenPath, original.value) ?
              <ColorPreview token={tokenPath} value={original.value} />
              : <code style={{flexGrow: '1'}}>{original.value}</code>
          }
        </div>
      </td>
    </tr>
  );
};

export default TokenRow;
