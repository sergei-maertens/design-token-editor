import React, {useContext} from 'react';
import clsx from 'clsx';
import Color from 'color';

import TokenEditorContext, {TokenEditorContextType} from './Context';
import ColorPreview, {isColor} from './ColorPreview';
import TokenValueInput from './TokenValueInput';

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

  const currentValue = context?.tokenValues?.[tokenPath] || value;
  const currentValueIsColor = isColor(currentValue);
  const originalValueIsColor = isColor(original.value);
  const currentColor = currentValueIsColor ? Color(currentValue).hex() : '';

  const inputProps =
    context === null
      ? {
          defaultValue: currentValueIsColor ? currentColor : '',
          readOnly: true,
        }
      : {
          value:
            context.tokenValues[tokenPath] || currentValueIsColor ? currentColor : '',
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            context.onValueChange(tokenPath, e.target.value),
        };

  return (
    <div className="dte-token-row" id={getTokenHtmlID(tokenPath)}>
      <div className="dte-token-row__token-name">{tokenPath}</div>

      <div className="dte-token-row__token-value">
        <TokenValueInput
          name={tokenPath}
          type={currentValueIsColor ? 'color' : 'text'}
          defaultTokenValue={value}
          {...inputProps}
        />
        {currentValueIsColor && <ColorPreview color={currentValue} />}
      </div>

      <div
        className={clsx('dte-token-row__token-source', {
          'dte-token-row__token-source--color': originalValueIsColor,
        })}
      >
        {originalValueIsColor ? (
          <ColorPreview color={original.value} />
        ) : (
          original.value
        )}
      </div>
    </div>
  );
};

export default TokenRow;
