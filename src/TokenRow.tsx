import React, {useContext} from 'react';
import clsx from 'clsx';

import TokenEditorContext, {TokenEditorContextType} from './Context';
import ColorPreview, {isColor} from './ColorPreview';

export type DesignToken = {
  name: string;
  value: string;
  original: {
    value: string;
  };
  path: string[];
  attributes: {
    [key: string]: string;
  };
};

const getTokenHtmlID = (token: string) => `dte-token-${token}`;

export interface TokenRowProps {
  designToken: DesignToken;
}

const TokenRow = ({designToken}: TokenRowProps): JSX.Element => {
  const context = useContext(TokenEditorContext) as TokenEditorContextType;

  const {value, original, path} = designToken;
  const tokenPath = path.join('.');

  const inputProps =
    context === null
      ? {defaultValue: '', readOnly: true}
      : {
          value: context.tokenValues[tokenPath] || '',
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            context.onValueChange(tokenPath, e.target.value),
        };

  const currentValue = context?.tokenValues?.[tokenPath] || value;
  const originalValueIsColor = isColor(tokenPath, original.value);

  return (
    <tr>
      <td colSpan={3}>
        <div className="dte-token-row" id={getTokenHtmlID(tokenPath)}>
          <div className="dte-token-row__token-name">{tokenPath}</div>

          <div className="dte-token-row__token-value dte-token-value">
            <input
              className="dte-token-value__input"
              name={tokenPath}
              type="text"
              placeholder={value}
              size={8}
              {...inputProps}
            />
            <ColorPreview token={tokenPath} value={currentValue} />
          </div>

          <div
            className={clsx('dte-token-row__token-source', {
              'dte-token-row__token-source--color': originalValueIsColor,
            })}
          >
            {originalValueIsColor ? (
              <ColorPreview token={tokenPath} value={original.value} />
            ) : (
              original.value
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TokenRow;
