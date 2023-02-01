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

  const editorMode = context?.mode || 'documentation';
  const currentValue = context?.tokenValues?.[tokenPath] || value;
  const currentValueIsColor = isColor(currentValue);
  const originalValueIsColor = isColor(original.value);
  const currentColor = currentValueIsColor ? Color(currentValue).hex() : '';

  const inputProps =
    editorMode !== 'edit'
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
      <div className="dte-token-row__token-name">
        <span className="dte-code dte-code--inline">{tokenPath}</span>
      </div>

      <div className="dte-kv dte-token-row__token-value-container">
        <div className="dte-kv__key">Value:</div>
        <div className="dte-kv__value dte-token-row__token-value">
          {editorMode === 'documentation' ? (
            <span className="dte-code dte-code--inline">{value}</span>
          ) : (
            <TokenValueInput
              name={tokenPath}
              type={currentValueIsColor ? 'color' : 'text'}
              defaultTokenValue={value}
              {...inputProps}
            />
          )}
          {currentValueIsColor && <ColorPreview color={currentValue} />}
        </div>
      </div>

      <div className="dte-kv dte-token-row__token-source-container">
        <div className="dte-kv__key" title="Source of (default) value">
          Source:
        </div>
        <div
          className={clsx('dte-kv__value', 'dte-token-row__token-source', {
            'dte-token-row__token-source--color': originalValueIsColor,
          })}
        >
          {originalValueIsColor ? (
            <ColorPreview color={original.value} />
          ) : (
            <span className="dte-code dte-code--inline">{original.value}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenRow;
