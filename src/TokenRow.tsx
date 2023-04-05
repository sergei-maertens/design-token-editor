import React, {useContext, useState} from 'react';
import clsx from 'clsx';
import Color from 'color';

import TokenEditorContext, {TokenEditorContextType} from './Context';
import ColorPreview, {isColor} from './ColorPreview';
import TokenValueInput from './TokenValueInput';
import {DesignToken} from './types';

type EditorMode = 'edit' | 'documentation';
type InputProps = {
  defaultValue?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const getTokenHtmlID = (token: string) => `dte-token-${token}`;

export interface TokenRowProps {
  designToken: DesignToken;
}

const TokenRow = ({designToken}: TokenRowProps): JSX.Element => {
  const context = useContext<TokenEditorContextType | null>(TokenEditorContext);
  const [editorMode, setEditorMode] = useState<EditorMode>('documentation');

  const {value, original, path, comment} = designToken;
  const tokenPath = path.join('.');

  const currentValue = context?.tokenValues?.[tokenPath] || value;
  const currentValueIsColor = isColor(currentValue);
  const originalValueIsColor = isColor(original.value);
  const currentColor = currentValueIsColor ? Color(currentValue).hex() : '';

  let inputProps: InputProps;
  switch (editorMode) {
    case 'documentation': {
      inputProps = {
        defaultValue: currentValueIsColor ? currentColor : '',
        readOnly: true,
      };
      break;
    }
    case 'edit': {
      inputProps = {
        value:
          context?.tokenValues[tokenPath] || (currentValueIsColor ? currentColor : ''),
      };
      if (context) {
        inputProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
          context.onValueChange(tokenPath, e.target.value);
      }
      break;
    }
  }

  return (
    <>
      <div className="dte-token-row" id={getTokenHtmlID(tokenPath)}>
        <div className="dte-token-row__token-name">
          <span className="dte-code dte-code--inline">{tokenPath}</span>
        </div>

        {comment ? (
          <p className="dte-token-docs dte-token-docs--inline">{comment}</p>
        ) : null}

        <div className="dte-kv dte-token-row__token-value-container">
          <div className="dte-kv__key">Value:</div>
          <div className="dte-kv__value dte-token-row__token-value">
            {context ? (
              <button
                className="dte-token-row__edit-icon"
                type="button"
                onClick={() =>
                  setEditorMode(
                    editorMode === 'documentation' ? 'edit' : 'documentation'
                  )
                }
                title="Edit"
                aria-label="Edit"
              >
                {' '}
                ✏️{' '}
              </button>
            ) : null}
            {editorMode === 'documentation' ? (
              <span className="dte-code dte-code--inline">{currentValue}</span>
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

      {comment ? (
        <p className="dte-token-docs dte-token-docs--bottom">{comment}</p>
      ) : null}
    </>
  );
};

export default TokenRow;
